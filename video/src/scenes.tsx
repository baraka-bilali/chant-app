import qrcode from 'qrcode-generator';
import type { ReactNode } from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';

import {
  Body, Chip, IconAndroid, IconBook, IconChat, IconCheck, IconChevronL, IconChevronR, IconCopy, IconDownload, IconGlasses,
  IconGlobe, IconLock, IconMail, IconPhone, IconPlusSquare, IconShare, IconStar, IconTabs, IconWifiOff, Kicker, LogoMark,
  Phone, Rise, Scene, Shot, Tap, Title, clamp, useIn,
} from './components';
import { C, DEMO_AT, INFO, IOS_AT, SCENES, fontFamily } from './theme';

const ease = Easing.inOut(Easing.cubic);

/* =============================== 1. Intro =============================== */
export function IntroScene() {
  const frame = useCurrentFrame();
  const pop = useIn(0, 14);
  const draw = interpolate(frame, [10, 58], [0, 1], { ...clamp, easing: ease });
  const neck = useIn(44, 14);
  const notes = interpolate(frame, [58, 80], [0, 1], clamp);
  const dove = interpolate(frame, [64, 100], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const words = ['Chantez.', 'Louez.', 'Partagez.'];
  return (
    <Scene duration={SCENES.intro}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34 }}>
        <div style={{ transform: `scale(${0.6 + 0.4 * pop})`, opacity: pop }}>
          <LogoMark size={320} draw={draw} neck={Math.min(1, neck)} notes={notes} dove={dove} />
        </div>
        <Rise delay={72}>
          <Title size={112}>Recueil CMI</Title>
        </Rise>
        <div style={{ display: 'flex', gap: 26 }}>
          {words.map((w, i) => (
            <Rise key={w} delay={94 + i * 8} distance={30}>
              <Title size={58} style={{ color: i === 2 ? C.accent : C.text }}>{w}</Title>
            </Rise>
          ))}
        </div>
      </AbsoluteFill>
    </Scene>
  );
}

/* ============================ 2. Languages ============================== */
const LANGS = ['Français', 'English', 'Kiswahili', 'Lingala', 'Tshiluba', 'Kikongo'];

function PopChip({ delay, children }: { delay: number; children: ReactNode }) {
  const p = useIn(delay, 12);
  return (
    <div style={{ transform: `scale(${0.4 + 0.6 * p})`, opacity: Math.min(1, p * 1.4) }}>
      <Chip size={36} bg={C.surface2} color={C.text} style={{ border: `2px solid ${C.border}` }}>
        {children}
      </Chip>
    </div>
  );
}

export function LanguagesScene() {
  const frame = useCurrentFrame();
  const count = Math.round(interpolate(frame, [8, 62], [0, 854], { ...clamp, easing: Easing.out(Easing.cubic) }));
  return (
    <Scene duration={SCENES.languages}>
      <div style={{ position: 'absolute', left: 170, top: 0, bottom: 0, width: 720, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Rise>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 280, lineHeight: 0.9, letterSpacing: -14, color: C.accent }}>{count}</div>
        </Rise>
        <Rise delay={6}>
          <Title size={72} style={{ marginTop: 10 }}>chants</Title>
        </Rise>
        <Rise delay={14}>
          <Body size={34} style={{ marginTop: 22 }}>dans un seul recueil, dans votre poche.</Body>
        </Rise>
      </div>
      <div style={{ position: 'absolute', left: 1000, top: 0, bottom: 0, width: 780, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Rise delay={16}>
          <Kicker>Plusieurs langues</Kicker>
        </Rise>
        <Rise delay={22}>
          <Title size={70} style={{ marginTop: 22 }}>Chantez dans la langue de votre cœur</Title>
        </Rise>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 48 }}>
          {LANGS.map((l, i) => (
            <PopChip key={l} delay={34 + i * 7}>{l}</PopChip>
          ))}
        </div>
      </div>
    </Scene>
  );
}

