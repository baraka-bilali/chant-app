// Generates a natural French voice-over with ElevenLabs or OpenAI (your own account and API key).
//
//   node voice/tts.mjs elevenlabs          (needs ELEVENLABS_API_KEY, optional ELEVENLABS_VOICE_ID)
//   node voice/tts.mjs openai              (needs OPENAI_API_KEY, optional OPENAI_VOICE)
//   node voice/tts.mjs text                (no key: only writes the text to read / paste)
//
// Options: --phrases-only  (one file per sentence)   --full-only  (one single narration file)
// Output:  out/voix-off/<provider>/  — MP3 files + "placement.txt" (where to put each sentence in CapCut).
// The API key is only read from the environment; it is never printed or written to disk.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const lines = JSON.parse(fs.readFileSync(path.join(here, 'script.json'), 'utf8'));
const provider = (process.argv[2] ?? 'text').toLowerCase();
const flags = new Set(process.argv.slice(3));
const outDir = path.join(here, '..', 'out', 'voix-off', provider);
fs.mkdirSync(outDir, { recursive: true });

// Full narration: sentences joined with paragraph breaks so the voice takes natural pauses.
const fullText = lines.map((l) => l.text).join('\n\n');

function writeTextFiles() {
  const placement = lines
    .map((l) => `${l.id}.mp3  →  à ${l.start.toFixed(1)} s dans la vidéo\n    « ${l.text} »`)
    .join('\n\n');
  fs.writeFileSync(path.join(outDir, 'placement.txt'), `Voix off — Recueil CMI\nPlacement de chaque phrase (vidéo de 79 s)\n\n${placement}\n`, 'utf8');
  fs.writeFileSync(path.join(outDir, 'texte-complet.txt'), fullText + '\n', 'utf8');
}

async function elevenlabs(text) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('Variable ELEVENLABS_API_KEY absente.');
  // Default: a premade multilingual voice. For a native French voice, pick one in the ElevenLabs
  // Voice Library and set ELEVENLABS_VOICE_ID to its ID.
  const voiceId = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';
  const model = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2';
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({
      text,
      model_id: model,
      language_code: 'fr',
      voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.25, use_speaker_boost: true },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status} : ${(await res.text()).slice(0, 300)}`);
  return Buffer.from(await res.arrayBuffer());
}

async function openai(text) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('Variable OPENAI_API_KEY absente.');
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts',
      voice: process.env.OPENAI_VOICE || 'coral',
      input: text,
      instructions:
        'Parle en français, avec un accent francophone neutre. Voix chaleureuse, posée et souriante, ' +
        'comme une présentatrice qui invite une communauté chrétienne à découvrir une application de chants. ' +
        'Rythme calme, articulation claire, petites pauses entre les phrases.',
      response_format: 'mp3',
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status} : ${(await res.text()).slice(0, 300)}`);
  return Buffer.from(await res.arrayBuffer());
}

const engines = { elevenlabs, openai };

writeTextFiles();
if (provider === 'text') {
  console.log(`Textes écrits dans ${outDir}`);
  process.exit(0);
}
const speak = engines[provider];
if (!speak) {
  console.error('Fournisseur inconnu. Utilisez : elevenlabs, openai ou text.');
  process.exit(1);
}

try {
  if (!flags.has('--phrases-only')) {
    const file = path.join(outDir, 'voix-off-complete.mp3');
    fs.writeFileSync(file, await speak(fullText));
    console.log('✓ voix-off-complete.mp3');
  }
  if (!flags.has('--full-only')) {
    for (const l of lines) {
      fs.writeFileSync(path.join(outDir, `${l.id}.mp3`), await speak(l.text));
      console.log(`✓ ${l.id}.mp3`);
    }
  }
  console.log(`\nTerminé. Fichiers dans : ${outDir}`);
} catch (e) {
  console.error(`\nErreur : ${e.message}`);
  process.exit(1);
}
