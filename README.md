# D&D Encounter XP Tracker

A lightweight browser tool for Dungeon Masters to track experience points across multiple combat encounters in a single session. No install, no account — just open and go.

**Live:** https://nerdytoddgerdy.github.io/encounter-xp-tracker/

## Features

- Add multiple encounters per session, each with their own monster entries
- Select monster Challenge Rating (CR 0–30) with XP values auto-filled
- Applies official D&D 5e encounter multipliers based on total monster count
- Tracks base XP, multiplier, and adjusted XP per encounter
- Shows running total XP and XP-per-PC split for the full session
- Optional session label (e.g. "Session 12") included in copied output
- Copy full session summary to clipboard with one click
- Delete encounters or individual entries at any time

## Usage

1. Set the number of PCs in your party
2. Optionally enter a session name
3. Click **Add Encounter** for each combat
4. Use **Add Entry** within an encounter to add monsters — choose their CR and quantity
5. Watch XP totals update live
6. Click **Copy Results** to copy the full summary to your clipboard

## Encounter Multipliers

| Monsters | Multiplier |
|----------|------------|
| 1        | ×1         |
| 2        | ×1.5       |
| 3–6      | ×2         |
| 7–10     | ×2.5       |
| 11–14    | ×3         |
| 15+      | ×4         |

## Running Locally

No build step required. Serve the directory over HTTP (browsers block local file loading):

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## More Tools

https://nerdytoddgerdy.github.io/nerdy-gerdy-games/
