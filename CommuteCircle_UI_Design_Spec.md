# CommuteCircle — UI Design Specification (for Antigravity 3)

> **Audience:** an AI coding agent (Antigravity / Gemini 3) that will build the UI, plus the human reviewing it.
> **Companion document:** `CommuteCircle_PRD.docx` (features, logic, data). This file defines **how it looks and behaves**. When the two disagree on behaviour, the PRD wins; on visuals, this file wins.
> **Visual source:** the two reference images supplied (dark, mono-typeset, mobile-first "operations" UI with indigo primary, green status, ticked progress bar, big turn-by-turn numerals).

---

## 0. Agent Brief (read first)

**Build two mobile-first PWA portals in one React codebase:**

| Portal | Route root | Who | Accent behaviour |
|---|---|---|---|
| **Peer Booking Portal (PB)** | `/app` | Passenger ("user app") | Indigo primary. Owns the **Relay Mode QR / Journey Pass**. |
| **Rider Portal (RD)** | `/rider` | Vehicle owner offering seats | Same brand; green used more for "active drive". Owns the **QR Scanner**. |

**Non-negotiables**
1. Use **Sometype Mono** everywhere (Google Fonts). No second typeface.
2. Use only the design tokens in §3. No hard-coded hex values in components.
3. Dark theme only for v1. Page background `--cc-bg`, cards on `--cc-surface`.
4. Every feature that is common to both portals gets a screen in **both** portals (see parity table §8.0).
5. Every screen must implement **all listed states** (loading, empty, error, offline where relevant).
6. Touch targets ≥ 48 × 48 px. SOS shield is reachable with one thumb on every live screen.
7. Build components first (§6), then screens (§8–§10). Do not inline one-off styles.

**Suggested stack:** React + Vite + TypeScript, Tailwind CSS (tokens mapped in §3.9), Leaflet + OSM tiles (custom dark style, §7), `qrcode` for QR generation, `html5-qrcode` for scanning, Framer Motion for motion, Lucide icons.

---

## 1. Design Principles

1. **Glanceable while moving.** Big monospace numerals for the one thing that matters now (distance, ETA, wait time, fare). Everything else is secondary.
2. **One primary action per screen.** A single full-width indigo button at the bottom; secondary actions are square icon buttons or ghost buttons.
3. **Status is colour + label, never colour alone.** Green pill "IN PROGRESS", blue pill "AVAILABLE", amber "WAITING", red "SOS".
4. **Trust and safety are visible, not buried.** Trust tier chip appears on every person card; SOS shield on every live screen.
5. **Privacy is shown.** Fuzzy zones are drawn as blurred regions; exact points appear only after reveal.
6. **Calm under stress.** SOS and check-in screens use fewer elements, larger type, no decoration.

---

## 2. What We Take From the Reference Images

| Observed in reference | Becomes in CommuteCircle |
|---|---|
| Sometype Mono headings and body | Global font; numerals use tabular figures |
| Very dark navy backdrop, slightly lighter card surface | `--cc-bg`, `--cc-surface`, `--cc-surface-2` |
| Indigo `#283AAF` primary button, "View on map" tile | Primary CTA and map-jump tile |
| Green `#0D9F5E` "IN PROGRESS" pill | Active ride/drive status pill |
| Light indigo `#788AFE` uppercase micro-labels ("CLIENT", "ADDRESS") | Field labels and card captions |
| Turn card: small "Turn left" caption, giant `0.4 km` with arrow | **Live Nav Card** used in Active Drive and Live Ride |
| Barcode-style ticked progress bar with `2.8 KM · 17 MIN · 11:06 AM` | **Tick Progress** for route progress and hotspot wait |
| Card with radial glow (lighter blue-grey top-centre fading to surface) | Card "glow" variant for hero cards |
| Square rounded back button top-left, "•••" top-right | Standard app bar |
| Ghost "Pause shift" button on translucent dark | Secondary action style |
| Horizontal "Next tasks" cards peeking off the right edge | **Peek carousel** for upcoming pickups / pod days |
| Mini-map tile + white pin + indigo arrow tile | **Map Jump Row** |
| Swipe-to-complete indigo bar with `>>>` ("Drop off the order") | **Swipe Confirm** for Accept pickup, Complete ride |
| Contact support button + chat + phone square icon buttons | Contact row (Support, Chat, Call) |
| Gradient route line teal → blue, white vehicle marker | Map route styling |

---

## 3. Design Tokens

### 3.1 Colour

**Brand (from references)**

| Token | Hex | Use |
|---|---|---|
| `--cc-primary` | `#283AAF` | Primary buttons, active tab, jump tile |
| `--cc-primary-hover` | `#3145C8` | Hover / pressed lighten (derived) |
| `--cc-primary-soft` | `#788AFE` | Micro-labels, links, icons on dark, focus ring |
| `--cc-success` | `#0D9F5E` | In-progress, verified, safe, "clean ride" |
| `--cc-surface` | `#20222E` | Cards, sheets, nav bar |

**Extended (derived; the reference set has no danger/warn colours)**

