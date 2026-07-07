# Handoff: FitDenník — fitness & nutrition app

## Overview
FitDenník is a mobile fitness app (Slovak UI) that combines **food/calorie logging** with
**workout tracking**. Its signature feature: the user **photographs a meal**, an AI estimates
the calories and macronutrients, and the user confirms it into their diary. The app also tracks
workouts (sets × reps × weight), personal records (PRs), body weight, and progress charts.

Primary user goal: log food in seconds by taking a photo, and keep an honest record of training
and nutrition over time.

## About the Design Files
The files in this bundle are **design references created in HTML** — interactive prototypes that
show the intended look, layout, copy, and behavior. **They are not production code to copy
directly.**

The task is to **recreate these designs in the target app's environment** using its established
patterns, components, and libraries. This is a phone app, so the natural targets are **SwiftUI
(iOS) / Jetpack Compose (Android)** or a cross-platform framework like **React Native** or
**Flutter**. If no codebase exists yet, pick the most appropriate of these for the project and
implement there. The HTML/CSS values below are the exact visual spec to match — translate them to
the framework's idioms (do not ship the HTML).

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, radii, and interactions are all
specified. Recreate the UI pixel-accurately using the target codebase's native components. Exact
hex values, sizes, and copy are given throughout this document.

---

## Design Tokens

### Color — surfaces (default "Midnight" theme)
| Token | Hex | Use |
|---|---|---|
| bg | `#0F0F11` | App / screen background |
| nav-bg | `#0C0C0E` | Bottom tab bar background |
| well | `#0A0A0B` | Deep wells (camera viewfinder, photo areas) |
| card | `#141416` | Cards, panels |
| chip | `#161618` | Inputs, inactive segmented chips |
| btn-surface | `#18181A` | Round icon buttons (back, close, etc.) |
| track | `#1E1E20` | Progress-bar / ring tracks (unfilled) |
| hairline | `rgba(255,255,255,0.05–0.08)` | Dividers, card borders |

### Color — text
| Token | Hex | Use |
|---|---|---|
| text-primary | `#F4F4F2` | Headings, primary values |
| text-secondary | `#C9C9CE` | Secondary labels |
| text-muted | `#8A8A92` | Captions, units |
| text-faint | `#6B6B72` | Section labels (uppercase), placeholder |
| on-accent | `#0A0A0B` | Text/icon on top of the green accent |

### Color — accent & functional
| Token | Hex | Use |
|---|---|---|
| **accent (calories / primary)** | `#22C55E` | Primary actions, calorie ring, active tab, success |
| protein | `#3B82F6` (blue) | Protein macro |
| carbs | `#F59E0B` (amber) | Carbs macro; also PR / trophy gold |
| fat | `#A78BFA` (violet) | Fat macro |
| danger | `#EF5350` | Destructive (logout) |
| PR / record | `#F59E0B` on `rgba(245,158,11,0.16)` | "🏆 PR" badges & highlights |

Accent tints are used as soft fills, e.g. `rgba(34,197,94,0.14)` for active chip backgrounds and
`rgba(34,197,94,0.5)` for the FAB glow shadow. Macro tints follow the same pattern at ~0.14–0.16 alpha.

> **Theming note:** the master mockup file is built so the accent, surface palette, and font are
> swappable (CSS variables). Default ships as accent `#22C55E`, "Midnight" surfaces, "Manrope".
> Alternate surface presets used in exploration:
> - **Graphite**: bg `#16171C`, nav `#101117`, card `#1D1F26`, chip `#212430`, btn `#262934`, track `#2C2F3A`
> - **True Black**: bg `#000000`, well `#050506`, card `#0D0D0F`, chip `#121214`, btn `#171719`, track `#1E1E21`
>
> Treat Midnight as the production default; the others are optional theme options, not required.

### Typography
- **Family:** Manrope (Google Fonts), weights 400/500/600/700/800. Fallback `sans-serif`.
  (Exploration also supports Space Grotesk and Plus Jakarta Sans as alternates — Manrope is the default.)