/* =============================== 3. Demo ================================ */
const DEMO_STEPS = [
  { at: DEMO_AT[0], n: '01', title: 'Recherche instantanée', text: 'Trouvez un chant par numéro, titre ou paroles, sans vous soucier des accents.' },
  { at: DEMO_AT[1], n: '02', title: 'Des paroles claires', text: 'Couplets numérotés et refrain mis en valeur, affiché une seule fois.' },
  { at: DEMO_AT[2], n: '03', title: 'Texte ajustable', text: 'A- / A+ : agrandissez le texte pour bien lire, de près comme de loin.' },
  { at: DEMO_AT[3], n: '04', title: 'Vos playlists', text: 'Préparez vos cultes, vos veillées de prière et vos moments en famille.' },
];

function DemoCaption({ index }: { index: number }) {
  const frame = useCurrentFrame();
  const step = DEMO_STEPS[index];
  const next = DEMO_STEPS[index + 1]?.at ?? SCENES.demo;
  const inP = interpolate(frame, [step.at + 4, step.at + 20], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const outP = index === DEMO_STEPS.length - 1 ? 0 : interpolate(frame, [next - 10, next], [0, 1], clamp);
  const opacity = inP * (1 - outP);
  if (opacity <= 0) return null;
  return (
    <div style={{ position: 'absolute', top: 300, left: 0, right: 0, opacity, transform: `translateY(${(1 - inP) * 40 - outP * 30}px)` }}>
      <div style={{ fontFamily, fontWeight: 800, fontSize: 150, lineHeight: 1, color: 'transparent', WebkitTextStroke: `3px ${C.accent}`, opacity: 0.6 }}>{step.n}</div>
      <Title size={78} style={{ marginTop: 18 }}>{step.title}</Title>
      <Body size={36} style={{ marginTop: 22, maxWidth: 760 }}>{step.text}</Body>
    </div>
  );
}

export function DemoScene() {
  const frame = useCurrentFrame();
  const push = (at: number) => interpolate(frame, [at, at + 16], [0, 1], { ...clamp, easing: ease });
  const fade = (a: number, b: number) => interpolate(frame, [a, b], [0, 1], clamp);
  const float = Math.sin(frame / 28) * 8;
  const phoneIn = useIn(0, 16);

  const [, S1, S2, S3] = DEMO_AT;
  const p1 = push(S1);
  const p3 = push(S3);
  return (
    <Scene duration={SCENES.demo}>
      <Phone width={420} style={{ left: 290, top: 80 + float + (1 - phoneIn) * 120, opacity: phoneIn }}>
        <Shot src="list-dark.png" opacity={1 - fade(26, 40)} />
        <Shot src="search.png" opacity={fade(26, 40)} x={-100 * p1} />
        <Shot src="song-dark.png" x={100 - 100 * p1} opacity={1 - fade(S2 + 8, S2 + 22)} />
        <Shot src="song-big.png" opacity={fade(S2 + 8, S2 + 22)} x={-100 * p3} />
        <Shot src="playlists.png" x={100 - 100 * p3} />
        <Tap x={0.5} y={0.122} at={18} />
        <Tap x={0.5} y={0.225} at={S1 - 12} />
        <Tap x={0.897} y={0.211} at={S2 + 2} />
        <Tap x={0.75} y={0.975} at={S3 - 12} />
      </Phone>

      <div style={{ position: 'absolute', left: 880, top: 0, width: 860, height: 1080 }}>
        <Rise delay={6} style={{ position: 'absolute', top: 170 }}>
          <Kicker>Découvrez l’application</Kicker>
        </Rise>
        {DEMO_STEPS.map((_, i) => (
          <DemoCaption key={i} index={i} />
        ))}
        <div style={{ position: 'absolute', top: 820, display: 'flex', gap: 14 }}>
          {DEMO_STEPS.map((s, i) => {
            const end = DEMO_STEPS[i + 1]?.at ?? SCENES.demo;
            const p = interpolate(frame, [s.at, end], [0, 1], clamp);
            return (
              <div key={s.n} style={{ width: 150, height: 8, borderRadius: 8, background: C.surface2, overflow: 'hidden' }}>
                <div style={{ width: `${p * 100}%`, height: '100%', background: C.accent }} />
              </div>
            );
          })}
        </div>
      </div>
    </Scene>
  );
}

/* ============================== 4. Offline ============================== */
export function OfflineScene() {
  const frame = useCurrentFrame();
  const card = useIn(0, 16);
  const ring = (frame % 36) / 36;
  const checks = ['Les 854 chants hors connexion', 'Rien à charger, rien à attendre', 'Aucun forfait consommé'];
  return (
    <Scene duration={SCENES.offline}>
      <div style={{ position: 'absolute', left: 150, top: 250, width: 760, height: 549, borderRadius: 48, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5)', transform: `scale(${0.85 + 0.15 * card})`, opacity: card }}>
        <Img src={staticFile('offline.svg')} style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', left: '72.8%', top: '23.8%', width: 160, height: 160, marginLeft: -80, marginTop: -80, borderRadius: '50%', border: '6px solid #f87171', opacity: 1 - ring, transform: `scale(${0.6 + ring})` }} />
      </div>
      <div style={{ position: 'absolute', left: 1020, top: 0, bottom: 0, width: 760, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Rise delay={8}>
          <Kicker>Sans internet</Kicker>
        </Rise>
        <Rise delay={14}>
          <Title size={80} style={{ marginTop: 20 }}>Pas besoin d’internet</Title>
        </Rise>
        <Rise delay={20}>
          <Body size={34} style={{ marginTop: 24 }}>Tous les chants sont déjà dans l’application : à l’église, en voyage ou à la maison.</Body>
        </Rise>
        <div style={{ marginTop: 36, display: 'grid', gap: 18 }}>
          {checks.map((c, i) => (
            <Rise key={c} delay={30 + i * 8} distance={20}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily, fontWeight: 700, fontSize: 32, color: C.text }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: C.blue2, display: 'grid', placeItems: 'center' }}>
                  <IconCheck size={28} color="#fff" stroke={3} />
                </div>
                {c}
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </Scene>
  );
}

/* ============================ 5. iPhone install ========================= */
const IOS_STEPS = [
  { at: IOS_AT[0], title: 'Ouvrez Safari', text: <>Allez sur <b style={{ color: C.text }}>{INFO.webUrl}</b></> },
  { at: IOS_AT[1], title: 'Touchez Partager', text: <>Le carré avec une flèche <span style={{ opacity: 0.75 }}>(iOS 26 : ··· puis Partager)</span></> },
  { at: IOS_AT[2], title: '« Sur l’écran d’accueil »', text: <>Faites défiler et choisissez cette option</> },
  { at: IOS_AT[3], title: 'Touchez Ajouter', text: <>L’app est sur votre écran d’accueil !</> },
];

const IOS_BLUE = '#0a84ff';
const URL_TEXT = INFO.webUrl;

function StatusBar({ dark = false }: { dark?: boolean }) {
  const color = dark ? '#fff' : '#111';
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 34px 0', fontFamily, fontWeight: 700, fontSize: 19, color, zIndex: 5 }}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <div style={{ width: 18, height: 11, borderRadius: 2, background: color, opacity: 0.9 }} />
        <div style={{ width: 28, height: 13, borderRadius: 4, border: `2px solid ${color}`, padding: 1 }}>
          <div style={{ width: '80%', height: '100%', borderRadius: 2, background: color }} />
        </div>
      </div>
    </div>
  );
}

function Keyboard({ y }: { y: number }) {
  const rows = ['azertyuiop', 'qsdfghjklm', 'wxcvbn'];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, background: '#d1d5db', transform: `translateY(${y}%)`, padding: '14px 6px', display: 'grid', gap: 12, zIndex: 8 }}>
      {rows.map((r) => (
        <div key={r} style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          {r.split('').map((k) => (
            <div key={k} style={{ width: 34, height: 50, borderRadius: 7, background: '#fff', boxShadow: '0 1px 0 #9ca3af', display: 'grid', placeItems: 'center', fontFamily, fontSize: 22, color: '#111' }}>{k}</div>
          ))}
        </div>
      ))}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        <div style={{ width: 230, height: 50, borderRadius: 7, background: '#fff', boxShadow: '0 1px 0 #9ca3af' }} />
        <div style={{ width: 110, height: 50, borderRadius: 7, background: IOS_BLUE, color: '#fff', display: 'grid', placeItems: 'center', fontFamily, fontWeight: 700, fontSize: 19 }}>Aller</div>
      </div>
    </div>
  );
}

