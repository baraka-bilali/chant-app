import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

import { C, fontFamily } from './theme';

/** Design canvas is 1920×1080; the root scales it ×2 to 4K. */
export const W = 1920;
export const H = 1080;

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** 0 → 1 spring starting at `delay` frames. */
export function useIn(delay = 0, damping = 18) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.8, stiffness: 120 } });
}

/** Fade + rise entrance. */
export function Rise({ delay = 0, distance = 40, children, style }: { delay?: number; distance?: number; children: ReactNode; style?: CSSProperties }) {
  const p = useIn(delay, 20);
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * distance}px)`, ...style }}>{children}</div>
  );
}

/** Wraps a scene: fades in and out at its edges. */
export function Scene({ duration, children }: { duration: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12, duration - 14, duration], [0, 1, 1, 0], clamp);
  const scale = interpolate(frame, [0, duration], [1.015, 1], clamp);
  return <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>{children}</AbsoluteFill>;
}

/** Deep navy background with slowly moving glows and drifting music notes. */
export function Background() {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const notes = ['♪', '♫', '♩', '♬', '♪', '♫', '♩', '♪', '♬', '♫', '♪', '♩'];
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute', width: 1300, height: 1300, borderRadius: '50%',
          left: 900 + Math.sin(t / 5) * 160, top: -520 + Math.cos(t / 6) * 120,
          background: 'radial-gradient(circle, rgba(59,130,246,0.38), transparent 62%)',
        }}
      />
      <div
        style={{
          position: 'absolute', width: 1100, height: 1100, borderRadius: '50%',
          left: -420 + Math.cos(t / 7) * 140, top: 380 + Math.sin(t / 5) * 110,
          background: 'radial-gradient(circle, rgba(111,176,255,0.20), transparent 62%)',
        }}
      />
      {notes.map((n, i) => {
        const speed = 18 + (i % 4) * 7;
        const x = ((i * 157) % 1880) + 20;
        const y = (((1200 - ((t * speed + i * 211) % 1300)) % 1300) + 1300) % 1300 - 120;
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: x + Math.sin(t + i) * 24, top: y, fontSize: 34 + (i % 3) * 16,
              color: C.accent, opacity: 0.1, fontFamily, transform: `rotate(${Math.sin(t / 2 + i) * 14}deg)`,
            }}>
            {n}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

/** iPhone-like frame. Children are drawn inside the screen. */
export function Phone({ width, children, style }: { width: number; children: ReactNode; style?: CSSProperties }) {
  const height = (width * 844) / 390;
  const bezel = width * 0.034;
  const radius = width * 0.155;
  return (
    <div
      style={{
        position: 'absolute', width, height, borderRadius: radius, background: '#04070d', padding: bezel,
        boxShadow: '0 50px 120px rgba(0,0,0,0.55), inset 0 0 0 2px rgba(255,255,255,0.10)', ...style,
      }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: radius - bezel, overflow: 'hidden', background: '#0b0c0f' }}>
        {children}
        <div style={{ position: 'absolute', top: width * 0.03, left: '50%', width: width * 0.3, height: width * 0.075, transform: 'translateX(-50%)', background: '#000', borderRadius: 99, zIndex: 20 }} />
        <div style={{ position: 'absolute', bottom: width * 0.02, left: '50%', width: width * 0.34, height: 5, transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.75)', borderRadius: 99, zIndex: 20, mixBlendMode: 'difference' }} />
      </div>
    </div>
  );
}

/** App screenshot filling the phone screen. */
export function Shot({ src, opacity = 1, x = 0, scale = 1 }: { src: string; opacity?: number; x?: number; scale?: number }) {
  return (
    <Img
      src={staticFile(src)}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity, transform: `translateX(${x}%) scale(${scale})`, transformOrigin: 'top center' }}
    />
  );
}

/** Finger tap feedback at relative coordinates of the screen (0..1). */
export function Tap({ x, y, at }: { x: number; y: number; at: number }) {
  const frame = useCurrentFrame();
  const local = frame - at;
  if (local < -8 || local > 26) return null;
  const appear = interpolate(local, [-8, 0], [0, 1], clamp);
  const ring = interpolate(local, [0, 22], [0.6, 2.2], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ringOpacity = interpolate(local, [0, 22], [0.7, 0], clamp);
  const dotOpacity = interpolate(local, [-8, 0, 10, 26], [0, 0.9, 0.9, 0], clamp);
  return (
    <div style={{ position: 'absolute', left: `${x * 100}%`, top: `${y * 100}%`, zIndex: 30 }}>
      <div style={{ position: 'absolute', width: 46, height: 46, left: -23, top: -23, borderRadius: '50%', border: '3px solid #fff', opacity: ringOpacity, transform: `scale(${ring})` }} />
      <div style={{ position: 'absolute', width: 34, height: 34, left: -17, top: -17, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', boxShadow: '0 0 0 6px rgba(111,176,255,0.45)', opacity: dotOpacity, transform: `scale(${appear})` }} />
    </div>
  );
}

export function Kicker({ children, color = C.accent, style }: { children: ReactNode; color?: string; style?: CSSProperties }) {
  return (
    <div style={{ fontFamily, fontWeight: 800, fontSize: 24, letterSpacing: 5, textTransform: 'uppercase', color, ...style }}>{children}</div>
  );
}

export function Title({ children, size = 76, style }: { children: ReactNode; size?: number; style?: CSSProperties }) {
  return (
    <div style={{ fontFamily, fontWeight: 800, fontSize: size, lineHeight: 1.05, letterSpacing: -size * 0.035, color: C.text, ...style }}>{children}</div>
  );
}

export function Body({ children, size = 32, style }: { children: ReactNode; size?: number; style?: CSSProperties }) {
  return <div style={{ fontFamily, fontWeight: 500, fontSize: size, lineHeight: 1.45, color: C.muted, ...style }}>{children}</div>;
}

export function Chip({ children, bg = 'rgba(111,176,255,0.14)', color = C.accent, size = 30, style }: { children: ReactNode; bg?: string; color?: string; size?: number; style?: CSSProperties }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: `${size * 0.45}px ${size * 0.9}px`, borderRadius: 999, background: bg, color, fontFamily, fontWeight: 800, fontSize: size, ...style }}>
      {children}
    </div>
  );
}

/* ---------------- Icons (stroke) ---------------- */
type IconProps = { size?: number; color?: string; stroke?: number };
const svg = (paths: ReactNode, { size = 40, color = 'currentColor', stroke = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);
export const IconPhone = (p: IconProps) => svg(<path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z" />, p);
export const IconMail = (p: IconProps) => svg(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>, p);
export const IconChat = (p: IconProps) => svg(<path d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.5-4A8 8 0 1 1 20 11.5z" />, p);
export const IconShare = (p: IconProps) => svg(<><path d="M12 3v12M8 7l4-4 4 4" /><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" /></>, p);
export const IconPlusSquare = (p: IconProps) => svg(<><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M12 8v8M8 12h8" /></>, p);
export const IconWifiOff = (p: IconProps) => svg(<path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01M3 3l18 18" />, p);
export const IconDownload = (p: IconProps) => svg(<path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 20h16" />, p);
export const IconGlobe = (p: IconProps) => svg(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>, p);
export const IconCheck = (p: IconProps) => svg(<path d="M5 12.5l4.5 4.5L19 7.5" />, p);
export const IconLock = (p: IconProps) => svg(<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>, p);
export const IconBook = (p: IconProps) => svg(<><path d="M12 6c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13C17 4 14 4.5 12 6z" /><path d="M12 6v13" /></>, p);
export const IconCopy = (p: IconProps) => svg(<><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></>, p);
export const IconStar = (p: IconProps) => svg(<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />, p);
export const IconGlasses = (p: IconProps) => svg(<><circle cx="7" cy="14" r="3.5" /><circle cx="17" cy="14" r="3.5" /><path d="M10.5 14h3M3.5 14L5 7h2M20.5 14L19 7h-2" /></>, p);
export const IconChevronL = (p: IconProps) => svg(<path d="M15 5l-7 7 7 7" />, p);
export const IconChevronR = (p: IconProps) => svg(<path d="M9 5l7 7-7 7" />, p);
export const IconTabs = (p: IconProps) => svg(<><rect x="4" y="7" width="13" height="13" rx="2" /><path d="M8 4h10a2 2 0 0 1 2 2v10" /></>, p);
export const IconAndroid = (p: IconProps) => svg(<><rect x="5" y="9" width="14" height="10" rx="2" /><path d="M8 9a4 4 0 0 1 8 0M7 5l1.5 2M17 5l-1.5 2M9.5 12h.01M14.5 12h.01" /></>, p);

/* ---------------- Animated logo ---------------- */
const INK = '#ffffff';
const STAFF = '#7fb2ff';
const PAGE_BG = '#1d4ed8';

/** The Recueil CMI logo (white on blue), animated: pages draw, neck rises, notes and dove arrive. */
export function LogoMark({ size, draw = 1, neck = 1, notes = 1, dove = 1 }: { size: number; draw?: number; neck?: number; notes?: number; dove?: number }) {
  const dash = (v: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - v });
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.22, background: PAGE_BG, boxShadow: '0 40px 100px rgba(29,78,216,0.55)', overflow: 'hidden' }}>
      <svg viewBox="0 0 512 512" width={size} height={size}>
        <g transform="translate(0 34)">
          <g fill="none" stroke={INK} strokeLinecap="round" strokeLinejoin="round">
            <path d="M236 142 C222 120 196 106 166 106 C136 106 114 114 98 122 Q86 127 87 140 L110 384 Q112 396 124 394 C160 386 196 386 218 396 C228 400 232 404 236 410" strokeWidth={10} {...dash(draw)} />
            <path d="M276 142 C290 120 316 106 346 106 C376 106 398 114 414 122 Q426 127 425 140 L402 384 Q400 396 388 394 C352 386 316 386 294 396 C284 400 280 404 276 410" strokeWidth={10} {...dash(draw)} />
            <path d="M72 142 L96 392 Q98 404 110 403 C150 398 186 402 210 414" strokeWidth={6} {...dash(Math.max(0, draw * 1.2 - 0.2))} />
            <path d="M440 142 L416 392 Q414 404 402 403 C362 398 326 402 302 414" strokeWidth={6} {...dash(Math.max(0, draw * 1.2 - 0.2))} />
          </g>
          <g opacity={notes} transform={`translate(0 ${(1 - notes) * 18})`}>
            <g stroke={STAFF} strokeWidth={3} strokeLinecap="round">
              <path d="M124 214 H222 M125 228 H222 M126 242 H222" />
              <path d="M130 300 H222 M131 314 H222 M132 328 H222" />
              <path d="M290 214 H388 M290 228 H387 M290 242 H386" />
              <path d="M290 300 H382 M290 314 H381 M290 328 H380" />
            </g>
            <g fill={INK} stroke={INK} strokeLinecap="round">
              <ellipse cx="150" cy="242" rx="9" ry="6.5" transform="rotate(-20 150 242)" stroke="none" />
              <ellipse cx="190" cy="228" rx="9" ry="6.5" transform="rotate(-20 190 228)" stroke="none" />
              <path d="M158 240 V202 M198 226 V190" strokeWidth={3.5} />
              <path d="M158 202 L198 190 L198 197 L158 209 Z" strokeWidth={2} strokeLinejoin="round" />
              <ellipse cx="176" cy="314" rx="9" ry="6.5" transform="rotate(-20 176 314)" stroke="none" />
              <path d="M184 312 V278" strokeWidth={3.5} />
              <ellipse cx="320" cy="242" rx="9" ry="6.5" transform="rotate(-20 320 242)" stroke="none" />
              <path d="M328 240 V204" strokeWidth={3.5} />
              <path d="M328 204 C340 208 348 216 344 230 C342 222 336 216 328 214 Z" stroke="none" />
              <ellipse cx="362" cy="221" rx="9" ry="6.5" transform="rotate(-20 362 221)" stroke="none" />
              <path d="M370 219 V185" strokeWidth={3.5} />
              <ellipse cx="312" cy="328" rx="9" ry="6.5" transform="rotate(-20 312 328)" stroke="none" />
              <ellipse cx="350" cy="314" rx="9" ry="6.5" transform="rotate(-20 350 314)" stroke="none" />
              <path d="M320 326 V290 M358 312 V278" strokeWidth={3.5} />
              <path d="M320 290 L358 278 L358 285 L320 297 Z" strokeWidth={2} strokeLinejoin="round" />
            </g>
          </g>
          <g stroke={INK} strokeLinecap="round" strokeLinejoin="round" opacity={Math.min(1, neck * 1.5)} transform={`translate(0 ${(1 - neck) * 120})`}>
            <path d="M226 82 H212 M227 102 H213 M228 122 H214 M286 82 H300 M285 102 H299 M284 122 H298" strokeWidth={5} />
            <g fill={INK} stroke="none">
              <ellipse cx="205" cy="82" rx="10" ry="7" /><ellipse cx="206" cy="102" rx="10" ry="7" /><ellipse cx="207" cy="122" rx="10" ry="7" />
              <ellipse cx="307" cy="82" rx="10" ry="7" /><ellipse cx="306" cy="102" rx="10" ry="7" /><ellipse cx="305" cy="122" rx="10" ry="7" />
            </g>
            <path d="M236 142 L224 76 Q223 60 238 60 C248 66 264 66 274 60 Q289 60 288 76 L276 142 Z" fill={PAGE_BG} strokeWidth={8} />
            <g fill={INK} stroke="none">
              <circle cx="239" cy="82" r="4.5" /><circle cx="241" cy="102" r="4.5" /><circle cx="243" cy="122" r="4.5" />
              <circle cx="273" cy="82" r="4.5" /><circle cx="271" cy="102" r="4.5" /><circle cx="269" cy="122" r="4.5" />
            </g>
            <path d="M238 146 V340 L242 378 L250 354 L257 394 L264 358 L270 382 L274 346 V146 Z" fill={PAGE_BG} strokeWidth={8} />
            <path d="M233 146 H279" strokeWidth={8} />
            <path d="M238 176 H274 M238 204 H274 M238 230 H274 M238 254 H274 M238 276 H274 M238 296 H274 M238 314 H274 M238 330 H274" strokeWidth={3} />
            <g fill={INK} stroke="none">
              <circle cx="256" cy="217" r="4" /><circle cx="256" cy="265" r="4" /><circle cx="256" cy="305" r="4" />
              <path d="M224 392 L233 374 L232 396 Z" />
              <path d="M286 388 L280 370 L292 378 Z" />
            </g>
          </g>
        </g>
        <g opacity={dove} transform={`translate(${(1 - dove) * 160} ${(1 - dove) * 60})`}>
          <g transform="translate(456 18) rotate(-10) scale(-0.8 0.8)" stroke={PAGE_BG} strokeWidth={9} paintOrder="stroke" strokeLinejoin="round">
            <path d="M62 78 C48 48 62 20 98 4 C98 30 94 56 88 82 Z" fill="#93c5fd" />
            <path fill={INK} d="M10 62 C18 56 26 52 34 52 C44 50 52 54 56 62 C70 76 96 82 126 84 C150 86 170 90 192 102 C176 106 160 110 140 108 C112 114 84 110 66 98 C56 92 50 84 46 77 C36 73 24 70 10 62 Z" />
            <path fill={INK} d="M84 82 C72 52 90 22 146 6 C140 20 142 34 132 48 C130 56 134 62 124 70 C118 76 112 78 104 84 Z" />
          </g>
        </g>
      </svg>
    </div>
  );
}