- **Scale (px):**
  - Screen title / greeting: 23–25, weight 800
  - Section / card title: 14–16, weight 800
  - Big numeric value (calorie ring center): 24–27, weight 800
  - Body / list item: 13.5–15, weight 600–700
  - Caption / unit: 11–13, weight 500–600
  - Uppercase section label: 11, weight 700, letter-spacing 0.08em, color `#6B6B72`
  - Status bar time: 15, weight 700
- Numerals frequently use thin-space grouping (e.g. "1 358", "4 250 kg").

### Spacing & sizing
- Screen horizontal padding: **20px** (cards), **22px** (text rows/headers)
- Card internal padding: 16–20px
- Gap between list rows: 13–14px vertical, separated by 1px hairline
- Phone frame: **390px wide**, content height ~844px (iPhone-class)

### Radius
| Element | Radius |
|---|---|
| Phone frame (mockup bezel only) | 42–46px |
| Large card / camera area | 22–28px |
| Standard card / panel | 18–20px |
| Input / segmented chip | 12–14px |
| Round icon button | 50% (38×38px) |
| Pill / tag | 999px |
| Progress bar / ring stroke | rounded caps |

### Shadows
- Card elevation (mockup): `0 34px 70px -24px rgba(0,0,0,0.7)` — soften for production.
- FAB glow: `0 8px 22px -4px rgba(34,197,94,0.55)`
- Toast: `0 12px 30px -8px rgba(34,197,94,0.6)`

### Iconography
Stroke icons, `stroke-width: 2`, round caps/joins (Lucide/Feather style). Tab bar: home, list
(diary), dumbbell (workout), bar-chart (stats). Trophy 🏆 emoji used for PR accents.

---

## Global: Bottom Tab Bar + FAB
Persistent across Home, Diary, Workout, Stats.
- Background `#0C0C0E`, 1px top hairline.
- Four tabs (Domov / Denník / Tréning / Štatistiky): icon 22px + label 10px. Active tab tinted
  accent `#22C55E`, inactive `#6B6B72`.
- **Center FAB**: 52–54px green circle, raised ~18–20px above the bar, on-accent "＋" glyph, glow shadow.
- Tapping the FAB opens the **Add action sheet** (see Interactions).

---

## Screens / Views

> The bundle contains **two** HTML files:
> - `Pridat jedlo fotkou - AI.dc.html` — a **canvas board** showing all 13 screens side by side (best for reading exact layout/measurements per screen).
> - `Prototyp aplikacie.dc.html` — a **working single-phone prototype** with real navigation, the FAB action sheet, the photo→AI flow, and a weight-entry sheet (best for understanding flow/behavior).

### 1. Login (Prihlásenie)
- **Purpose:** authenticate.
- **Layout:** centered logo block (72px rounded-square mark with an accent ring + 3 macro-colored
  bars) → app name "FitDenník" (25/800) → subtitle "Tréningy a kalórie na jednom mieste".
- **Fields:** E-mail and Heslo, each a `#161618` rounded input (radius 14) with a leading stroke
  icon; password shows "Zobraziť" toggle in accent. "Zabudnuté heslo?" right-aligned, muted.
- **Primary button:** full-width, `#22C55E`, on-accent text, radius 16, "Prihlásiť sa".
- **Divider** "alebo", then two social buttons (Apple, Google) side by side on `#161618`.
- **Footer:** "Nemáš účet? **Zaregistruj sa**" (accent).

### 2. Home (Domov)
- **Purpose:** daily snapshot + quick add.
- **Header:** date (muted) + greeting "Dobré ráno" (23/800); avatar circle top-right (42px).
- **Calorie card** (`#141416`): left = **calorie ring** 112px (track `#1E1E20`, accent progress,
  rounded cap, rotated -90°) with center "1 358 / kcal zostáva"; right = three macro rows
  (Bielkoviny/Sacharidy/Tuky) each a label + `current / goal g` + thin progress bar in the macro color.
