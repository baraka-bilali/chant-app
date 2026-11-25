export type LyricsBlock =
  | { kind: 'verse'; number: number; text: string }
  | { kind: 'chorus'; text: string }
  | { kind: 'text'; text: string };

const VERSE_START = /^(\d{1,2})\.\s?(.*)$/;
const CHORUS_START = /^Refrain : ?(.*)$/;

/**
 * Lyrics are stored as plain text: "1. first line" starts a verse and
 * "Refrain : first line" starts the chorus (kept only once per song).
 */
export function parseLyrics(lyrics: string): LyricsBlock[] {
  const blocks: { kind: LyricsBlock['kind']; number: number; lines: string[] }[] = [];

  for (const line of lyrics.split('\n')) {
    const verse = VERSE_START.exec(line);
    if (verse) {
      blocks.push({ kind: 'verse', number: Number(verse[1]), lines: [verse[2]] });
      continue;
    }
    const chorus = CHORUS_START.exec(line);
    if (chorus) {
      blocks.push({ kind: 'chorus', number: 0, lines: [chorus[1]] });
      continue;
    }
    if (blocks.length === 0) blocks.push({ kind: 'text', number: 0, lines: [] });
    blocks[blocks.length - 1].lines.push(line);
  }

  return blocks.map((b): LyricsBlock => {
    const text = b.lines.join('\n').trim();
    if (b.kind === 'verse') return { kind: 'verse', number: b.number, text };
    return { kind: b.kind, text };
  });
}

/** First sentence of the lyrics, without verse number, for list previews. */
export function lyricsPreview(lyrics: string): string {
  const first = lyrics.split('\n').find((l) => l.trim().length > 0) ?? '';
  return first.replace(VERSE_START, '$2').replace(CHORUS_START, '$1').trim();
}