function ShareRow({ label, icon, highlight = 0 }: { label: string; icon: ReactNode; highlight?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', height: 64, borderBottom: '1px solid #e5e7eb', background: `rgba(10,132,255,${0.14 * highlight})`, fontFamily, fontSize: 21, fontWeight: highlight > 0.5 ? 700 : 500, color: '#111' }}>
      {label}
      <div style={{ color: '#111' }}>{icon}</div>
    </div>
  );
}

const HOME_APPS = ['#f97316', '#22c55e', '#0ea5e9', '#eab308', '#a855f7', '#ef4444', '#14b8a6', '#64748b', '#ec4899', '#84cc16', '#6366f1'];
const HOME_LABELS = ['Horloge', 'Messages', 'Météo', 'Notes', 'Podcasts', 'Agenda', 'Plans', 'Réglages', 'Photos', 'Santé', 'Fichiers'];

function IphoneScreen() {
  const frame = useCurrentFrame();
  // Step 1: tap address bar, type, load page.
  const kb = interpolate(frame, [14, 26, 78, 90], [100, 0, 0, 100], { ...clamp, easing: ease });
  const typed = Math.floor(interpolate(frame, [26, 74], [0, URL_TEXT.length], clamp));
  const loaded = interpolate(frame, [84, 100], [0, 1], clamp);
  const barLift = (100 - kb) / 100;
  const [, S2, S3, S4] = IOS_AT;
  // Step 3: share sheet.
  const sheet = interpolate(frame, [S3 + 3, S3 + 27, S4, S4 + 13], [100, 0, 0, 100], { ...clamp, easing: ease });
  const highlight = interpolate(frame, [S3 + 71, S3 + 81], [0, 1], clamp);
  // Step 4: add dialog, then home screen.
  const dialog = interpolate(frame, [S4 + 3, S4 + 17, S4 + 47, S4 + 57], [100, 0, 0, 100], { ...clamp, easing: ease });
  const home = interpolate(frame, [S4 + 51, S4 + 65], [0, 1], clamp);
  const iconPop = useIn(S4 + 67, 9);
  const launch = interpolate(frame, [S4 + 109, S4 + 131], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const glow = (Math.sin(frame / 6) + 1) / 2;

  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {/* Safari page */}
      <div style={{ position: 'absolute', top: 54, left: 0, right: 0, bottom: 128, background: '#f2f2f7' }}>
        <div style={{ position: 'absolute', inset: 0, padding: 40, opacity: 1 - loaded }}>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 30, color: '#111' }}>Favoris</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22, marginTop: 24 }}>
            {HOME_APPS.slice(0, 8).map((c, i) => (
              <div key={i} style={{ height: 70, borderRadius: 16, background: c, opacity: 0.28 }} />
            ))}
          </div>
        </div>
        <Img src={staticFile('list-light.png')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity: loaded }} />
      </div>
      <StatusBar />

      {/* Bottom bar: address + toolbar */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 128, background: 'rgba(248,248,250,0.97)', borderTop: '1px solid #e5e7eb', transform: `translateY(${-barLift * 300}px)`, zIndex: 9 }}>
        <div style={{ margin: '12px 16px 0', height: 52, borderRadius: 14, background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily, fontSize: 21, color: '#111' }}>
          {frame < 80 ? (
            frame < 14 ? (
              <span style={{ color: '#6b7280' }}>Rechercher ou saisir un site</span>
            ) : (
              <span>
                {URL_TEXT.slice(0, typed)}
                <span style={{ color: IOS_BLUE, opacity: frame % 16 < 8 ? 1 : 0 }}>|</span>
              </span>
            )
          ) : (
            <>
              <IconLock size={18} color="#6b7280" stroke={2.4} />
              <span>{URL_TEXT}</span>
            </>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 58, color: IOS_BLUE }}>
          <IconChevronL size={30} color={IOS_BLUE} />
          <IconChevronR size={30} color="#c7c7cc" />
          <IconShare size={30} color={IOS_BLUE} />
          <IconBook size={30} color={IOS_BLUE} />
          <IconTabs size={30} color={IOS_BLUE} />
        </div>
      </div>
      <Keyboard y={kb} />

      {/* Share sheet */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: '22%', bottom: 0, background: '#f2f2f7', borderRadius: '26px 26px 0 0', transform: `translateY(${sheet}%)`, boxShadow: '0 -20px 60px rgba(0,0,0,0.25)', zIndex: 12, padding: '10px 18px' }}>
        <div style={{ width: 52, height: 6, borderRadius: 6, background: '#c7c7cc', margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', borderRadius: 16, padding: 14 }}>
          <Img src={staticFile('app-icon.png')} style={{ width: 58, height: 58, borderRadius: 14 }} />
          <div style={{ fontFamily }}>
            <div style={{ fontWeight: 700, fontSize: 21, color: '#111' }}>Recueil CMI</div>
            <div style={{ fontSize: 17, color: '#6b7280' }}>{URL_TEXT}</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', margin: '22px 0' }}>
          {[['#22c55e', 'Messages', <IconChat key="m" size={30} color="#fff" />], ['#0ea5e9', 'Mail', <IconMail key="e" size={30} color="#fff" />], ['#eab308', 'Notes', <IconBook key="n" size={30} color="#fff" />], ['#9ca3af', 'Plus', <span key="p" style={{ color: '#fff', fontSize: 30, fontWeight: 800 }}>···</span>]].map(([c, l, ic]) => (
            <div key={l as string} style={{ display: 'grid', justifyItems: 'center', gap: 8, fontFamily, fontSize: 16, color: '#111' }}>
              <div style={{ width: 68, height: 68, borderRadius: 18, background: c as string, display: 'grid', placeItems: 'center' }}>{ic as ReactNode}</div>
              {l as string}
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden' }}>
          <ShareRow label="Copier" icon={<IconCopy size={26} />} />
          <ShareRow label="Ajouter à la liste de lecture" icon={<IconGlasses size={26} />} />
          <ShareRow label="Ajouter un signet" icon={<IconBook size={26} />} />
          <ShareRow label="Ajouter aux favoris" icon={<IconStar size={26} />} />
          <ShareRow label="Sur l’écran d’accueil" icon={<IconPlusSquare size={26} />} highlight={highlight} />
        </div>
      </div>

      {/* Add to home screen dialog */}
      <div style={{ position: 'absolute', inset: 0, top: 40, background: '#f2f2f7', borderRadius: '26px 26px 0 0', transform: `translateY(${dialog}%)`, zIndex: 14, padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily, fontSize: 19, padding: '4px 6px' }}>
          <span style={{ color: IOS_BLUE }}>Annuler</span>
          <span style={{ fontWeight: 800, color: IOS_BLUE, fontSize: 20 }}>Ajouter</span>
        </div>
        <div style={{ fontFamily, fontWeight: 800, fontSize: 26, color: '#111', marginTop: 18 }}>Sur l’écran d’accueil</div>
        <div style={{ marginTop: 20, background: '#fff', borderRadius: 16, padding: 18, display: 'flex', gap: 18, alignItems: 'center' }}>
          <Img src={staticFile('app-icon.png')} style={{ width: 92, height: 92, borderRadius: 22 }} />
          <div style={{ fontFamily }}>
            <div style={{ fontWeight: 700, fontSize: 24, color: '#111' }}>Recueil CMI</div>
            <div style={{ fontSize: 18, color: '#6b7280', marginTop: 6 }}>https://{URL_TEXT}/</div>
          </div>
        </div>
        <div style={{ fontFamily, fontSize: 17, color: '#6b7280', marginTop: 16, lineHeight: 1.4 }}>
          Une icône sera ajoutée à votre écran d’accueil pour accéder rapidement à ce site.
        </div>
      </div>

      {/* Home screen */}
      <div style={{ position: 'absolute', inset: 0, opacity: home, zIndex: 16, background: 'linear-gradient(160deg, #1e3a8a 0%, #4338ca 45%, #9333ea 80%, #db2777 100%)' }}>
        <StatusBar dark />
        <div style={{ position: 'absolute', top: 90, left: 26, right: 26, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', rowGap: 34, justifyItems: 'center' }}>
          {HOME_APPS.map((c, i) => (
            <div key={i} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
              <div style={{ width: 74, height: 74, borderRadius: 18, background: `linear-gradient(160deg, ${c}, ${c}cc)`, boxShadow: '0 6px 16px rgba(0,0,0,0.25)' }} />
              <div style={{ fontFamily, fontSize: 14, color: '#fff' }}>{HOME_LABELS[i]}</div>
            </div>
          ))}
          <div style={{ display: 'grid', justifyItems: 'center', gap: 8, transform: `scale(${iconPop})` }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: -14, borderRadius: 28, boxShadow: `0 0 ${20 + glow * 26}px rgba(255,255,255,${0.4 + glow * 0.4})` }} />
              <Img src={staticFile('app-icon.png')} style={{ width: 74, height: 74, borderRadius: 18, position: 'relative' }} />
            </div>
            <div style={{ fontFamily, fontSize: 14, fontWeight: 700, color: '#fff' }}>Recueil CMI</div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 18, right: 18, bottom: 22, height: 104, borderRadius: 34, background: 'rgba(255,255,255,0.22)', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {['#22c55e', '#0ea5e9', '#f97316', '#e11d48'].map((c) => (
            <div key={c} style={{ width: 74, height: 74, borderRadius: 18, background: c }} />
          ))}
        </div>
      </div>

      {/* Launch the app */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 18, opacity: launch, transform: `scale(${0.3 + 0.7 * launch})`, transformOrigin: '88% 46%' }}>
        <Img src={staticFile('welcome.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
      </div>

      <Tap x={0.5} y={0.89} at={12} />
      <Tap x={0.5} y={0.957} at={S2 + 15} />
      <Tap x={0.5} y={0.79} at={S3 + 87} />
      <Tap x={0.89} y={0.075} at={S4 + 33} />
      <Tap x={0.875} y={0.455} at={S4 + 101} />
    </AbsoluteFill>
  );
}

function IosStep({ index }: { index: number }) {
  const frame = useCurrentFrame();
  const s = IOS_STEPS[index];
  const end = IOS_STEPS[index + 1]?.at ?? SCENES.iphone;
  const active = frame >= s.at && frame < end;
  const done = frame >= end;
  const on = interpolate(frame, [s.at, s.at + 10], [0, 1], clamp) * (done ? 0.0 : 1);
  return (
    <Rise delay={10 + index * 6} distance={20}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: '22px 26px', borderRadius: 26, background: active ? C.surface2 : 'transparent', border: `2px solid ${active ? C.accent : 'transparent'}`, boxShadow: active ? `0 18px 50px rgba(59,130,246,${0.3 * on})` : 'none' }}>
        <div style={{ width: 64, height: 64, flex: 'none', borderRadius: '50%', display: 'grid', placeItems: 'center', background: done ? C.green : active ? C.blue2 : C.surface, border: `2px solid ${C.border}`, fontFamily, fontWeight: 800, fontSize: 30, color: '#fff' }}>
          {done ? <IconCheck size={34} color="#fff" stroke={3} /> : index + 1}
        </div>
        <div>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 36, color: active || done ? C.text : C.muted }}>{s.title}</div>
          <div style={{ fontFamily, fontWeight: 500, fontSize: 25, color: C.muted, marginTop: 4 }}>{s.text}</div>
        </div>
      </div>
    </Rise>
  );
}

export function IphoneScene() {
  const frame = useCurrentFrame();
  const phoneIn = useIn(4, 16);
  return (
    <Scene duration={SCENES.iphone}>
      <div style={{ position: 'absolute', left: 140, top: 130, width: 980 }}>
        <Rise>
          <Kicker>Installer sur iPhone</Kicker>
        </Rise>
        <Rise delay={5}>
          <Title size={62} style={{ marginTop: 18 }}>Sur l’écran d’accueil en 4 étapes</Title>
        </Rise>
        <div style={{ marginTop: 40, display: 'grid', gap: 12 }}>
          {IOS_STEPS.map((_, i) => (
            <IosStep key={i} index={i} />
          ))}
        </div>
      </div>
      <Phone width={440} style={{ left: 1260, top: 64 + (1 - phoneIn) * 140 + Math.sin(frame / 30) * 5, opacity: phoneIn }}>
        <IphoneScreen />
      </Phone>
    </Scene>
  );
}

/* ============================== 6. Android ============================== */
const QR_URL = INFO.siteUrl ? `https://${INFO.siteUrl}` : `https://${INFO.webUrl}`;
const QR_PATH = (() => {
  const qr = qrcode(0, 'M');
  qr.addData(QR_URL);
  qr.make();
  const n = qr.getModuleCount();
  let d = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
  return { n, d };
})();

function OptionCard({ icon, title, text, delay }: { icon: ReactNode; title: string; text: ReactNode; delay: number }) {
  return (
    <Rise delay={delay}>
      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', padding: 34, borderRadius: 32, background: C.surface, border: `2px solid ${C.border}` }}>
        <div style={{ width: 84, height: 84, flex: 'none', borderRadius: 24, background: C.blue2, display: 'grid', placeItems: 'center' }}>{icon}</div>
        <div>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 38, color: C.text }}>{title}</div>
          <Body size={28} style={{ marginTop: 8 }}>{text}</Body>
        </div>
      </div>
    </Rise>
  );
}