| Token | Hex | Use |
|---|---|---|
| `--cc-bg` | `#0A0B1E` | App background (matches image 1 backdrop) |
| `--cc-bg-alt` | `#14161F` | Alternate flat backdrop (image 2) |
| `--cc-surface-2` | `#2A2D3E` | Raised card on surface, inputs |
| `--cc-surface-glow` | `#343A5C` | Top glow colour of hero cards |
| `--cc-border` | `rgba(255,255,255,0.08)` | Hairlines |
| `--cc-text` | `#FFFFFF` | Primary text |
| `--cc-text-2` | `#B4B8CC` | Secondary text |
| `--cc-text-3` | `#7C8099` | Disabled, hints |
| `--cc-warn` | `#F5A524` | Waiting, check-in, low confidence |
| `--cc-danger` | `#E5484D` | SOS, errors, destructive |
| `--cc-info` | `#2F6FED` | "AVAILABLE" pill, route mid-blue |
| `--cc-route-a` | `#18B6C8` | Route gradient start (teal) |
| `--cc-route-b` | `#2F6FED` | Route gradient end (blue) |

**Tier colours (Trust Ranking)**

| Tier | Token | Hex |
|---|---|---|
| Newcomer | `--cc-tier-1` | `#7C8099` |
| Trusted | `--cc-tier-2` | `#788AFE` |
| Verified Guardian | `--cc-tier-3` | `#0D9F5E` |
| Community Anchor | `--cc-tier-4` | `#F5C542` |

### 3.2 Gradients

```css
--cc-card-glow: radial-gradient(120% 90% at 50% 0%, #343A5C 0%, #20222E 70%);
--cc-route: linear-gradient(90deg, #18B6C8 0%, #2F6FED 100%);
--cc-sos-glow: radial-gradient(100% 80% at 50% 0%, rgba(229,72,77,.35) 0%, #20222E 70%);
```

### 3.3 Typography — Sometype Mono

Load: `https://fonts.googleapis.com/css2?family=Sometype+Mono:wght@400;500;600;700&display=swap`
Fallback stack: `"Sometype Mono", ui-monospace, "SF Mono", Menlo, monospace`. Enable `font-variant-numeric: tabular-nums`.

| Style | Size / line | Weight | Case | Use |
|---|---|---|---|---|
| `display-xl` | 56 / 60 | 600 | as is | Live nav distance (`0.4 km`), wait time |
| `display-l` | 40 / 44 | 600 | as is | Fare amount, trust score |
| `title-l` | 24 / 30 | 600 | as is | Screen titles |
| `title-m` | 20 / 26 | 500 | as is | Card titles (`Drop Off #774210`) |
| `body-l` | 16 / 24 | 400 | as is | Main body |
| `body-m` | 14 / 20 | 400 | as is | Secondary text |
| `label` | 11 / 14 | 500 | UPPERCASE, +0.06em | Micro-labels in `--cc-primary-soft` |
| `pill` | 11 / 12 | 600 | UPPERCASE, +0.08em | Status pills |
| `caption` | 12 / 16 | 400 | as is | Timestamps, footnotes |

### 3.4 Spacing (4 px base)

`2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 56`. Screen side padding **20**. Card inner padding **16**. Gap between cards **12**. Section gap **24**.

### 3.5 Radius

`--r-pill: 999px` · `--r-card: 24px` · `--r-inner: 16px` · `--r-btn: 16px` · `--r-icon-btn: 16px` (square with soft corners, as in references) · `--r-input: 14px` · `--r-phone-frame: 44px` (desktop preview only).

### 3.6 Elevation and borders

Cards have **no** heavy shadow; separation is by surface tone plus a 1 px `--cc-border` hairline. Sheets: `box-shadow: 0 -12px 40px rgba(0,0,0,.45)`. Primary button: `box-shadow: 0 8px 24px rgba(40,58,175,.35)`.

