import { MsEdgeTTS, OUTPUT_FORMAT, ProsodyOptions } from "msedge-tts";
import { NextRequest } from "next/server";
import { tmpdir } from "os";
import { join } from "path";
import { mkdir, readFile, rm } from "fs/promises";

export const runtime = "nodejs";

// tr-TR-EmelNeural — sakin, soft, masal anlatımına uygun kadın ses.
const VOICE = "tr-TR-EmelNeural";
// rate -10%: sakin, masalsı tempo  |  pitch -4%: sıcak, yumuşak ton.
// NOT: Edge'in ücretsiz TTS uç noktası prosody (rate/pitch/volume) dışındaki
// SSML elementlerini (<break>, <emphasis>, mstts:express-as) reddediyor —
// audio hiç dönmüyor. Bu yüzden duraklama/ritim TARAFINDA değil,
// istemci tarafında (lib/speech.ts) segment arası gerçek bekleme ile sağlanır.
const PROSODY = Object.assign(new ProsodyOptions(), { rate: "-10%", pitch: "-4%" });

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get("text")?.trim();
  if (!text) return new Response("text parametresi gerekli", { status: 400 });

  const tmpDir = join(
    tmpdir(),
    `tts_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  );

  try {
    await mkdir(tmpDir, { recursive: true });

    const tts = new MsEdgeTTS();
    await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    const { audioFilePath } = await tts.toFile(tmpDir, text, PROSODY);

    const audioBuffer = await readFile(audioFilePath);

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400, immutable",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("[TTS] Hata:", err);
    return new Response("Ses üretimi başarısız", { status: 500 });
  } finally {
    rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}