- **Quick actions:** "＋ Odfotiť jedlo" (accent, flex 1.4) + "Hľadať"/"Tréning" (chip).
- **Dnešné jedlá** list: meal rows (thumbnail, name + "n položiek", kcal). Empty meal shows a dashed
  "＋ Pridať jedlo" row.
- **Dnešný tréning** card: dumbbell tile + "Push deň · 6 cvikov · ~48 min" + chevron.

### 3. Diary (Denník jedál)
- **Purpose:** full day of food, grouped by meal.
- **Header:** ‹ day › switcher ("Dnes" / "28. júna 2026").
- **Summary card:** "922 / 2 000 kcal" + "1 078 zostáva" (accent) + 46% bar + macro legend (B/S/T dots).
- **Meal sections** (Raňajky 08:10, Obed 13:20, …): section header (name · time, right kcal), then
  item rows `name · grams` + kcal. Večera empty state = dashed box "Zatiaľ žiadne jedlo".

### 4. Add Food — Camera (Pridať jedlo / Foto)  ★ core flow step 1
- **Purpose:** photograph the meal.
- **Header:** ‹ "Pridať jedlo" ✕. Segmented control **Foto** (active) / Hľadať / Čiarový kód.
- **Viewfinder:** large `#0A0A0B` well (radius 28), photo drop area, 4 white corner brackets,
  a top pill "● AI rozpoznávanie zapnuté" (accent dot pulses), gradient vignette.
- **Camera controls:** gallery thumbnail (left) · 78px shutter button (white inner disk inside a
  ring) · flash icon (right). Helper line "✦ AI odhadne kalórie a živiny z fotky".
- Pressing the shutter → AI analyze step.

### 5. AI Analyzing (Analyzujem fotku)  ★ step 2 — loading state
- **Purpose:** show AI working.
- Photo with a dimming overlay + an **accent scan line** sweeping vertically (glow shadow),
  accent corner brackets, center spinner (54px, accent top arc, rotates).
- Title "Rozpoznávam jedlo · · ·" (animated dots) + subtitle.
- Indeterminate accent progress bar.
- **Recognised items list** populating one-by-one: ✓ in an accent circle for found items
  (Kuracie prsia, Ryža basmati, Brokolica) and a spinner + shimmer placeholder for the item still
  processing (Olivový olej).

### 6. Confirm Food (Skontroluj jedlo)  ★ step 3 — editable result
- **Purpose:** review/adjust AI estimate, then save.
- Photo banner (radius 22) with chips "✦ Rozpoznané AI" (violet) and "● 92 % istota" (accent).
- Dish title + "4 položky · obed · dnes 13:20" + edit pencil.
- **Macro card:** calorie ring 90–96px ("642 kcal") + three macro bars (B 52g / S 68g / T 14g).
- **Recognised items** with per-item portion stepper (− grams +) and kcal, color dot per item.
- **"Pridať do"** meal selector (Raňajky/Obed[active]/Večera/Snack chips).
- Primary "Pridať do denníka · 642 kcal" + secondary "Upraviť ručne".
- On save → returns to Diary with a success toast.

### 7. Workout (Tréning) — active session
- **Purpose:** log sets during a workout.
- **Header:** ‹ "Push deň" + live timer "● 48:12" (accent) + ⋯.
- **Stat tiles:** objem (kg) / série / cviky.
- **Exercise card** (Bench press): title + **"🏆 PR" badge** (amber on amber tint) + "4 série".
  Set table columns *Séria | Kg | Opak. | ✓*. Completed sets show accent ✓; the **PR set is
  highlighted** (amber tint row, 🏆, amber weight); the pending set has a `○` and accent-tinted row.
  Tapping the card → Exercise detail.
- Additional exercise cards (collapsed summaries). Buttons: dashed "＋ Pridať cvik", then primary
  "Ukončiť tréning" → Stats + toast.

### 8. Add Exercise (Pridanie cviku)
- **Purpose:** pick exercises into the workout.
- Search field; muscle-group filter pills (Všetko[active]/Hrudník/Chrbát/Nohy).
- "Vybrané (2)" section: selected rows with accent ✓ tile. "Všetky cviky": rows with a ＋ tile.
- Primary "Pridať 2 cviky".