### 3.7 Motion

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(.2,.8,.2,1)` | Enter |
| `--ease-in-out` | `cubic-bezier(.4,0,.2,1)` | Move |
| `--t-fast` | 120 ms | Press states |
| `--t-base` | 220 ms | Cards, sheets |
| `--t-slow` | 420 ms | Page transitions, tick fill |

Respect `prefers-reduced-motion`: replace slides with fades, disable pulses.

### 3.8 CSS variables (drop into `src/styles/tokens.css`)

```css
:root {
  --cc-primary:#283AAF; --cc-primary-hover:#3145C8; --cc-primary-soft:#788AFE;
  --cc-success:#0D9F5E; --cc-surface:#20222E; --cc-surface-2:#2A2D3E; --cc-surface-glow:#343A5C;
  --cc-bg:#0A0B1E; --cc-bg-alt:#14161F;
  --cc-text:#FFFFFF; --cc-text-2:#B4B8CC; --cc-text-3:#7C8099;
  --cc-warn:#F5A524; --cc-danger:#E5484D; --cc-info:#2F6FED;
  --cc-route-a:#18B6C8; --cc-route-b:#2F6FED;
  --cc-border:rgba(255,255,255,.08);
  --cc-tier-1:#7C8099; --cc-tier-2:#788AFE; --cc-tier-3:#0D9F5E; --cc-tier-4:#F5C542;
  --r-card:24px; --r-inner:16px; --r-btn:16px; --r-input:14px; --r-pill:999px;
  --font: "Sometype Mono", ui-monospace, "SF Mono", Menlo, monospace;
}
html,body{background:var(--cc-bg);color:var(--cc-text);font-family:var(--font);font-variant-numeric:tabular-nums}
```

### 3.9 Tailwind mapping (`tailwind.config.ts`)

```ts
export default {
  theme: { extend: {
    colors: {
      bg:'var(--cc-bg)', surface:'var(--cc-surface)', 'surface-2':'var(--cc-surface-2)',
      primary:{ DEFAULT:'var(--cc-primary)', hover:'var(--cc-primary-hover)', soft:'var(--cc-primary-soft)' },
      success:'var(--cc-success)', warn:'var(--cc-warn)', danger:'var(--cc-danger)', info:'var(--cc-info)',
      text:{ DEFAULT:'var(--cc-text)', 2:'var(--cc-text-2)', 3:'var(--cc-text-3)' },
    },
    fontFamily:{ mono:['var(--font)'] },
    borderRadius:{ card:'24px', inner:'16px', btn:'16px', input:'14px' },
    spacing:{ 18:'4.5rem' },
  } }
}
```

---

## 4. Iconography

Lucide, stroke 1.75, size 20 (24 in nav). Colour `--cc-text` default, `--cc-primary-soft` for informational.

| Meaning | Icon |
|---|---|
| Back | `arrow-left` |
| More | `more-horizontal` |
| Turn | `corner-up-right` / `corner-up-left` |
| Map jump | `arrow-up-right` |
| Chat / Call | `message-circle` / `phone` |
| SOS | `shield-alert` |
| Verified | `badge-check` |
| Hotspot | `map-pin` |
| Pod | `users` |
| Relay | `route` |
| Wallet | `wallet` |
| Scanner | `scan-line` |
| QR | `qr-code` |
| Bus / Walk / Car | `bus` / `footprints` / `car` |
| Trust | `shield-check` |
| Moderator | `gavel` |

---

## 5. App Shell and Layout

### 5.1 Canvas
- Design width **390 × 844** (iPhone-class). Content scales 360–430 px. On desktop, render inside a centred 390 px phone frame (`--r-phone-frame`, 8 px bezel `#0C0D14`, 1 px `--cc-border`) so demos look like the references.
- **Status area:** reserve `env(safe-area-inset-top)`. Home indicator area: `env(safe-area-inset-bottom)` + 8.
- Viewport meta must include `viewport-fit=cover`.

### 5.2 App bar (all inner screens)
```
[ ⟵ ]        Screen title        [ ••• ]
             [ STATUS PILL ]
```
- Back: 44 × 44 square icon button on `--cc-surface`, radius 16.
- Title centred, `title-m`. Optional pill centred below (8 px gap).
- Right slot: `•••` menu or a contextual action.

### 5.3 Bottom navigation (top-level screens only)
Height 68 + safe area. Background `--cc-surface` with top hairline. 4 tabs + centre SOS shield (raised).

| Tab | PB | RD |
|---|---|---|
| 1 | Home | Home |
| 2 | Map | Route |
| 3 (centre) | **SOS shield** | **SOS shield** |
| 4 | Pods | Requests |
| 5 | Profile | Profile |

Active tab: icon and label in `--cc-primary-soft`, 3 px indigo dot above. Inactive: `--cc-text-3`. Labels use `label` style.
The centre shield is a 56 px circle, `--cc-danger` at 16% fill with a 1.5 px danger ring, icon `shield-alert`; it overlaps the bar by 14 px.

### 5.4 Portal switcher
Profile screen top: segmented control **Passenger | Rider**. In the header of Home, a compact chip `PASSENGER ▾` / `RIDER ▾` opens a bottom sheet with both roles. Switching keeps the session and animates a 220 ms cross-fade.

---

## 6. Component Library

Each component lists anatomy, states and specs. Build these before screens.

### 6.1 Button
| Variant | Fill | Text | Use |
|---|---|---|---|
| `primary` | `--cc-primary` | white, `body-l` 500 | One per screen, full width, height 56, radius 16 |
| `secondary` | `--cc-surface` + hairline | white | e.g. "Pause shift" style ghost |
| `success` | `--cc-success` | white | Confirm / Accept where positive |
| `danger` | `--cc-danger` | white | Cancel ride, End SOS |
| `icon` | `--cc-surface` | icon | 48 × 48 square, radius 16 |
States: default · pressed (scale .98, `--t-fast`) · disabled (40% opacity) · loading (three mono dots `···` cycling) · focus (2 px `--cc-primary-soft` ring, 2 px offset).
Layout pattern from reference: **primary (flex-1) + icon + icon** in one row, e.g. `[ Contact support ] [chat] [call]`.

### 6.2 Status Pill
Height 24, padding 0 10, radius pill, `pill` style.
| Variant | Fill | Text | Label examples |
|---|---|---|---|
| `progress` | `--cc-success` | white | IN PROGRESS, VERIFIED |
| `available` | `--cc-info` @ 30% + 1 px `--cc-info` | `#A9C4FF` | AVAILABLE |
| `waiting` | `--cc-warn` @ 20% | `--cc-warn` | WAITING, CHECK-IN |
| `danger` | `--cc-danger` @ 20% | `#FF9A9E` | SOS ACTIVE |
| `neutral` | `--cc-surface-2` | `--cc-text-2` | COMPLETED |
Accessibility: white on `--cc-success` is 3.4:1, acceptable only for bold 11 px+ uppercase pills; never use it for body text.

### 6.3 Card
`--cc-surface`, radius 24, padding 16, hairline border. Variants: `flat`, `glow` (background `--cc-card-glow`, used for hero cards like the nav card), `inset` (`--cc-surface-2`, radius 16, used inside cards).

