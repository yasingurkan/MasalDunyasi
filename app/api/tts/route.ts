import { MsEdgeTTS, OUTPUT_FORMAT, ProsodyOptions } from "msedge-tts";
import { NextRequest } from "next/server";
import { tmpdir } from "os";
import { join } from "path";
import { mkdir, readFile, rm } from "fs/promises";

export const runtime = "nodejs";

// tr-TR-EmelNeural — sakin, soft tonlama
const VOICE   = "tr-TR-EmelNeural";
// rate="-12%" → yavaş ve sakin okuma  |  pitch="-4%" → daha sıcak, soft ton
const PROSODY = Object.assign(new ProsodyOptions(), { rate: "-12%", pitch: "-4%" });

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
    // Prosody toFile üçüncü parametresine — kütüphane SSML'e enjekte eder
    await tts.toFile(tmpDir, text, PROSODY);

    const audioBuffer = await readFile(join(tmpDir, "audio.mp3"));

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