### 9. Stats (Štatistiky)
- **Purpose:** trends.
- Range segmented control (Týždeň[active]/Mesiac/Rok).
- **Weight card:** "78,4 kg" + "▼ 1,2 kg" (accent) + a line chart (accent polyline, end dot) +
  weekday axis. (In the prototype this card is tappable → opens weight entry.)
- **Calories card:** 7 vertical bars (accent; one amber = over goal; Sunday a deeper accent).
- **Macros card:** stacked horizontal bar (blue/amber/violet) + percentage legend.
- (Prototype) **Osobné rekordy** entry card (amber) → PR list.

### 10. Workout List (Zoznam tréningov)
- **Purpose:** history, newest first.
- Header "Tréningy" + count + green ＋ (new). Stat tiles (this week / hours / streak 🔥).
- Grouped **"Tento týždeň" / "Minulý týždeň"** with a "Najnovšie ▾" sort hint.
- Rows: **date tile** (day + month), title (Push deň / Pull deň / Deň nôh), meta
  "relative-day · n cvikov · min · volume kg", chevron. Rows where a PR was set show a **"🏆 PR" badge**
  next to the title; today's row date tile is accent-tinted.

### 11. Personal Records (Osobné rekordy / PR)
- **Purpose:** best lift per exercise.
- **Highlight banner** (amber gradient): "🏆 3 nové rekordy / tento mesiac" + "+12 kg celkový pokrok".
- Muscle-group filter pills.
- Rows: exercise icon tile, name (+ "NOVÉ" tag if recent), muscle · date, and right-aligned
  **best kg** + delta ("▲ +5 kg" accent / "bez zmeny" muted). Tapping a row → Exercise detail.

### 12. Exercise Detail (Detail cviku · progres)
- **Purpose:** progression for one exercise.
- Header ‹ exercise name.
- **Stat tiles:** 🏆 PR (1RM) [amber] · Najlepší objem · Posledný · Záznamov.
- **Progress chart card:** "Progres váhy" + "+15 kg za 3 mes." (accent). Area+line chart (accent,
  gradient fill, gridlines), **latest point = amber dot (current PR)**, month axis. Metric toggle
  pills: Váha[active] / Objem / Odhad 1RM.
- **História záznamov:** list of workouts where the exercise appeared — date tile, workout name
  (PR badge on record day), set breakdown "80×5 · 70×8 · …", top weight.

### 13. Profile (Profil)
- **Purpose:** account & body data.
- Header "Profil" + settings gear. Avatar 96px with accent ring + camera-edit badge.
  Name "Denis Kováč" + "@denis.fit" (accent).
- **Stat tiles:** Výška 178 cm · Váha 78,4 kg · BMI 24,8.
- **Osobné údaje** card group: Meno, Používateľské meno, Výška, Váha (icon + label + value + chevron).
- **Cieľ** card: "Chudnutie · Cieľ 2 000 kcal · 130 g bielkovín".
- **Účet** card group: **Zmeniť heslo** (chevron), Notifikácie (toggle, ON=accent), **Odhlásiť sa** (danger).

---

## Interactions & Behavior

### Navigation
- Bottom tabs switch between Domov / Denník / Tréning / Štatistiky (instant, no transition required;
  reset scroll to top on tab change).
- ‹ back buttons and ✕ close buttons return to the previous screen / dismiss the flow.
- List rows with chevrons are tappable and push a detail screen.

### FAB → Add action sheet  (the key interaction)
Tapping the center "＋":
- Dims the screen (`rgba(0,0,0,0.55)` backdrop, fade-in ~200ms) and slides a sheet up from the
  bottom (`#161618`, top radius 28, ~260ms ease-out). The FAB rotates 45° while open.
- Sheet title "Čo chceš pridať?" + subtitle, then three large option rows:
  1. **Pridať tréning** (accent-tinted dumbbell icon) → opens/starts a workout.
  2. **Pridať jedlo** (blue-tinted camera icon) → opens the photo→AI flow (screen 4).
  3. **Zaznamenať váhu** (violet-tinted clock icon) → opens the weight-entry sheet.
