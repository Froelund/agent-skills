---
name: self-improvement
description: Capture durable lessons from debugging, user corrections, missing capabilities, and repeated workflow friction so future sessions avoid the same mistakes. Use this skill when a non-obvious failure is diagnosed, the user corrects or updates the agent, a workaround or project convention is discovered, a capability is missing, a solved issue should be promoted into shared memory, or you should review prior learnings before changing a known-problem area. Do not use for trivial typos, expected failures, straightforward retries, or one-off noise with no reusable lesson.
compatibility: Portable Agent Skills format. Core workflow is agent-agnostic. Bundled helpers require Python 3.11+; hook helpers require bash. No network access is required. Hook snippets are examples for Claude Code-style configs and OpenClaw; manual use works everywhere.
metadata:
  version: "4.0.0"
  original_slug: "self-improving-agent"
  category: "workflow"
  author: "OpenAI adaptation from user-provided skill"
---

# Self-Improvement

Capture, review, promote, and extract durable lessons so future sessions avoid repeating the same mistakes.

## Core idea

Use this skill for **reusable learning**, not for every bump in the road.

A good entry usually has at least one of these properties:
- It corrected a wrong assumption.
- It revealed a project-specific convention.
- It required real debugging or investigation.
- It is likely to recur.
- It should change future workflow, memory, or tooling.

Do **not** log routine noise such as obvious typos, expected validation failures, or errors that were solved immediately with no transferable lesson.

## Important path model

There are **two different roots** in this skill:

1. **Skill root** — where bundled resources live:
   - `scripts/...`
   - `references/...`
   - `assets/...`

2. **Workspace root** — where the project or active workspace lives:
   - `.learnings/LEARNINGS.md`
   - `.learnings/ERRORS.md`
   - `.learnings/FEATURE_REQUESTS.md`
   - `CLAUDE.md`, `AGENTS.md`, `.github/copilot-instructions.md`, `SOUL.md`, `TOOLS.md`

Never write learnings into the installed skill directory. Always target the **workspace root**.

## Quick decision table

| Situation | What to do |
|---|---|
| User corrects you or updates a fact | Log a **learning** |
| Non-obvious command / API / tool failure | Log an **error** |
| User asks for a missing capability | Log a **feature request** |
| You discover a reusable workaround or convention | Log a **learning** |
| A pattern keeps recurring | Search related entries, link with `See Also`, and consider promotion |
| A lesson is broadly applicable or repeated | Promote it into project memory |
| A resolved, general pattern could help other projects | Extract a new skill |

## Standard workflow

### 1) Find the workspace root first

Before reading or writing `.learnings/`, determine `WORKSPACE_ROOT`.

Good defaults:
- the repository root for the current codebase
- the OpenClaw workspace root
- the directory containing the files being edited

If unsure, prefer the directory containing `.git`, `AGENTS.md`, `CLAUDE.md`, or the user's active project files.

### 2) Initialise `.learnings/` if needed

```bash
python3 scripts/learnings.py init --root /absolute/path/to/workspace
```

### 3) Review existing learnings before risky or familiar work

```bash
python3 scripts/learnings.py status --root /absolute/path/to/workspace
python3 scripts/learnings.py search --root /absolute/path/to/workspace --query "pnpm" --limit 5
```

### 4) Search before logging to avoid duplicates

```bash
python3 scripts/learnings.py search --root /absolute/path/to/workspace --query "keyword or pattern" --limit 10
```

### 5) Log the right kind of entry

#### Learning
```bash
python3 scripts/learnings.py log-learning \
  --root /absolute/path/to/workspace \
  --category correction \
  --priority high \
  --area backend \
  --summary "Project uses pnpm workspaces, not npm" \
  --details "Attempted npm install. Lockfile and workspace config showed pnpm." \
  --suggested-action "Check for pnpm-lock.yaml before assuming npm." \
  --source error \
  --related-files pnpm-lock.yaml pnpm-workspace.yaml \
  --tags package-manager,pnpm
```

#### Error
```bash
python3 scripts/learnings.py log-error \
  --root /absolute/path/to/workspace \
  --name docker-build \
  --priority high \
  --area infra \
  --summary "Docker build failed on Apple Silicon due to platform mismatch" \
  --error-text "error: failed to solve: no match for platform linux/arm64" \
  --context "docker build -t myapp . on Apple Silicon" \
  --suggested-fix "Retry with --platform linux/amd64 or update base image" \
  --reproducible yes \
  --related-files Dockerfile
```

#### Feature request
```bash
python3 scripts/learnings.py log-feature \
  --root /absolute/path/to/workspace \
  --capability export-to-csv \
  --priority medium \
  --area backend \
  --summary "User needs report export to CSV" \
  --user-context "Needed for sharing weekly reports" \
  --complexity-estimate simple \
  --suggested-implementation "Add --output csv alongside existing JSON output" \
  --frequency recurring \
  --related-features analyze-command,json-output
```

### 6) Promote proven lessons into memory

Common targets:
- `CLAUDE.md` — durable project facts and conventions
- `AGENTS.md` — workflow rules and automation guidance
- `SOUL.md` — behavioural principles in OpenClaw workspaces
- `TOOLS.md` — tool-specific gotchas in OpenClaw workspaces

### 7) Extract a reusable skill when the pattern is real

```bash
python3 scripts/extract_skill.py \
  --root /absolute/path/to/workspace \
  docker-build-fixes \
  --description "Fix recurring Docker build issues." \
  --from-learning-id LRN-20260313-001 \
  --scaffold-evals
```

## Logging rules that matter most

1. **Search first.** Duplicate entries are worse than missing tags.
2. **Prefer durable lessons.** Only log what should change future behaviour.
3. **Be specific.** Name the assumption, failure, or convention clearly.
4. **Include the fix or prevention rule.** An entry without next action is weak.
5. **Use stable pattern keys for recurring problems.**
6. **Promote aggressively once a rule is proven.**
7. **Do not interrupt the user with bookkeeping.**

## Recommended references

- `references/entry-formats.md` — full field schemas and manual templates
- `references/examples.md` — concrete examples of good entries and promotions
- `references/promotion-and-extraction.md` — promotion rules and skill extraction criteria
- `references/platform-setup.md` — Claude Code, Codex, Copilot, and OpenClaw setup notes
- `references/evaluation.md` — trigger/output eval plan for this skill
- `references/openclaw-integration.md` — deeper OpenClaw workflow guidance