### 6.4 Field Block (label + value)
```
CLIENT                ← label, --cc-primary-soft
Barbara Nelson        ← body-l, white
```
Stack 4 px gap. Two field blocks in a row use a 2-column grid (gap 16). Used for TIME TO DESTINATION / DISTANCE LEFT.

### 6.5 Live Nav Card (hero)
Direct from reference. Variant `glow`, radius 24.
```
┌───────────────────────────────────────┐
│ Turn left                           ⌄ │  caption + collapse chevron
│                                       │
│    ↱ 0.4 km                           │  display-xl, arrow icon 40px
│                                       │
│ 2.8 KM        17 MIN        11:06 AM  │  label row
│ ||||||||||||||||||||||||||::::::::::: │  Tick Progress
└───────────────────────────────────────┘
```
- Collapse chevron toggles to compact (caption + distance only, 96 px tall).
- Distance updates use a 120 ms number roll.

### 6.6 Tick Progress
A row of 1 px-wide, 16 px-tall vertical ticks, 3 px gap, filling the width. Completed ticks `#FFFFFF`, remaining ticks `rgba(255,255,255,.28)`. Value animates over `--t-slow`. Props: `value 0–1`, `leftLabel`, `midLabel`, `rightLabel`. Reused for: route progress, hotspot wait countdown, SOS escalation countdown (ticks turn `--cc-danger`), QR refresh timer (30 ticks).

### 6.7 Task Card (list and carousel)
```
Pick up #657564               [AVAILABLE]
11 – 12 AM
Documents delivery
Client: Darrel Franklin
```
Adapted for CommuteCircle:
```
Pickup · Hotspot: Peelamedu Junction   [WAITING]
08:10 – 08:20
2 riders waiting · +1 min detour
Passenger: Anita R.  ·  TRUSTED
```
Width 320 in a horizontal scroller with 12 gap; the next card peeks ~40 px at the right edge (scroll-snap start).

### 6.8 Map Jump Row
Left: 2/3-width mini map tile (radius 16, dark tiles, white pin). Right: 1/3-width indigo tile, arrow `arrow-up-right` 32 px above label "View on map". Height 136.

### 6.9 Swipe Confirm
Full width, height 56, `--cc-primary`, radius 16. Left handle: `>>>` chevrons in a translucent white 44 × 44 rounded square. Label centred. Drag right > 85% to trigger; haptic pulse; on release before threshold the handle springs back. Keyboard/screen-reader alternative: a normal button with the same label (visually hidden until focused). Used for: **Accept pickup**, **Complete ride**, **Confirm drop-off**.

### 6.10 Person Card
Avatar 48 (initial fallback) · name (`body-l`) · verified `badge-check` · **Trust chip** · secondary line (vehicle / route). Right: `icon` buttons chat/call (only after both confirm). Trust chip: pill with tier colour dot + `TRUSTED · 78`.

### 6.11 Trust Score Ring
Circular gauge 120 px, stroke 10, track `--cc-surface-2`, arc in tier colour, centre `display-l` score and `label` tier name. Below: six horizontal bars (Safety 35, Reliability 25, Peer feedback 15, Verification 10, Consistency 10, Ride count 5) each with `label` and value.

### 6.12 Input, Select, Toggle, Segmented, Chips
- Input: height 52, `--cc-surface-2`, radius 14, label above in `label` style, focus ring `--cc-primary-soft`. Error: border `--cc-danger`, helper text in danger.
- Toggle: 52 × 30, on = `--cc-success`, off = `--cc-surface-2`.
- Segmented: `--cc-surface` track, active segment `--cc-primary`.
- Filter chip: height 36, pill, off = surface, on = primary.
- OTP: six 48 × 56 boxes, mono digits.

### 6.13 Bottom Sheet
`--cc-surface`, top radius 28, grab handle 36 × 4, max height 85%. Backdrop `rgba(5,6,15,.6)`. Enter 220 ms slide-up.

### 6.14 Toast and Banner
Toast: top, radius 16, `--cc-surface-2`, icon + text, 3.5 s. Persistent banner (offline, tracking active): full width under the app bar, height 36, `label` text, `--cc-warn` @ 15% or `--cc-success` @ 15%.

### 6.15 QR Card (Journey Pass)
White QR on rounded white tile (`#FFFFFF`, radius 20, padding 16) — the only white surface in the app, so it scans reliably. Below: short code in `display-l` letter-spaced, refresh Tick Progress (30 ticks). Outer card `glow`.

### 6.16 Timeline (Relay legs)
Vertical line 2 px `--cc-border`; nodes 12 px circles. Leg icon (`car`/`bus`/`footprints`) in a 36 px `--cc-surface-2` square. States: done (green node, strike-through-free, `--cc-text-2`), current (indigo node with pulse ring, text white, leg card glows), upcoming (hollow node, `--cc-text-3`).

### 6.17 SOS Shield Button
See §5.3. Behaviour: **press and hold 3 s** → ring fills clockwise in danger colour with haptic ticks; release early cancels. Also triple-tap and shake triggers (PRD G5). Silent mode: no sound, screen shows a normal-looking state for 1 s then discreet indicator (small red dot on the status pill).

### 6.18 Empty, Error, Skeleton
- Skeleton: `--cc-surface-2` blocks with a 1.4 s shimmer.
- Empty: mono line-art icon 56, `title-m` line, `body-m` explanation, one action.
- Error: `--cc-danger` icon, plain sentence, `Retry` button.