- "Zrušiť" button + tapping the backdrop closes the sheet.

### Photo → AI flow
Shutter tap (screen 4) → analyzing state (screen 5, ~0.9–2s simulated) → confirm result (screen 6).
"Pridať do denníka" saves and returns to Diary with a success toast.

### Weight entry sheet
Bottom sheet: big current value (e.g. "78,4 kg"), − / ＋ steppers at **0.1 kg** increments, shows
previous record + delta. "Uložiť váhu" saves → toast "Váha uložená · <value> kg".

### Toasts
Accent pill near the bottom with a check icon; auto-dismiss ~2.2s (fade/slide in & out).

### Animations (durations / easing used)
- Action / weight sheet: slide-up `~260ms cubic-bezier(.2,.8,.2,1)`; backdrop fade `200ms`.
- FAB rotate: `transform .2s`.
- AI scan line: vertical sweep `~2.2s ease-in-out` infinite; spinner `~0.9s linear` infinite.
- Indeterminate progress bar, shimmer placeholder, blinking dots: ~1.2–1.4s loops.
- Pulsing "AI on" dot: ~1.6s ease-in-out.

### States to implement
- **Loading:** AI analyzing (spinner, scan, shimmer, indeterminate bar).
- **Empty:** dashed "Zatiaľ žiadne jedlo / Pridať" rows.
- **Success:** toasts after saving food / weight / finishing a workout.
- **Active/selected:** segmented chips & tabs tint to accent; selected meal/filter pill accent-tinted.
- **PR:** amber 🏆 badges on workout rows, exercise headers, the specific PR set, and detail dot.

---

## State Management
Suggested state (adapt to the framework):
- `activeTab` (home | diary | workout | stats) and a navigation stack for pushed detail screens.
- `addSheetOpen`, `weightSheetOpen` booleans; `weightDraft` number (0.1 step).
- `foodFlow` step (camera → analyzing → result), the captured photo, and an editable list of
  recognised items `{ name, grams, kcal, color }` with derived total kcal + macros.
- Diary model: meals per day `{ type, time, items[], kcal }`; daily totals vs goals.
- Workout model: session `{ name, timer, exercises[] }`, each exercise `{ name, sets[{kg,reps,done}], isPR }`.
- Records model: per-exercise best (1RM / top weight), history entries, deltas, "new this month" flags.
- Profile: name, username, height, weight, BMI (derived), goal, notification toggle.
- `theme` (optional): accent color, surface preset, font — only if you adopt the theming option.

Data fetching: the AI photo analysis is a backend/ML call (image in → items + kcal + macros out);
everything else is local CRUD that should sync to the user's account.

---

## Assets
- **Fonts:** Manrope via Google Fonts (default). Optional alternates: Space Grotesk, Plus Jakarta Sans.
- **Icons:** stroke icons in Lucide/Feather style (home, list, dumbbell, bar-chart, user, lock,
  mail, bell, clock, search, settings-gear, camera, chevrons). Use the codebase's existing icon set.
- **Meal photos / avatar:** user-supplied (camera/gallery). Mockups use placeholder swatches; no
  proprietary imagery is shipped. The 🏆 trophy is an emoji.
- **Logo:** simple mark (ring + 3 macro bars) drawn inline — re-create or replace with the brand's real logo.
- No licensed third-party assets are included.

## Files
In this bundle:
- `Pridat jedlo fotkou - AI.dc.html` — all 13 screens on one canvas (measurement reference; also
  demonstrates the optional accent/surface/font theming).
- `Prototyp aplikacie.dc.html` — interactive prototype (navigation, FAB action sheet, photo→AI flow,
  weight sheet, toasts).
- `image-slot.js`, `support.js` — runtime helpers the HTML prototypes need to open in a browser.
  **Not part of the app** — ignore for implementation.

> To view a prototype: open the `.dc.html` file in a browser. The single-phone prototype is the best
> way to feel the interactions before building.
