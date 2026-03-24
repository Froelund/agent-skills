# Agent Skills

Central repository for Kristian's AI agent skills — used across OpenClaw, Claude Code, and other AI agents. Sync between machines via git.

## Structure

```
agent-skills/
├── README.md              # This file
├── openclaw/              # OpenClaw-specific skills
│   ├── hubspot/           # HubSpot CRM integration
│   ├── mlx-whisper/       # Local speech-to-text (Apple Silicon)
│   ├── agent-browser-cli/ # Browser automation
│   ├── mission-control/   # macOS dashboard for OpenClaw
│   ├── self-improvement/  # Durable lesson capture
│   └── tg-voice-whisper/  # Telegram voice transcription
├── claude-code/           # Claude Code configs and templates
│   └── templates/
└── shared/                # Skills that work across agents
```

## Installing OpenClaw Skills

### Option 1: Symlink from this repo (recommended for development)

```bash
# Clone this repo
git clone https://github.com/Froelund/agent-skills.git ~/agent-skills

# Symlink skills into OpenClaw workspace
cd ~/.openclaw/workspace/skills
for skill in ~/agent-skills/openclaw/*/; do
  ln -s "$skill" "$(basename $skill)"
done
```

### Option 2: Copy files

```bash
git clone https://github.com/Froelund/agent-skills.git ~/agent-skills
cp -r ~/agent-skills/openclaw/* ~/.openclaw/workspace/skills/
```

### Option 3: Install via clawhub

Some skills are published on clawhub and can be installed directly:

```bash
clawhub install mlx-whisper
clawhub install agent-browser-cli
clawhub install mission-control
clawhub install self-improvement
```

## Environment Variables

Some skills require secrets. Set them in your shell profile (`~/.zshrc` or `~/.bashrc`) or use a `.env` file.

| Variable | Skill | Description |
|----------|-------|-------------|
| `HUBSPOT_TOKEN` | hubspot | HubSpot Private App token |

Example `.env` setup:

```bash
export HUBSPOT_TOKEN="pat-na1-your-token-here"
```

## Sync Between Machines

### Pull latest skills on a new machine

```bash
git clone https://github.com/Froelund/agent-skills.git ~/agent-skills
# Then symlink or copy as above
```

### Push updates from one machine

```bash
cd ~/agent-skills
git add -A
git commit -m "Update skills from $(hostname)"
git push
```

### Pull updates on other machines

```bash
cd ~/agent-skills
git pull
# If using symlinks, nothing more needed
# If using copies, re-copy changed skills
```

### Recommended workflow

1. Edit skills in `~/agent-skills/openclaw/skill-name/`
2. Commit and push to GitHub
3. Pull on other machines
4. Symlinks mean changes are instant — no re-copying needed

## Adding New Skills

```
agent-skills/openclaw/my-new-skill/
├── SKILL.md    # Required: instructions for the agent
└── ...         # Optional: scripts, references, etc.
```

SKILL.md frontmatter minimum:

```yaml
---
name: my-new-skill
description: What it does and when to use it
---
```

## Skills Overview

| Skill | Platform | Description |
|-------|----------|-------------|
| hubspot | OpenClaw | HubSpot CRM — search deals, contacts, add notes |
| mlx-whisper | OpenClaw | Local speech-to-text via Apple MLX |
| agent-browser-cli | OpenClaw | Browser automation via Playwright CLI |
| mission-control | OpenClaw | macOS dashboard for monitoring OpenClaw |
| self-improvement | OpenClaw | Capture and promote durable lessons |
| tg-voice-whisper | OpenClaw | Auto-transcribe Telegram voice messages |