---

## 7. Map Styling (Leaflet)

- Base tiles: OSM tiles run through a dark filter (`filter: invert(1) hue-rotate(200deg) brightness(.75) contrast(.9) saturate(.5)`) or a dark vector style; background `#0F1120`.
- Street labels `--cc-text-3`, area labels (e.g. district names) faint uppercase.
- **Route line:** 6 px, gradient teal → blue (`--cc-route`), rounded caps. Travelled portion at 40% opacity.
- **Vehicle marker:** white rounded car glyph, rotated to heading, soft 12 px white glow.
- **Passenger marker:** indigo dot with white ring.
- **Hotspot marker:** white pin inside 36 px `--cc-surface` circle; count badge (`2`) top-right in `--cc-warn`.
- **Fuzzy zone:** filled polygon `rgba(120,138,254,.18)` with a 1 px dashed `--cc-primary-soft` border and CSS `backdrop-filter: blur(6px)` overlay to communicate "blurred".
- **Corridor:** 40 px wide translucent band along the route.
- **SOS:** pulsing danger circle (radius animates 24 → 72 px, 1.6 s), responders as green dots that light up on acknowledge.
- Controls: zoom hidden on mobile; recentre button as a 48 px `icon` button bottom-right above the sheet.

---

## 8. Screens — Peer Booking Portal (`/app`)

### 8.0 Portal parity (build both sides)
| Feature | PB screen | RD screen |
|---|---|---|
| Onboarding and verification | 8.1 | 9.1 |
| Ghost Commutes | 8.2 Home | 9.2 Home |
| Hotspots | 8.4 Waiting | 9.5 Route and hotspots |
| Pickup handshake | 8.6 shows QR | 9.6 Scanner |
| Relay Mode | 8.7, 8.8 | 9.7 Handoff |
| SafeTrail | 8.5 Live Ride | 9.8 Active Drive |
| Pods | 8.9 | 9.9 |
| Trust | 8.10 | 9.10 |
| Wallet and fare | 8.11 | 9.11 |
| Safety centre, Responder, Moderator | 10.x | 10.x |

### 8.1 Onboarding and verification
Steps as a vertical checklist card: **Phone OTP → College/employer ID → Government ID → Selfie**. Each row: icon square, title, `label` status (`DONE` green, `NEXT` indigo, `LOCKED` grey). Below: Tick Progress showing `verification 2/4`.
- OTP screen: six OTP boxes, `Resend in 00:28` caption, primary `Verify`.
- Schedule entry: week grid (Mon–Sun) with time chips, home zone and destination pickers (map with fuzzy zone).
- Safety preferences: toggles (Women-only, Safe route after 20:00, Min tier selector), trusted contacts list with `+ Add contact`.
States: loading, wrong OTP (shake 220 ms, danger helper), upload failed.

### 8.2 Home
```
[ PASSENGER ▾ ]                       [ 🔔 ]
Good morning, Anita
─────────────────────────────────────────
GHOST COMMUTE · TOMORROW        [CONF 86%]   ← glow card
08:10  Peelamedu → Campus
3 riders · Rs 28
[ Skip ]                     [ Confirm ]
─────────────────────────────────────────
ACTIVE RIDE (if any) → Live Nav Card mini
─────────────────────────────────────────
NEXT TASKS:   [ peek carousel of pod days / proposals ]
─────────────────────────────────────────
Savings   Rs 412   CO₂ 6.2 kg   Streak 9
```
- Confidence shown as a pill (`≥80` green, `60–79` warn).
- Confirm = primary button; Skip = secondary.
- States: no proposals (empty: "No predicted trips yet — add your weekly schedule"), loading skeleton, offline banner.

### 8.3 Map
Full-bleed map with pods, proposals, hotspots and safe-route overlay. Top: filter chips (Pods · Hotspots · Safe route). Bottom sheet (peek 160 px): nearest hotspot card with wait estimate and `I'm waiting`. Recentre button.

### 8.4 Hotspot Waiting
Reached from `I'm waiting`. Distance gate: if > 100 m the button shows `Move closer · 240 m`.
```
     ⟵        Waiting at Junction        •••
                [WAITING]
   ┌─────────────────────────────────────┐
   │ ESTIMATED WAIT                      │
   │ 4 min                               │  display-xl
   │ ||||||||||:::::::::::::             │  Tick Progress (fallback timer 10 min)
   │ CONFIDENCE   HIGH · 8 of 10 pickups │
   └─────────────────────────────────────┘
   [ Person card: matched rider preview ]
   [ Share live link ]  [ Cancel ]
   Fallback in 06:00 → "Take bus leg (Relay)"
```
- At fallback time, a sheet slides up: `No ride yet. Try Relay?` with primary `See Relay options`.
- SafeTrail banner: `TRACKING ON` (green).
- The QR handshake card is one tap away: primary button `Show pickup code`.

### 8.5 Live Ride (SafeTrail)
Layout mirrors reference image 1 (left phone):
```
⟵        Ride #54266        •••
          [IN PROGRESS]
[ Live Nav Card: next pickup/drop, km, ETA, ticks ]
[ Person card: rider + vehicle + plate + RIDE CODE 4821 ]
[ FIELD: PICKUP POINT (revealed) ]  [ FIELD: FARE SHARE Rs 22 ]
[ Contact support ]  [chat] [call]
        (floating SOS shield above nav)
```
- Deviation prompt: bottom sheet `Are you okay?` with two large buttons `I'm okay` (success) and `Need help` (danger), 60-tick countdown.
- Ride complete: swipe confirm `Complete ride`, then feedback sheet.

