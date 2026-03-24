---
name: tg-voice-whisper
description: Auto-transcribe Telegram voice messages (.ogg Opus) to text using local OpenAI Whisper (tiny model). Reply with transcription + auto-delete file for privacy. No API keys, fully offline after install.
emoji: 🎙️🔊

requires:
  bins: [whisper, ffmpeg]

install:
  - kind: apt
    packages: [ffmpeg]
  - kind: pip
    packages: [openai-whisper]
    flags: [--break-system-packages]

min-server: 4GB RAM recommended for fast/stable work (cached model <1s transcribe on 1vCPU).
---

**Safe:** Local-only, auto-rm files, no external APIs/credentials stored.

**Usage (agent):**
When voice .ogg arrives in ~/.openclaw/media/inbound/, use mlx_whisper (Apple Silicon optimized):
```
mlx_whisper PATH --model mlx-community/whisper-large-v3-turbo --language da --output-format txt --output-dir /tmp/whisper_out
text=$(cat /tmp/whisper_out/*.txt)
reply "🎙️ $text"
rm PATH /tmp/whisper_out/*.txt
```

**Preferred engine:** mlx_whisper (faster, better quality on Apple Silicon)
**Fallback:** whisper (if mlx_whisper unavailable)

**Default language:** da (Danish) — override with --language en etc.
**Default model:** mlx-community/whisper-large-v3-turbo (excellent quality, fast after first download)

**Auto-setup (non-block):**
Spawn sub-agent or cron every 5s:
```
sessions_spawn task="LOOP: find ~/.openclaw/media/inbound/*.ogg -mmin -1 → mlx_whisper --model mlx-community/whisper-large-v3-turbo --language da → reply text → rm" label="voice-auto" cleanup="keep"
```

**Test:**
mlx_whisper /path.ogg --model mlx-community/whisper-large-v3-turbo --language da

**Notes:**
- First run: model downloads to ~/.cache/huggingface/ (~1.6GB for large-v3-turbo).
- Cached: fast on Apple Silicon M-series.
- Languages: da/en/de etc — use --language for best results.
- Accuracy: large-v3-turbo excellent for Danish speech.