export function AndroidScene() {
  const qrIn = useIn(20, 14);
  return (
    <Scene duration={SCENES.android}>
      <div style={{ position: 'absolute', left: 140, top: 0, bottom: 0, width: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26 }}>
        <Rise>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <IconAndroid size={44} color="#4ade80" />
            <Kicker color="#4ade80">Sur Android</Kicker>
          </div>
        </Rise>
        <Rise delay={5}>
          <Title size={72}>Deux façons d’installer</Title>
        </Rise>
        <OptionCard
          delay={14}
          icon={<IconDownload size={46} color="#fff" />}
          title="L’application Android (APK)"
          text={INFO.siteUrl ? <>Téléchargez-la sur <b style={{ color: C.text }}>{INFO.siteUrl}</b>, puis touchez Installer.</> : <>Téléchargez le fichier APK sur notre site, puis touchez Installer.</>}
        />
        <OptionCard
          delay={24}
          icon={<IconGlobe size={46} color="#fff" />}
          title="La version web"
          text={<>Ouvrez <b style={{ color: C.text }}>{INFO.webUrl}</b> dans Chrome, touchez le menu en haut à droite, puis {'« Installer l’application »'}.</>}
        />
      </div>
      <div style={{ position: 'absolute', left: 1290, top: 220, width: 500, transform: `scale(${0.8 + 0.2 * qrIn})`, opacity: qrIn, display: 'grid', justifyItems: 'center', gap: 26 }}>
        <div style={{ width: 460, height: 460, padding: 34, borderRadius: 40, background: '#fff', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
          <svg viewBox={`0 0 ${QR_PATH.n} ${QR_PATH.n}`} width="100%" height="100%" shapeRendering="crispEdges">
            <path d={QR_PATH.d} fill="#0b1530" />
          </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 34, color: C.text }}>Scannez pour ouvrir</div>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 28, color: C.accent, marginTop: 6 }}>{INFO.siteUrl || INFO.webUrl}</div>
        </div>
      </div>
    </Scene>
  );
}