### 8.6 Pickup QR (handshake)
Full-screen `glow` card: title `Show this to your rider`, QR Card (§6.15) with 30-tick refresh, short code below. Below: the leg you are on and vehicle plate to verify (`Match this plate: TN 38 AB 1234`). Screen keeps awake. States: refreshing (QR dims 200 ms), offline (`Last code valid for 00:42`), used (green check overlay `SCANNED`).

### 8.7 Relay Planner
Input card (from → to → time), then three option cards in a vertical list: **Cheapest**, **Fastest**, **Safest**. Each card: leg icons in a row (`car › bus › footprints`), total `display-l` time, cost, safety rating (`shield-check` + score). Selecting shows the timeline and primary `Create journey pass`.

### 8.8 Journey Pass (Relay Mode QR)
```
⟵      Journey pass       •••
        [ACTIVE]
[ QR Card ]
CURRENT LEG  1 of 3 · Pool → Handoff Gandhipuram
[ Timeline: Pool (current) → Bus 27 → Walk 400 m ]
[ Contact support ] [chat] [call]
```
- Current leg node pulses. Bus legs show `I've boarded` / `I've got off` toggles (geofence assist).
- After each scan the leg advances with a 420 ms tick-fill and a toast.

### 8.9 Pods
Pod dashboard card (glow): pod name, 3–4 avatars, streak, `Rs saved`, `CO₂ saved`. Below: driver rotation as a 7-day strip (Mon–Sun chips, today highlighted, driver day marked with `car` icon). `Standby pool` list and `Request substitute` button. Pod reputation bar with Tick Progress.

### 8.10 Trust profile
Trust Score Ring, tier progress (Tick Progress to next tier with `12 clean rides to Guardian`), six weighted bars, badges grid (3 columns, locked badges at 40%), vouch card, leaderboards tab (Pod · Campus · Streak) in a segmented control, `Dispute a rating` link.

### 8.11 Wallet, fare and history
Balance `display-l`; `Top up` primary; ledger list rows (icon, title, time, amount with `+` green / `−` white). Fare detail card: `Your fare is Rs 22 because you added 0.8 km` with a mini breakdown (base share, detour adjust, platform fee). History list of task cards with status pills.

---

## 9. Screens — Rider Portal (`/rider`)

### 9.1 Onboarding, vehicle and licence
Same checklist as PB plus **Vehicle** (type chips, plate input, seats stepper, fuel chips, mileage input) and **Licence upload**. Vehicle status pill: `PENDING` (warn) → `APPROVED` (green).

### 9.2 Home
```
[ RIDER ▾ ]                           [ 🔔 ]
TOMORROW · OPEN SEATS            [CONF 82%]
08:10  Peelamedu → Campus
You can carry 3 · Cost share Rs 84 of Rs 96
[ Skip ]                    [ Open seats ]
─────────────────────────────────────────
NEXT TASKS: [ Pickup cards: hotspot, waiting count, detour ]
─────────────────────────────────────────
Cost recovered Rs 640   Drives 11   Streak 9
```
Demand nudge banner: `HIGH DEMAND · Open extra seat` with a one-tap `+1 seat`.

### 9.3 Offer a ride
Form card: route picker (map with corridor), departure time, seats stepper, recurring days chips, women-only toggle, min tier. Primary `Publish trip`. Preview card shows how passengers will see it.

### 9.4 Requests inbox
List of person cards with trust chip, fare share, detour. Each has `Decline` (secondary) and `Accept` (primary). Empty state: `No requests yet. Your trip is visible to matching commuters.`

### 9.5 Route and hotspots
Reference image 1 (centre phone) layout: full-bleed map with the gradient route and white vehicle marker; top-right ghost button `Pause trip`; bottom Live Nav Card. Hotspot markers with waiting counts; tapping opens a sheet: `2 riders waiting · +1 min detour` with `Accept pickup` (swipe confirm) and `Skip`.

### 9.6 Scanner (rider portal)
Full-screen camera view with dark overlay and a 260 px rounded scan window; corner brackets in `--cc-primary-soft`; a 2 px scan line in `--cc-success` sweeping every 1.6 s.
```
⟵         Scan pass         [flash]
        ┌ ─ ─ ─ ─ ─ ─ ┐
        │   camera    │
        └ ─ ─ ─ ─ ─ ─ ┘
   Point at the passenger's QR
   [ Enter code instead ]
```
Bottom sheet result cards (per PRD 4.4):
| State | Card |
|---|---|
| Valid | Person card (photo, name, tier, leg, pickup point) + swipe confirm `Accept passenger` |
| Expired | Warn card: `Ask passenger to refresh the QR` |
| Already used | Danger card: `This code was already scanned` |
| Wrong rider / leg | Danger card: `Not assigned to this ride` (no passenger details) |
| Too far | Warn card: `Passenger is not at the pickup point` |
| Invalid | Danger card: `Not a CommuteCircle pass` |
Manual entry: six mono boxes for the short code with the same result cards. Camera denied: explanatory empty state plus manual entry.

### 9.7 Handoff
Card listing `RECEIVE at Gandhipuram` and `HAND OVER at Ukkadam` passengers with person cards and the next rider's plate/ETA. Primary `Scan incoming passenger` opens 9.6.

### 9.8 Active Drive
Mirror of reference image 2 (right phone) adapted:
```
⟵          My drive          •••
Current task:
[ Drop off #774210        [IN PROGRESS] ]
  11 – 12 AM
  TIME TO DESTINATION   DISTANCE LEFT
  11 min                2.6 km
[ Map Jump Row ]
[ Pause trip ]
Next tasks:  [ Pickup #657564 ][ Pickup … ]
```
Plus the SOS shield and an `Open scanner` icon button. Complete stops with Swipe Confirm `Complete drive`.

### 9.9 Pods
Same as 8.9 but shows `YOU DRIVE: Mon · Wed`, standby requests inbox (`Accept substitute`), and rotation ledger.

### 9.10 Trust profile
Same as 8.10 plus a **Driving smoothness** bar and safety events list (anonymised).

### 9.11 Cost recovery and wallet
Hero card: `COST RECOVERED Rs 640` with a Tick Progress against `ACTUAL COST Rs 720` (cap check: bar never exceeds 100%). Text: `You share the cost of trips you were already making. You do not earn a fare.` Ledger below.

---

## 10. Shared Safety, Responder and Moderator Screens (both portals)

### 10.1 Safety Centre
Sections as cards: Trusted contacts, Safety preferences (toggles), Privacy view (`WHAT OTHERS SEE`: Stranger → Blurred zone, Matched → Corridor, Confirmed → Exact point), `Test SOS` button (sandbox, clearly labelled).

### 10.2 Check-in prompt (deviation)
Bottom sheet over dimmed map. Big caption `We noticed a detour`, question `Are you okay?`, 60-tick countdown, two full-width buttons stacked: `I'm okay` (success), `Need help` (danger). Sound and haptic on show.

### 10.3 SOS active (sender)
Background `--cc-sos-glow`. Minimal:
```
        [SOS ACTIVE]
  Your live location is being shared
  Contacts notified ✓   Support notified ✓
  Nearby moderators: 3 alerted → 1 acknowledged
  ||||||||||||||||:::::::  Widening in 00:32
  [ Call 112 ]   (primary danger, large)
  [ I'm safe — end alert ]  (secondary)
```
Silent-mode variant: identical data behind a discreet indicator (per §6.17).

### 10.4 Responder alert
Full-screen sheet with `--cc-sos-glow`: `Someone nearby needs help`, three field blocks (DISTANCE 850 m · ETA 3 min · MESSAGE), banner `Call 112 first. Do not confront anyone. Stay safe.` Buttons: `Acknowledge` (primary) and `Can't help` (secondary). No personal data shown. Mini live-SOS map beneath after acknowledging.

### 10.5 Responder availability
Profile toggle card `SOS RESPONDER` with helper `Alerts arrive only while the app is open and location is on.`

### 10.6 Moderator queue (role-gated)
Segmented control: Flagged rides · Disputes · Hotspots · Vouching. Case card: anonymised ID, reason, time, `Review` button. Case detail shows anonymised data only, actions (`Approve`, `Dismiss`, `Escalate`), reason input, and a log note `Action will be recorded in the audit log`. Conflict-of-interest cases show a disabled state with an explanation.

---

## 11. Motion and Interaction Details

| Moment | Motion |
|---|---|
| Screen push | 220 ms slide-left 24 px + fade, `--ease-out` |
| Bottom sheet | Slide up 220 ms; drag to dismiss with rubber-band |
| Ghost card Confirm | Card border flashes green 300 ms, card collapses to a `CONFIRMED` pill |
| Tick Progress | Fill left to right 420 ms; last tick pulses when complete |
| Nav distance | Roll digits 120 ms |
| Scan success | Scan window turns green, 80 ms haptic, result sheet rises |
| Scan failure | Window flashes red twice (each 120 ms), 2 × short haptic |
| Leg advance | Timeline node fills, line segment draws 420 ms, toast |
| SOS hold | Ring fills over 3 s, haptic every 500 ms |
| SOS responders | Dots appear with 200 ms stagger and scale-in |
Use Framer Motion `layout` transitions sparingly; no parallax; no infinite decorative animations except QR-scan line, SOS pulse and current-leg pulse.

---

## 12. Accessibility

- Contrast: white on `#283AAF` 9.1:1; `#788AFE` on `#20222E` 5.2:1; `--cc-text-2` on surface ≥ 7:1. White on `#0D9F5E` is 3.4:1 (use only for bold uppercase pills; body text on green uses `#04150C`).
- Targets ≥ 48 px; 8 px minimum gap between adjacent targets.
- All icon-only buttons need `aria-label` (`Call rider`, `Open chat`, `Back`).
- Swipe Confirm always has a button fallback.
- Live regions: SOS status, check-in countdown, scan results use `aria-live="assertive"`; other status changes `polite`.
- Focus order follows visual order; focus ring `--cc-primary-soft`.
- Text scales to 200% without clipping (cards use `min-height`, not fixed height).
- Never rely on colour alone (pills carry labels; map markers carry icons and counts).
- Colour-blind check: green vs red always paired with icon (`check`, `alert`).

---

## 13. Content and Microcopy

Tone: short, calm, operational, mono-friendly. Uppercase labels only for captions and pills.