/* ============================== 7. Contact ============================== */
export function ContactScene() {
  const frame = useCurrentFrame();
  const pop = useIn(0, 10);
  const shake = Math.sin(frame * 1.6) * (frame % 40 < 16 ? 9 : 0);
  return (
    <Scene duration={SCENES.contact}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 170, height: 170, transform: `scale(${pop})` }}>
          {[0, 1, 2].map((i) => {
            const p = ((frame + i * 14) % 42) / 42;
            return <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid #22c55e', opacity: 1 - p, transform: `scale(${1 + p * 0.9})` }} />;
          })}
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: C.green, display: 'grid', placeItems: 'center', boxShadow: '0 20px 60px rgba(22,163,74,0.5)' }}>
            <div style={{ transform: `rotate(${shake}deg)` }}>
              <IconPhone size={84} color="#fff" stroke={2.2} />
            </div>
          </div>
        </div>
        <Rise delay={8}>
          <Kicker style={{ marginTop: 96 }}>Besoin d’aide ?</Kicker>
        </Rise>
        <Rise delay={14}>
          <Title size={84} style={{ marginTop: 18 }}>Un souci majeur ? Appelez-nous</Title>
        </Rise>
        <Rise delay={22}>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 120, letterSpacing: -2, color: C.accent, marginTop: 18 }}>{INFO.phone}</div>
        </Rise>
        <Rise delay={30}>
          <div style={{ display: 'flex', gap: 22, justifyContent: 'center', marginTop: 20 }}>
            <Chip size={32} bg="rgba(34,197,94,0.16)" color="#4ade80">
              <IconChat size={34} color="#4ade80" /> Appel ou WhatsApp
            </Chip>
            <Chip size={32}>
              <IconMail size={34} color={C.accent} /> {INFO.email}
            </Chip>
          </div>
        </Rise>
        <Rise delay={38}>
          <Body size={30} style={{ marginTop: 34 }}>Une faute dans un chant, un problème dans l’application : nous sommes là pour vous aider.</Body>
        </Rise>
      </AbsoluteFill>
    </Scene>
  );
}

/* =============================== 8. Outro =============================== */
export function OutroScene() {
  const pop = useIn(0, 14);
  return (
    <Scene duration={SCENES.outro}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
        <div style={{ transform: `scale(${0.7 + 0.3 * pop})`, opacity: pop }}>
          <LogoMark size={250} />
        </div>
        <Rise delay={10}>
          <Title size={100} style={{ marginTop: 40 }}>Recueil CMI</Title>
        </Rise>
        <Rise delay={20}>
          <div style={{ fontFamily, fontWeight: 800, fontStyle: 'italic', fontSize: 58, color: C.accent, marginTop: 18 }}>Que le Seigneur vous bénisse !</div>
        </Rise>
        <Rise delay={30}>
          <Chip size={34} bg={C.surface2} color={C.text} style={{ marginTop: 40, border: `2px solid ${C.border}` }}>
            <IconGlobe size={36} color={C.accent} /> {INFO.webUrl}
          </Chip>
        </Rise>
        <Rise delay={38}>
          <Body size={28} style={{ marginTop: 28 }}>Gratuit · Android · iPhone · Sans internet</Body>
        </Rise>
      </AbsoluteFill>
    </Scene>
  );
}