| Situation | Copy |
|---|---|
| Ghost card | `Tomorrow 08:10 · Peelamedu → Campus · 3 riders · Rs 28` |
| Fare reason | `Your fare is Rs 22 because you added 0.8 km.` |
| Waiting | `Waiting at Junction. Estimated wait 4 min.` |
| Fallback | `No ride yet. Want a bus leg instead?` |
| Scan valid | `Passenger verified. Accept to start the leg.` |
| Scan expired | `Code expired. Ask the passenger to refresh.` |
| Check-in | `We noticed a detour. Are you okay?` |
| SOS advice | `Call 112 first. Do not confront anyone.` |
| Cost recovery | `You share the cost of a trip you were already making. You do not earn a fare.` |
| Empty pods | `No pod yet. We will suggest one when your routes match.` |
Currency `Rs`. Times 24-hour in cards (`08:10`), range format `11 – 12 AM` allowed in task cards as in the reference.

---

## 14. State-to-UI Mapping

| Ride status | Pill | Primary action (PB) | Primary action (RD) |
|---|---|---|---|
| Proposed | `neutral` PROPOSED | Confirm | Open seats |
| Confirmed | `available` CONFIRMED | Go to hotspot | Start trip |
| Waiting | `waiting` WAITING | Show pickup code | Accept pickup |
| Verified | `progress` VERIFIED | — | — |
| In transit | `progress` IN PROGRESS | Complete ride (swipe) | Complete drive (swipe) |
| Completed | `neutral` COMPLETED | Rate ride | View summary |
| Cancelled | `neutral` CANCELLED | Rebook | — |
| No-show | `waiting` NO-SHOW | — | Report |
| SOS | `danger` SOS ACTIVE | End alert | End alert |

---

## 15. Responsive and PWA Behaviour

- Manifest: name `CommuteCircle`, `display: standalone`, theme colour `#0A0B1E`, background `#0A0B1E`, icon 512 px on `--cc-primary`.
- ≥ 768 px width: centre the app in a 390 px phone frame; show a left-hand demo panel with the role switcher and a `Simulate GPS` control (dev only).
- Orientation: portrait locked. Offline: show persistent banner and keep the last QR until its own expiry.
- Camera and geolocation require HTTPS; explain permission prompts with a pre-permission sheet before the browser prompt.
- Keep-awake during pickup, live ride, active drive and scanner via the Screen Wake Lock API.

---

## 16. Implementation Plan for Antigravity

**Folder layout**
```
src/
  styles/tokens.css
  components/  (Button, IconButton, Pill, Card, FieldBlock, LiveNavCard, TickProgress,
                TaskCard, MapJumpRow, SwipeConfirm, PersonCard, TrustRing, BottomSheet,
                Toast, QRCard, Timeline, SOSShield, Skeleton, EmptyState)
  layouts/      (AppShell, AppBar, BottomNav, PhoneFrame)
  portals/
    peer/       (Home, Map, Waiting, LiveRide, PickupQR, RelayPlanner, JourneyPass, Pods, Trust, Wallet)
    rider/      (Home, OfferRide, Requests, Route, Scanner, Handoff, ActiveDrive, Pods, Trust, CostRecovery)
    shared/     (Onboarding, SafetyCentre, CheckIn, SOSActive, ResponderAlert, ModeratorQueue)
  map/          (darkStyle, markers, fuzzyZone, routeLine)
```

**Task order (do in sequence, verify each before moving on)**
1. Tokens, font, Tailwind mapping, `PhoneFrame`, `AppShell`, `BottomNav`, portal switcher.
2. Primitives: Button, IconButton, Pill, Card, FieldBlock, Input, Toggle, Segmented, BottomSheet, Toast, Skeleton.
3. Signature components: LiveNavCard, TickProgress, TaskCard carousel, MapJumpRow, SwipeConfirm.
4. Map layer: dark tiles, gradient route, markers, fuzzy zone, SOS pulse.
5. PB screens 8.1 → 8.11, then RD screens 9.1 → 9.11.
6. Shared safety screens 10.1 → 10.6.
7. QR: `QRCard` with 30 s refresh and Scanner with `html5-qrcode`, result sheets for all states.
8. Motion pass, accessibility pass, offline/empty/error states.

**Definition of done (per screen)**
- Matches tokens, no raw hex or px outside tokens.
- All states implemented (default, loading, empty, error, offline where applicable).
- 390 × 844 and 360 × 780 viewports pass without horizontal scroll.
- Keyboard and screen-reader path works for every action, including Swipe Confirm fallback.
- SOS shield reachable and functional on every live screen.

**Visual QA checklist**
- [ ] Only Sometype Mono is loaded; numerals are tabular.
- [ ] Nav card, tick bar, pills and swipe bar visually match the reference language.
- [ ] Exactly one primary button per screen.
- [ ] White QR tile is the only white surface; QR scans from 30 cm on a phone.
- [ ] Fuzzy zones render as blurred regions, never exact addresses, before reveal.
- [ ] Rider portal never shows "earnings", only cost recovery.
- [ ] Every PB feature listed in §8.0 has its RD counterpart.

---

## 17. Open Design Decisions

1. Light theme is out of scope for v1; tokens are structured so a light set can be added under `[data-theme="light"]`.
2. Danger and warning colours are additions to the reference palette; adjust if the brand owner supplies official values.
3. Tamil and Hindi strings: layouts allow 30% text expansion; Sometype Mono has no Tamil glyphs, so fall back to `Noto Sans Tamil` for those strings only.
