# HarmonYouth Foundation Website — Guide & Handoff Notes

The redesign, built for real. Everything about how the site works and how to update it yourself.

**Repo:** github.com/Wu-Adam1234/HarmonYouth-Foundation
**Contact on site:** harmonyouthfoundation@gmail.com · (403) 926-6122 · Instagram @harmonyouthfoundation
**Slogan:** "We play music. We build devices. We show up for people." — in the footer of every page.

> **⚠ SECTION 9 IS DONE IN THE CODE — the remaining work is offline (9.4).** A legal audit in
> September 2026 found 17 issues. The privacy policy closes all of them, and **the section 9.2 form
> changes shipped on September 4, 2026** — the age question, the CASL consent checkbox and the
> minimum-age notice are live on all three forms, so the policy is accurate. What is still outstanding
> is **9.4: the paperwork** (photo consent form, Consent Records folder, guardian confirmation replies).

**Where the files are on this Mac**
- Working folder: `~/Documents/HarmonYouth FOundatioin Website Master/harmonyouth-website unzipped ver/`
  — **edit here.** (Yes, "FOundatioin" is misspelled in the real folder name. Earlier versions of this
  guide said `~/Documents/harmonyouth-website/`; that path does not exist.)
- Master documents, one level up in `~/Documents/HarmonYouth FOundatioin Website Master/`:
  `HarmonYouth Foundation — Master Final Privacy Policy.docx` (the source of truth for `privacy.html`)
  and `HarmonYouth Foundation Website Guide.pdf` (an export of this file)
- Zipped copy: `~/Documents/HarmonYouth FOundatioin Website Master/Harmonyouth Website.zip` — 34MB,
  for backup or sharing. **Stale as of September 4, 2026** — re-zip before you rely on it.

The zip is a snapshot, not the working copy. If you edit the folder, re-zip it (right-click the
folder → Compress) or the zip goes stale. **You cannot upload the zip to GitHub and have it
unpack** — GitHub stores it as a single file. To publish, upload the *contents* of the folder.
The zip is for keeping a backup and for emailing the whole site to someone.

---

## 0. What this is

This is **path 2 from section 13 of the old guide: the full rebuild.** The Claude Design mockups (`.dc.html` files) were prototypes that only ran inside that tool's runtime. This is the same design rebuilt as plain HTML, CSS and JavaScript that runs anywhere — no frameworks, no build step, no npm. You can edit any file in a text editor, re-upload it, and it works.

**It also fills the five gaps the mockups left open**, using the content from the old live site:

| Gap in the mockups | How it's covered now |
|---|---|
| No Team page | `team.html` — Adam, Hanry and Arthur's full bios, plus Vienna Lu on marketing and outreach |
| No Build meets page | `build-meets.html` — schedule with List/Calendar toggle, what to expect |
| Forms were `mailto:` links | Three real Formspree forms on `get-involved.html`, with the parent-email confirmation check and the full-panel confirmation screens |
| No calendar views | Both `performances.html` and `build-meets.html` have the List/Calendar toggle back |
| No WeChat / offline donation route | WeChat and GoFundMe QR codes on both `donate.html` and `get-involved.html` |

---

## 1. The pages

| Page | File | What's on it |
|------|------|--------------|
| Home | `index.html` | Scroll-driven hero, stat strip, "How a show runs" 01/02/03, Programs accordion, piano spotlight illustration, next/last shows, three photo carousels, FAQ accordion, donate block |
| Mission | `mission.html` | Why the org exists, three principles, the three founders in brief, "what we measure" stats |
| Programs | `programs.html` | Program 01 (music) and Program 02 (Build) in full, the 00:00→00:35 set timeline, practical-questions accordion |
| Performances | `performances.html` | Every upcoming show as a detail card (seven as of Sept 4 2026), full schedule with List/Calendar toggle, every show played, the five venues, booking panel |
| Photos | `photos.html` | Eleven card carousels — every past performance — with a full-screen lightbox |
| Build meets | `build-meets.html` | Upcoming meets (list + calendar), how a build meeting runs |
| Meet the team | `team.html` | Four `.founder` sections — Adam, Hanry, Arthur, then Vienna Lu (Marketing and Outreach Lead), all with photo and full bio |
| Get involved | `get-involved.html` | Three jump cards, the three Formspree forms (each with the under-18 question and the CASL consent checkbox), volunteer hours + service letter panels, FAQ, QR codes |
| Donate | `donate.html` | Where the money goes, the 100% callout, GoFundMe widget, QR codes, other ways to help |
| Privacy policy | `privacy.html` | The master policy in full — summary, **seventeen** numbered sections with sub-sections and five tables, contact block, site-owner checklist. Rewritten Sept 4 2026 from the master .docx (section 9) |
| 404 | `404.html` | Piano-themed not-found page with a working search and a playable octave |

Shared by all of them: `styles.css`, `site.js`, `harmonyouth-logo.png`, and the photos.

**Every page has the same header** (logo, light/dark switch, Menu button) and the same footer. The Menu dropdown is the only navigation — there is no nav bar.

---

## 2. How to update the live site

1. Go to the repo on GitHub
2. Click **Add file → Upload files**
3. Drag in the changed files (or all of them — overwriting is fine)
4. Scroll down, click **Commit changes**
5. Wait ~1 minute, then **hard-refresh** the live page (Cmd+Shift+R / Ctrl+Shift+R)

**On the first upload of this rebuild**, also delete the old site's leftover files from the repo,
or they will sit there unreachable: `script.js`, the old `styles.css` is overwritten but
`making.html` (if still present) and the `assets/` folder holding `piano-film.mp4` /
`piano-film.webm` are no longer used by any page. The redesign has no scroll-scrubbed film
section — the hero replaced it.

> **If a change doesn't appear, it's almost always the browser cache, not a broken upload.**
> `styles.css` and `site.js` are linked as `styles.css?v=3` and `site.js?v=3` in every page — bumped from `?v=2` on September 4, 2026 when the form controls and policy-table CSS landed. If you change either file and people still see the old version, bump that number again (`?v=4`) everywhere with a find-and-replace across the `.html` files. That forces every browser to re-download it.

---

## 3. Common edits

### Add or change a performance

**Three places, and they must agree.** The guide used to say two; the detail cards at the top of
`performances.html` are the third, and forgetting them is how Sep 25 / Oct 4 / Oct 11 ended up saying
*Recruiting* on the card and *In talks* in the row below. Check all three every time.

**1. The list row** in `performances.html`, inside `<div class="panel" data-view="list">`:

```html
<div class="show-row">
  <div class="show-date">Sep 12</div>
  <div class="show-venue">
    <span class="name"><a href="MAPS_LINK" target="_blank" rel="noopener" class="venue-link">Venue Name</a></span>
    <span class="sub">2:00 to 2:30 PM</span>
  </div>
  <div class="show-status">Recruiting</div>
</div>
```

Keep rows in date order. Status options — this is the class on the last div plus its text:
- `<div class="show-status">Recruiting</div>` — default
- `<div class="show-status full">Full</div>` — greyed out
- `<div class="show-status talks">In talks</div>` — lighter gold
- `<div class="show-status past">Played</div>`

**2. The detail card**, higher up the same file, inside `<div class="detail-grid">`. Keep the status
pill here identical to the list row's:

```html
<article class="detail" data-reveal>
  <div class="detail-top"><span class="card-tag">Oct 18</span><span class="show-status">Recruiting</span></div>
  <h3><a href="MAPS_LINK" target="_blank" rel="noopener" class="venue-link">Venue Name</a></h3>
  <dl>
    <dt>Date</dt><dd>Sunday, October 18</dd>
    <dt>Time</dt><dd>11:00 &ndash; 11:30 AM</dd>
    <dt>Where</dt><dd>University District, NW</dd>
    <dt>Spots</dt><dd>Open</dd>
  </dl>
  <div class="note">One optional sentence of context.</div>
</article>
```

**Check the weekday against a real calendar before you type it.** The `<dd>` weekday is the one piece
of data that isn't repeated anywhere else, so nothing catches it when it's wrong — five of them were
off by a day until September 4, 2026. For reference: in 2026, Sep 6, Sep 13, Oct 4, Oct 11, Oct 18 and
Nov 8 are **Sundays**, and Sep 25 is a **Friday**.

**3. The calendar entry** in `site.js`. Search for `SCHEDULE DATA` near the top:

```javascript
'2026-09-12': [['SG', 'recruiting', '2:00 to 2:30 PM']],
```

Format is `'YYYY-MM-DD': [['VENUE_CODE', 'status', 'time']]`. Two shows on one day go in the same array. Venue codes come from the `venues` object just above — add a new venue there first or the chip renders blank. Valid statuses: `recruiting`, `full`, `talks`, `past`, `cancelled`.

The third element is the hover tooltip's time line. It can be long — the Nov 8 entry reads
`'11:30 AM to 12:00 PM, or 12:00 to 12:30 PM'` — because `.cal-tip` is capped at 280px and wraps.

**4. And the menu tag.** The Performances row in the Menu dropdown carries
`<span class="nl-tag">7 NEXT</span>`, hard-coded **in all 11 `.html` files**. It counts the upcoming
shows. Find-and-replace it whenever the count changes, or the menu quietly lies.

**Months are 0-indexed**, so `m: 7` is August, `m: 9` is October and `m: 10` is November (`max` is currently `{ y: 2026, m: 10 }`). `min` and `max` are how far back and forward people can page; `start` is the month it opens on. **If you add a show past `max`, bump `max` or nobody can page to it.**

### Move a show from upcoming to past

1. Move its row down into the "Every show so far" panel in `performances.html`, and change the status cell to a Photos link
2. Change its calendar status in `site.js` to `'past'`
3. Add a gallery on `photos.html` (below)

### Add a photo gallery

1. **Resize the photos first** — phone photos are 5–10MB each and will make the page painfully slow. Aim for ~1600px wide, JPG, quality ~80.
2. Name them consistently: `venue-date-1.jpg`, `venue-date-2.jpg` (e.g. `scenicgrande-sep6-1.jpg`)
3. Upload them to the repo
4. In `photos.html`, copy an existing `<div class="carousel-block">` and swap the filenames

Each card looks like this:

```html
<button type="button" class="car-card" data-card
        data-cat="Venue · Sep 6" data-title="Short caption"
        data-body="The longer caption shown in the lightbox.">
  <img data-src="scenicgrande-sep6-1.jpg" alt="Description of the photo">
</button>
```

**Use `data-src`, not `src`.** That's what makes photos load lazily — `site.js` only downloads them when the carousel scrolls near the viewport, which is what keeps the page fast with ten galleries on it. `data-title` and `data-body` are what the lightbox shows when someone taps the card.

**Cards themselves carry no visible caption or dark veil anymore** — as of the September 2026 pass, every card is just the clean photo (see "Build decisions worth knowing," section 8). Still fill in `data-cat`, `data-title` and `data-body` on every card — they're what the full-screen lightbox shows when someone taps it, they just don't render on the card face itself.

Give the carousel block an `id` (e.g. `id="the-scenic-grande-sep-6"`) so `performances.html` can link straight to it.

Newest gallery goes at the top.

### Add or change a build meet

Same two places, in `build-meets.html` (the list row) and `site.js` → `BUILD_MEET_CALENDAR`. The default status text there is **Spots open** rather than Recruiting — that wording comes from the `labels` object on that calendar.

**Both Prev and Next are greyed out right now** because `min` and `max` are both September 2026 — one meet, one month. That's intentional, not broken. Add an October meet and bump `max` to `{ y: 2026, m: 9 }`.

**Two spots still say "Location to be confirmed"**: the `.sub` line in the list row, and the `BM` entry in `BUILD_MEET_CALENDAR.venues`. Both need updating when you have an address.

### Change the volunteer hour wording

The claim appears in **seven** places and they have to stay consistent. Two things must match everywhere: **four hours** is a total across both programs, not four hours of performing, and **service letters are available on request**.

| Where | File |
|-------|------|
| Menu dropdown (on all 11 pages) | the `menu-note` block in every `.html` file |
| Homepage stat strip | `index.html` → "Hours per certificate" |
| Homepage FAQ answer 03 | `index.html` |
| Performer form badge | `get-involved.html` → `.perk` in `#perform` |
| Maker form badge | `get-involved.html` → `.perk` in `#build` |
| Volunteer hours panel | `get-involved.html` |
| Under the schedule | `performances.html` and `build-meets.html` |

If you change the number or the rule, change all of them.

### Change a team bio or photo

Bios live in `team.html`, one `<section class="founder">` each — four of them now: Adam, Hanry,
Arthur, Vienna. The `<h3>` is an editorial line, not the person's name; the name goes in
`.founder-sig` at the bottom of the block.

**Crop before you upload.** The photo box is portrait, **0.63 wide-to-tall**. `object-fit: cover` fills
the box and trims the rest, so a landscape photo gets chopped hard on both sides.

*The reliable way, if you have a full-body or badly-framed source:* crop to 0.63 **yourself** first, to a
head-and-upper-body framing, then downscale. `vienna-marketing.jpg` was made from a 1080×1440 full-body
photo this way — crop `(292, 300)–(764, 1050)` in the source, resize to 660×1048, JPEG quality 82. It
lands at 145KB and needs no `object-position` at all, because the file's aspect ratio already matches
the box. Anything from ~660px wide up is plenty: the box renders at 268 CSS px.

*The quick way, if the source is already a portrait:* export around 880px wide at quality 85 (~200KB),
and if the face sits off-centre nudge it with `style="object-position:center 20%;"` on the `<img>`
rather than re-cropping. Adam's uses `center 62%`, Hanry's `62% 8%`, Arthur's `center 30%`.

**Use `data-src`, not `src`,** on the `<img>` — the team photos lazy-load like the galleries do.

`hanry-cofounder.jpg` is still 2MB, far larger than it needs to be. Worth redoing.

**Photos of members under 18 need a signed release** before they go up, same as resident photos.
This applied to Vienna's photo and it applies to the next one.

**Two CSS classes are now unused** but left in `styles.css` in case they're wanted again:
`.founder-photo.empty` (the "Photo to come" placeholder) and `.bio-pending` (the italic "Bio to come"
line). `.recruit` — the gold-bordered highlight card that used to sit above the founders — is also
unused: it was removed from `team.html` on September 4, 2026 once Vienna's full bio made it duplicate
the section directly below it.

### Add a page to the menu

The menu block is **repeated in all 11 files** — that's the cost of having no build step. Add your `<a class="navlink">` row to each one, and add the page to `ROUTES` at the top of `site.js` so the search can find it.

The same "repeated in all 11 files" trap applies to three other things, so keep a find-and-replace
handy: the `?v=` cache-buster on `styles.css` / `site.js`, the `nl-tag` show count (`7 NEXT`), and the
`menu-note` volunteer-hours wording.

---

## 4. How the forms work

All three forms on Get Involved submit to **Formspree** (free tier) → harmonyouthfoundation@gmail.com.

- Form ID: `xnjkdgge` — set once, as `FORM_ID` near the bottom of `site.js`
- Each form has its own hidden `_subject` field, so the email subject tells you which panel it came from
- Submissions also appear in the Formspree dashboard (formspree.io, log in with the org Gmail)
- Free tier has a monthly submission limit

**All three forms** collect, in addition to their own fields: an **under-18 answer** (`under_18`,
required), a **parent/guardian email + confirmation** pair, and an optional **CASL reminder-consent
checkbox** (`email_reminders_consent`).

**Performer form (`#volunteerForm`)** — name, instrument, area, performer email, dates, phone.
**Maker form (`#makerForm`)** — name, email, phone, free-text details.
**Everything-else form (`#helpForm`)** — name, email, message.

The guardian pair is **not** hard-`required` on any of them. It carries `data-guardian-required`, and
`initMinorGate()` turns `required` on only when the under-18 answer is Yes. That is what keeps
`#helpForm` usable for care home staff, media and partners — adults answer No and never see the
guardian fields enforced — while closing the hole for the minors who used to skip them.

**Every field on every form is listed in privacy policy §02**, one table per form (§2.1 performer,
§2.2 build, §2.3 general inquiry). They match exactly today. See section 9.5.

**The parent-email confirmation check is generic.** Any input with `data-confirm-for="<id of the first email field>"` is checked automatically, and the error appears in the `.fs-error` span next to it. Leaving both blank passes, which is what makes the optional version work. A fourth form needs nothing but that one attribute.

**The confirmation screen** replaces the whole form in place — no page reload. The wording lives in `SUCCESS_CONTENT` in `site.js`, keyed by form ID. `SHOWS_LINK` and `IG_LINK` are defined once just above it and reused in all three messages, so changing the Instagram handle is a one-line edit. If you add a form and skip its `SUCCESS_CONTENT` entry, it falls back to a plain "Sent!".

If a submission fails, the form stays put and shows a line telling the person to email instead — nothing is silently lost.

**The age gate and the consent record, in one place.** `initMinorGate(form)` in `site.js` reads the
`under_18` radios and flips `required` on every `[data-guardian-required]` field in that form; it runs
once on load and on every change. Separately, the submit handler **stamps the consent checkbox
explicitly** — an un-ticked checkbox sends nothing at all in a `FormData`, so without this "they
declined" and "the field doesn't exist" would look identical at Formspree. Every submission now carries
either `YES — consented <ISO timestamp>` or `No — did not opt in`. That line is your CASL record;
copy it into the opt-in spreadsheet (9.4-E). Section 9.2 has the full markup and the reasoning.

**Every field you add to a form has to be added to the privacy policy the same day, before the form
goes live.** That is not a style preference — it is a written commitment in policy §2.5 and §17, and
§14 puts it on the Privacy Officer by name. The gap between what a form collects and what the policy
discloses is exactly what Alberta PIPA is built to catch. See section 9.5.

---

## 5. Design notes

All colours are defined once at the top of `styles.css`, in two blocks: `:root` (dark) and `[data-hy-theme="light"]`.

```css
--bg:#07080A;        /* page background */
--accent:#C9A15A;    /* gold — buttons, links, highlights */
--accent-soft:#E8C87A;
--text:#F4F6F8;
--muted:rgba(244,246,248,.60);
--faint:rgba(244,246,248,.52);
```

**If you change these, check the contrast.** The light-mode gold is `#8A6520` rather than the
brighter `#A97C2B` from the mockups, because the brighter one only reached 3.4:1 against the
page and 3.8:1 behind white button text — both below the 4.5:1 WCAG AA minimum. Every
text/background pairing in both themes currently clears 4.5:1. A lighter gold will fail again.

The hero is a special case: its photo carries a dark scrim in *both* themes, so the hero's own
text and the header sitting over it are pinned to light (`#FBFAF7`) regardless of colour mode.
That's the `.hero :focus-visible` / `.site-header.over-hero` block in `styles.css`, plus the
`over-hero` class that `site.js` toggles on scroll. Without it, light mode put near-black text
on the dark photo at 2.5:1.

The look is **liquid glass**: every button, arrow and toggle is a transparent pill with an inset light-ring shadow stack (`--glass`) plus an SVG displacement filter (`#hy-glass`, defined at the top of each page's body). Fonts are **Inter** for headlines and UI, **Open Sans** for body text.

**Light/dark** is toggled from the header and saved in the browser under `hy-theme`. It applies to every page.

**Long-form policy prose** (added September 4, 2026, for the full privacy policy). `.prose` only
styled `h3` and `p` before; it now also carries sub-headings, lists and tables:

- `.prose h4` — the `2.1` / `8.3` sub-section headings, Inter, uppercase-ish weight
- `.prose ul` / `.prose ol` — gold `::marker`, same 16px/1.78 rhythm as `.prose p`
- `.prose .tbl` — a rounded, bordered **scroll container**; `.prose table` inside it has
  `min-width:540px` (440px under 620px wide). This is the important bit: the table scrolls *inside its
  own box* instead of pushing the page sideways, which is why the policy has no horizontal overflow on
  a phone. `.prose{min-width:0}` is what lets that work inside the `.numbered .row` grid — **don't
  remove it** or the grid column refuses to shrink and the whole page overflows.
- `@media(max-width:620px)` collapses `.numbered .row` from `56px 1fr` to a single column, so the
  section number sits above the text and the prose gets the full width.

**`.cal-tip` is capped** at `min(280px, 100vw - 24px)`. It had no max-width, so a long time string —
like Nov 8's two candidate slots — would have made a tooltip wide enough to run off the screen edge,
since it's positioned at `clientX + 14`.

**Interactive pieces, in case you wonder what's moving:**
- **Hero** — pinned to the top of a 260vh section; scrolling through it expands the photo from a card to full-bleed while the headline splits apart. This is real scrolling; nothing is hijacked, and it degrades to a static hero with "reduce motion" on.
- **Menu dropdown** — Escape or a click outside closes it; the two bars morph into an X
- **Search** — in the dropdown on every page and in the middle of the 404. The placeholder rotates every 3.4s. Typing a word matches it against `ROUTES` and navigates.
- **Fluid cursor** — a soft warm trail; off automatically on touch devices and with reduce-motion
- **Carousels** — snapping horizontal rows; photos blur up as they load; arrows disable at each end
- **Lightbox** — click any card for the photo, category, headline and caption
- **Piano spotlight** — the "Built to keep coming back" CTA band on the homepage. A black-and-white outline of a grand piano (`piano-outline.jpg`) sits under a full-colour version (`piano-color.jpg`); the colour layer is CSS-masked to a circle that follows the cursor, so hovering "lights up" the piano in colour wherever you point. Wired in `initPianoSpotlight()` in `site.js`. Replaces the old "MUSIC FOR EVERYONE" outlined-text headline.
- **Accordions** — one row open at a time
- **Scroll progress bar** — two-pixel gold bar at the very top
- **Dot rail** — right edge of the homepage, highlights the section you're in
- **404 piano** — seven keys, one missing. Click them or press A S D F G H J.

Everything above is disabled or simplified when the visitor has **"reduce motion"** turned on.

---

## 6. Things to keep on top of

- **Check the Formspree inbox.** The confirmation screen promises people they're on the roster. If nobody's watching that inbox, that promise breaks.
- **Get photo consent before posting anyone.** For residents, a staff member or family member typically needs to sign. Care facilities are strict about resident privacy for good reason.
- **Update statuses after each show.** A page full of "Recruiting" for dates that already passed looks abandoned. Remember it's **three** places per show plus the menu tag — see section 3.
- **Keep the three forms and privacy policy §02 in lockstep.** This is the one item on this list that
  is a written legal commitment rather than good housekeeping. Section 9.5.
- **Compress photos before uploading.** The site is ~31MB, almost all photos. Galleries load lazily so the cost lands on people who scroll to them, but it still adds up.
- **Fill in the build meet location.** Two spots still say "Location to be confirmed."
- **Answer every under-18 sign-up with a guardian confirmation email, by hand, before adding the
  student to the roster.** The policy says you do this. There is no server to do it for you — see 9.4-C.
- **File every signed photo consent form and every guardian confirmation** in the `Consent Records`
  Drive folder, and keep them five years (9.4-A, 9.4-B).
- **Copy each `email_reminders_consent` line into the opt-in spreadsheet** — email, date, form. That
  spreadsheet is your CASL defence (9.4-E).
- **Review the Consent Records folder every January** and delete anything older than five years.
- **Re-zip the folder and re-export this guide's PDF after a batch of edits.** Both copies in the
  master folder go stale silently, and the PDF is the one people actually get emailed.

---

## 7. Things to confirm before this goes public

These came across from the mockups and are stated as fact on the site:

- [ ] **The donation claim.** "100% to the hospitals and senior homes we support, HarmonYouth takes none" appears on the homepage, `donate.html`, and twice on `mission.html`. No hospital is named by name anywhere on the site — that was deliberate; keep it that way unless you have permission to name one. **If the arrangement is ever anything other than 100%, all four places have to change together.**
- [x] **The privacy policy** was rewritten on September 4, 2026 from *HarmonYouth Foundation — Master Final Privacy Policy.docx* — `privacy.html` now carries that document in full (17 sections plus the summary, contact block and site-owner checklist), so the two are aligned by construction. See section 9. **It is still not lawyer-reviewed**: the audit recommends a legal professional look at the photo consent form (9.4-A) and the parental confirmation flow (9.4-C) before they go live, and the master document's own checklist repeats that.
- [x] **The section 9.2 form changes shipped (September 4, 2026).** The age question, the minimum-age `.perk` line and the CASL reminder-consent checkbox are on all three forms; the guardian pairs use `data-guardian-required` and `initMinorGate()` turns them on only for under-18s. Verified: Yes + blank guardian is blocked, No submits, and `email_reminders_consent` arrives either way.
- [ ] **Build the offline half** — the written photo consent form, the `Consent Records` folder, and the by-hand guardian confirmation reply (section 9.4). These are the HIGH-severity items; the HTML is the easy part.
- [ ] **September, October and November dates.** Sep 6, Sep 13, Sep 25, Oct 4, Oct 11, **Oct 18 and Nov 8** are hardcoded in three places each — detail card, list row, `site.js` calendar — plus the `7 NEXT` menu tag. They go stale on their own. Section 3.
- [ ] **Three detail cards disagree with their own list rows.** Sep 25, Oct 4 and Oct 11 show *Recruiting* on the `.detail` card at the top of `performances.html`, but *In talks* in the list row and in `PERFORMANCE_CALENDAR`. Two of the three sources agree, so the cards are probably the stale ones — but confirm the real booking status before changing either.
- [ ] **Weekday labels were corrected on September 4, 2026.** The five `<dd>` weekday labels on `performances.html` named the wrong day (Sep 6 and Sep 13 said Saturday, Sep 25 said Thursday). They now match the dates: Sep 6, 13, Oct 4, 11, 18 and Nov 8 are all **Sundays**, Sep 25 is a **Friday**. If the intent was the weekday and not the date, the dates in all three places have to move instead.
- [ ] **Verify the Google Maps links.** Several are still map *searches* rather than pinned locations (`google.com/maps/search/?api=1&query=…` for The Scenic Grande and The Manor Village) — click each once to confirm it lands on the right building. **Cambridge Manor and Boardwalk are confirmed**: the new Oct 18 / Nov 8 links and the older ones on the page resolve to identical place IDs.
- [ ] **The Build program has no photo yet.** `programs.html` has a labelled placeholder where one goes after the first build meet.
- [x] **Vienna Lu's photo and bio are in (September 4, 2026).** `vienna-marketing.jpg` is a 660×1048 crop (0.63) at ~145KB, and her four-paragraph bio replaced the placeholder. The duplicate `.recruit` highlight card above the founders was removed — her full `.founder` section now covers the same ground.
- [ ] **Get Vienna's signed photo release on file before this goes up.** She is a student and appears to be under 18; the rule in section 3 ("photos of members under 18 need a signed release") applies to team photos exactly as it does to resident photos. The file is in the folder and on the page — hold the upload if the release isn't signed.

---

## 8. Build decisions worth knowing

Things that were changed deliberately during the rebuild. If something looks "wrong" compared to
the mockups, check here first — it was probably on purpose.

**The hero does not lock your scroll.** The mockup pinned the page with `body{overflow:hidden}`
while the hero photo expanded. That doesn't actually stop the page scrolling (the scroll container
is the `<html>` element, not `<body>`), and it trapped keyboard and screen-reader users with no way
out. The hero is now a 260vh section with the photo `position:sticky` inside it — it expands as you
scroll through, looks the same, and it is ordinary scrolling the whole way. It collapses to a
static hero when "reduce motion" is on.

**The logo is 256px, not 1254px.** The original was a 740KB PNG rendering at 36×28 pixels, loaded
on all 11 pages — about a quarter of the photos page's initial weight for a thumbnail. It is now
48KB. If you ever replace it, export it around 256px; do not drop a full-resolution export in.

**Contrast was corrected against the mockup palette.** See section 5. Short version: the light-mode
gold is darker than the mockups', the muted/faint greys are stronger in both themes, and the hero
foreground is pinned light. Every text pairing now clears the 4.5:1 WCAG AA minimum.

**Keyboard focus is explicit.** The glass pills are translucent, which swallowed the browser's
default focus ring — tabbing through the forms showed nothing at all. There is now a gold
`:focus-visible` outline. Don't remove it.

**Gallery photos load lazily.** Photos carry `data-src`, not `src`; `site.js` swaps them in when
the gallery nears the viewport. On the Photos page that means 5 images load on arrival instead of
104. Keep using `data-src` when you add galleries.

**September 1, 2026 pass — piano spotlight, caption removal, thinner cursor trail.** Three changes
made after the initial rebuild:
- The homepage CTA band's "MUSIC FOR EVERYONE" outlined-text headline was replaced with the piano
  spotlight illustration described in section 5. The old SVG text/mask markup, its `.hovertext`/
  `.ht-base` CSS and the `hyDash` keyframe are gone; `initHoverText()` in `site.js` was replaced by
  `initPianoSpotlight()`.
- Every gallery card's on-card caption (`.cap`) and the dark bottom veil (`.veil`) that existed to
  keep that caption legible were removed, on both `index.html`'s and `photos.html`'s carousels —
  cards now show only the clean photo. The full-screen lightbox is untouched and still reads
  `data-cat` / `data-title` / `data-body` from the card, so keep filling those in when you add a
  gallery (section 3).
- The fluid cursor trail (`initCursor()` in `site.js`) was retuned smaller and softer — it had
  drifted thick and blobby. If a future edit makes it feel heavy again, the knobs are the particle
  radius (`r: 16 + Math.min(20, d * 0.55)`), the per-frame opacity (`0.13`), and the fade-out rate
  of the trail (`rgba(0,0,0,0.13)` in the clear step) — smaller radius and lower opacity read as
  thinner and lighter.

**September 4, 2026 pass — the master policy, the legal form controls, two shows, Vienna.** What
landed, and the reasoning where it isn't obvious:

- **`privacy.html` now carries the master `.docx` in full**, not a plain-language summary of it. That
  was a deliberate reversal: the two documents used to be *shorter HTML / fuller PDF*, which meant
  every edit had to be made twice and judged for equivalence. Now the HTML is a faithful render of the
  master — same 17 sections, same tables, same wording — so "keep them in step" is a copy job, not a
  translation job. The site-owner implementation checklist is on the public page too, clearly labelled
  as operational guidance, because the master document ends with it. **If you'd rather that checklist
  stayed internal, deleting the last `.panel` block is all it takes** — nothing else references it.
- **The section 9.2 form controls shipped in the same edit**, which was the whole point of the
  warning at the top of section 9: the policy asserts the age question and the consent checkbox exist,
  so publishing the policy without them would have made it a false statement.
- **The guardian fields lost their hard `required`.** They now carry `data-guardian-required` and are
  switched on by `initMinorGate()`. Losing `required` looks like a regression in a diff — it isn't;
  read section 4.
- **Consent is stamped explicitly on submit** rather than left to the browser. An un-ticked checkbox
  sends nothing in a `FormData`, and "declined" reading the same as "field doesn't exist" is useless
  as a CASL record.
- **Weekday labels were corrected** on five detail cards — they were off by a day. See section 3, and
  the open item in section 7 about whether the date or the weekday was the typo.
- **The `.recruit` card came off `team.html`** once Vienna had a real bio, because it duplicated it.
- **The two new Maps links resolve to the same place IDs** as the ones already on the site
  (Cambridge Manor `0x53716f5974b7759b`, Boardwalk `0x53716f0d9086de05`), so the older rows were left
  alone rather than churned. If you ever need to check whether two `maps.app.goo.gl` short links point
  at the same building, follow the redirect and compare the `!1s0x…` id — the visible URL differs even
  when the destination doesn't.

**Source archives.** This site was built from three archives — the old live site, the Claude Design
mockup handoff, and a Google Drive export of the August 30 photos. Everything from all three that
the site uses is already in this folder, so they were cleared out afterwards. Two things existed
only in those archives and are *not* here: the old homepage's `piano-film.mp4` / `.webm` (the
redesign has no film section), and the original full-resolution August 30 photos (this folder has
them resized to 1600px, which is what the site should serve anyway). If you ever need either, they
are in the Trash or can be re-exported from Google Drive.

---

## 9. Legal audit fixes (September 2–4, 2026) — what changed, and what you still have to build

A three-pass legal review (**HarmonYouth Foundation — Legal Vulnerability Audit.pdf** — no longer in
the master folder; ask Adam for a copy if you need the original findings) found **17 issues**: 6 HIGH, 8 MEDIUM, 3 LOW-MEDIUM, across Alberta PIPA, CASL, tort law and
child-protection. The privacy policy has been rewritten to close all 17.

> **⚠ READ THIS BEFORE YOU PUBLISH ANYTHING.**
> The new policy describes things the website does not do yet — an age question, a reminder-consent
> checkbox, a stated minimum age. Every one of them is spelled out in **9.2** with the exact markup to
> paste. **Ship 9.2 in the same upload as the new `privacy.html`, or the policy becomes a false
> statement**, which is worse than the gap it was written to fix. That is the whole point of issue 2.3
> in the audit: do not promise what the site does not do.

**Decisions already made and written into the policy — do not contradict them anywhere on the site:**

| Decision | Value |
|---|---|
| Privacy Officer | **Adam Wu** — harmonyouthfoundation@gmail.com · (403) 926-6122 |
| Minimum participation age | **6 years old**, and anyone under 18 needs guardian consent |
| "General area" field on the performer form | **Kept**, and now disclosed in the policy |
| Governing law | Alberta + the federal laws of Canada |

### 9.1 Status of all 17 issues

`POLICY` = already fixed, nothing more to do. `SITE` = you must change the website (section 9.2 / 9.3).
`OFFLINE` = paperwork or process, no code (section 9.4).

| # | Issue | Severity | Status |
|---|---|---|---|
| 1.1 | Phone number omitted from policy | HIGH | `POLICY` header + §12.8, §14 |
| 1.2 | No named Privacy Officer | HIGH | `POLICY` §14 — Adam Wu |
| 1.3 | No breach notification procedure | HIGH | `POLICY` §11 — 72-hour commitment |
| 1.4 | CASL — no express email consent | HIGH | `POLICY` §07 + `SITE` 9.2-B, 9.2-E **done** + `OFFLINE` 9.4-E |
| 1.5 | Cross-border transfer not disclosed | MED-HIGH | `POLICY` §08 |
| 1.6 | Formspree retention gap | MEDIUM | `POLICY` §08.1, §10 + `OFFLINE` 9.4-D |
| 2.1 | Photo consent verbal only | HIGH | `POLICY` §04 + **`OFFLINE` 9.4-A** |
| 2.2 | Parental consent not verified | HIGH | `POLICY` §05 + **`OFFLINE` 9.4-C** |
| 2.3 | GoFundMe donor data misrepresented | MED-HIGH | `POLICY` §08.2 |
| 2.4 | No limitation of liability | MEDIUM | `POLICY` §15 |
| 2.5 | Certificate full-name use not disclosed | MEDIUM | `POLICY` §03.1 |
| 3.1 | No minimum age / no age verification | HIGH | `POLICY` §05 + `SITE` 9.2-A, 9.2-C **done** |
| 3.2 | Location data not disclosed | MEDIUM | `POLICY` §02.1 |
| 3.3 | No retention policy for consent records | MEDIUM | `POLICY` §10 + `OFFLINE` 9.4-B |
| 3.4 | Withdrawal process undefined | MEDIUM | `POLICY` §06 — with 24h / 48h / 7d / 14d timelines |
| 3.5 | No governing law clause | MEDIUM | `POLICY` §16 |
| 3.6 | Google Fonts IP collection | LOW-MED | `POLICY` §08.3, §09.2 — disclosed. `SITE` 9.3 removes it entirely |

**What already changed in the repo:**

- `privacy.html` — rewritten again on **September 4, 2026** from *HarmonYouth Foundation — Master Final
  Privacy Policy.docx*. It now carries the master policy in full: the policy summary, **17 numbered
  sections** (was 15) with all their sub-sections and the five field/service/retention tables, the
  contact block, and the site-owner implementation checklist. Header line carries "Privacy Officer:
  Adam Wu", the phone number, the website and the Instagram handle. Last-updated date is
  **September 3, 2026**, matching the master document.
- **`HarmonYouth Foundation — Master Final Privacy Policy.docx`** (master folder, not the repo) is now
  the source of truth. Last updated **September 3, 2026**; 17 sections plus a summary, a contact block
  and a site-owner implementation checklist. The older `— Privacy Policy.pdf` is gone from the folder;
  if you want a PDF again, export it from the .docx so the two cannot drift.

As of September 4, 2026 the two documents say the same things *in the same detail* — `privacy.html`
carries the master's field-by-field form tables, the third-party/cross-border table and the retention
table, not a shortened paraphrase. **If you change one, change the other the same day** — the policy
itself promises that in §2.5, §14 and §17.

### 9.2 SITE — the form changes the policy depends on

All in `get-involved.html`, `styles.css` and `site.js`. Roughly 45 minutes of paste-and-check.
The three forms are `#volunteerForm` (performer), `#makerForm` (build) and `#helpForm` (everything else).

> **✅ 9.2 A–E are applied.** Everything in this section is in the repo as of September 4, 2026, and
> `?v=2` was bumped to `?v=3` across all 11 pages. It is kept here as the reference for what was added
> and why, and as the pattern to copy if a fourth form is ever added.

#### A. The age question — all three forms

The policy says *"Every sign-up form asks whether the person filling it in is under 18."* Paste this
block **immediately before the `Parent or guardian email` field** in each of the three forms, inside
the `<div class="fields">` grid:

```html
<div class="field-full">
  <span class="lbl">Are you under 18 years old?</span>
  <div class="choice-row">
    <label class="choice"><input type="radio" name="under_18" value="Yes" required><span>Yes</span></label>
    <label class="choice"><input type="radio" name="under_18" value="No" required><span>No</span></label>
  </div>
  <span class="hint">Participants must be at least 6 years old. Anyone under 18 needs a parent or guardian to confirm consent before taking part.</span>
</div>
```

Then, on the **guardian email pair in all three forms**, swap the hard-coded `required` for
`data-guardian-required` so the JS in **9.2-E** can turn it on only when the answer is Yes:

| Form | Fields to change | Before | After |
|---|---|---|---|
| `#volunteerForm` | `#vparentemail`, `#vparentemail2` | `required` | `data-guardian-required` |
| `#makerForm` | `#mparentemail`, `#mparentemail2` | `required` | `data-guardian-required` |
| `#helpForm` | `#aparentemail`, `#aparentemail2` | *(neither had it)* | `data-guardian-required` |

That last row is the one that quietly fixes the biggest gap: `#helpForm`'s guardian fields are
optional today **on purpose**, because care homes, media and partners use that form too (see section 4).
With the gate, they stay optional for the adults and become mandatory the moment someone says they are
under 18 — you keep the reason the field was optional and lose the hole.

#### B. The CASL reminder-consent checkbox — all three forms

The policy says the box exists, is never pre-ticked, and that ticking it is optional. Paste this as the
**last item inside `<div class="fields">`** in each of the three forms:

```html
<div class="field-full">
  <label class="consent">
    <input type="checkbox" name="email_reminders_consent" data-consent>
    <span>I agree to receive email reminders from HarmonYouth Foundation before upcoming performances. I can unsubscribe at any time.</span>
  </label>
  <span class="hint">Optional. Leaving this un-ticked does not affect your sign-up, your place on the roster, or your volunteer hours.</span>
</div>
```

**Do not add `checked`.** CASL express consent requires the person to tick it themselves; a pre-ticked
box is not consent and is exactly what the audit's issue 1.4 is about.

#### C. The minimum-age notice on the page

Issue 3.1 wants the age stated on the form itself, not only in the policy. Add one `.perk` line under
each form's intro — the same component the volunteer-hours line already uses, so it needs no new CSS:

```html
<div class="perk">
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.5v5.5M12 16.2v.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
  <span>Participants must be at least 6 years old. Anyone under 18 needs a parent or guardian to confirm consent — we email them before adding a student to the roster.</span>
</div>
```

#### D. CSS for the two new controls

Nothing in `styles.css` styles a checkbox or a radio yet, and `.fields label` is a hard uppercase
11px block rule that will wreck an inline choice label if you don't override it. Paste this block right
after the `.fs-error` rule (line 461 as of September 4, 2026 — it's the block headed
`/* --- age gate + CASL consent controls --- */` at line 463, already in the file):

```css
/* --- age gate + CASL consent controls (added Sept 2026, legal audit) --- */
.fields .lbl{display:block;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);margin-bottom:9px}
.choice-row{display:flex;gap:10px;flex-wrap:wrap}
.fields label.choice,.fields label.consent{margin:0;padding:13px 16px;border:1px solid var(--line);border-radius:12px;background:var(--panel);cursor:pointer;
  font-family:'Open Sans',sans-serif;font-weight:400;letter-spacing:0;text-transform:none;color:var(--text);transition:border-color .25s ease,background .25s ease}
.fields label.choice{display:inline-flex;align-items:center;gap:9px;font-size:14.5px}
.fields label.consent{display:flex;align-items:flex-start;gap:11px;font-size:14px;line-height:1.6;color:var(--muted)}
.fields label.choice input,.fields label.consent input{width:17px;height:17px;flex:0 0 auto;padding:0;accent-color:var(--accent)}
.fields label.consent input{margin-top:2px}
.fields label.choice:focus-within,.fields label.consent:focus-within{border-color:var(--accent)}
.fields label.choice:has(input:checked),.fields label.consent:has(input:checked){border-color:var(--accent);background:var(--panel2)}
```

`accent-color` paints the tick and the dot in HarmonYouth gold in both themes. `:has()` is the
selected-state highlight; where it isn't supported the control still works, it just doesn't light up.

**The cache-buster was bumped with it** — all 11 pages now link `?v=3`. If you ever paste new CSS for
these controls, bump it again (`?v=4`) or people keep the old stylesheet and the controls render
unstyled. Section 2 covers this.

#### E. `site.js` — the age gate and the consent timestamp

Two additions inside `initForms()` (line 643 as of September 4, 2026 — both are already in the file;
`initMinorGate` is at line 665).

**1. The age gate.** Add this function inside `initForms`, next to `checkConfirm`:

```javascript
    // Under-18 answer decides whether the guardian email pair is required.
    // Fields carry data-guardian-required instead of a hard-coded required attribute.
    function initMinorGate(form) {
      var radios = $$('input[name="under_18"]', form);
      var guardian = $$('[data-guardian-required]', form);
      if (!radios.length || !guardian.length) return;
      function sync() {
        var minor = radios.some(function (r) { return r.checked && r.value === 'Yes'; });
        guardian.forEach(function (el) { el.required = minor; });
      }
      radios.forEach(function (r) { r.addEventListener('change', sync); });
      sync();
    }
```

and call it in the `forms.forEach` loop, on the line above `form.addEventListener('submit', …)`:

```javascript
    forms.forEach(function (form) {
      initMinorGate(form);
      form.addEventListener('submit', function (e) {
```

**2. The consent record.** An un-ticked checkbox sends **nothing at all** in a `FormData`, so
"they didn't consent" and "the field doesn't exist" arrive at Formspree looking identical — useless as
a CASL record. Stamp it explicitly. In the submit handler, immediately after `var data = new FormData(form);`:

```javascript
        // CASL: record consent explicitly either way, with the date it was given.
        $$('input[type="checkbox"][data-consent]', form).forEach(function (cb) {
          data.set(cb.name, cb.checked
            ? 'YES — consented ' + new Date().toISOString()
            : 'No — did not opt in');
        });
```

Now every submission email carries a line you can file, which is the record the policy promises in §06
and the audit asks for in issue 1.4 step 2.

**Nothing else in the form pipeline needs touching.** New named fields ride along in the `FormData`
automatically, the shared `FORM_ID` is unchanged, and `SUCCESS_CONTENT` is unchanged.

**Test before you upload** — and re-run this if you ever touch the forms. On each of the three forms:
(1) tick **No** and submit with the guardian fields empty → it should send; (2) tick **Yes** and submit
with them empty → the browser should block it and focus the guardian field; (3) submit once with the
consent box ticked and once without, and check both emails land with a readable
`email_reminders_consent` line.

These all passed on September 4, 2026, with `fetch` stubbed so nothing reached Formspree. A ticked box
produced `YES — consented 2026-09-05T00:28:58.365Z`; an un-ticked one produced `No — did not opt in`;
and `#helpForm` with `under_18 = Yes` and blank guardian fields was blocked by the browser as intended.
Stubbing `window.fetch` in the console is the way to test this without burning Formspree's free-tier
quota or filling the org inbox with junk.

### 9.3 SITE — self-host the fonts (optional, closes issue 3.6 completely)

Right now every page load on every page sends the visitor's IP address to Google, because
`fonts.googleapis.com` is linked in the `<head>` of all 11 files. The policy discloses this, so you are
compliant either way — but the audit's preferred fix is to make the disclosure unnecessary. ~30 minutes,
and the site gets slightly faster:

1. Download **Inter** (300, 400, 500, 600, 700) and **Open Sans** (400, 500, 600) as `.woff2` from
   fonts.google.com and put them in the site folder.
2. Add `@font-face` blocks at the top of `styles.css` pointing at the local files, with
   `font-display:swap`.
3. Delete these three lines from the `<head>` of **all 11 `.html` files**:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet">
   ```
4. Then edit the policy: **§08 drop the Google Fonts row from the services table and drop §08.3, and
   drop the Google Fonts line from §09.2 and §17.** Both documents. If you skip this step the policy is describing a request the
   site no longer makes.

### 9.4 OFFLINE — the paperwork, which no amount of HTML fixes

These are the audit's HIGH-risk items, and they are the ones that actually decide a lawsuit. The policy
now states that HarmonYouth does all of them, so they have to be true.

**A. Written photo consent form (issue 2.1 — HIGH).** One page. Must carry: the date and venue, a
description of where photos get published (this website and Instagram), a **YES I consent** box and a
separate **NO I do not consent** box, and a signature line with a printed name. Then:
- Each **care home** signs a blanket consent before you photograph there. Residents who opt out get
  named on that form and are not photographed.
- Each **performer** — or their guardian if under 18 — signs before their first show. It covers later
  shows too, until withdrawn.
- Keep a blank stack in the gig bag. Signed forms are kept **five years minimum**.

**B. The Consent Records folder (issue 3.3 — MEDIUM).** A Google Drive folder called `Consent Records`,
sub-foldered by year. Signed forms go in as scans or photos; guardian email confirmations go in a
dedicated Gmail label. Calendar reminder every January to delete anything past five years. Without this
folder, section 9.4-A is just paper in a bag, and a court can draw an adverse inference from records you
should have kept and didn't.

**C. Parental confirmation flow (issue 2.2 — HIGH, and the hard one).** The policy says a student under
18 joins the roster *only after* a guardian clicks a confirmation link. **A static site on GitHub Pages
cannot send that email** — there is no server. Until it is built, do it by hand: when a performer
sign-up arrives with `under_18 = Yes`, reply to the guardian address from the org Gmail with the
student's name and instrument, what HarmonYouth does, and two clear replies — *I CONFIRM CONSENT* and
*REMOVE MY CHILD — I DID NOT AUTHORIZE THIS*. File the reply under the Gmail label from 9.4-B and only
then add the student. To automate it later: Formspree's paid tier does autoresponders, or a Google Apps
Script on the org Gmail can watch for the subject line and send the template. **This is the single
biggest remaining gap on the list — the manual version is fine, but it has to actually happen every time.**

**D. Formspree deletion workflow (issue 1.6 — MEDIUM).** Log into formspree.io with the org Gmail and
check whether your plan lets you delete individual submissions. If it does, deleting there becomes step
two of every deletion request, right after clearing Drive and Gmail. If it doesn't, the policy already
says so honestly in §07 — but check, because the honest wording is a fallback, not the goal.

**E. What every reminder email must contain (issue 1.4 — HIGH).** CASL requires all three, every time:
sender name **HarmonYouth Foundation**; a mailing address or phone — **Calgary, AB · (403) 926-6122**;
and a **working** unsubscribe link. Put them in the email template once. Also keep the opt-in
spreadsheet: email address, date consented, which form — the `email_reminders_consent` line from 9.2-E
gives you all three, you just have to copy it across. (Policy §07.2.)

**F. Keep a private breach note.** §11 of the policy commits to notifying affected people within 72 hours
and the Alberta OIPC where required, and names the Privacy Officer as responsible. Write down — even
just a doc in Drive — who checks what, and what the first three phone calls are. You do not want to be
designing that process on the day.

### 9.5 Things that must now stay consistent

Add these to the list in section 3's "Change the volunteer hour wording" habit — same trap, same fix.

| Claim | Where it appears | Rule |
|---|---|---|
| Minimum age **6** | policy §05.1 (both docs), the three `.perk` lines from 9.2-C, the three age-question hints from 9.2-A | Change one, change all seven |
| Privacy Officer **Adam Wu** | `privacy.html` header line + §12.8 + §14 + the contact block; master .docx cover + §14 | Policy promises an update within **one week** of the officer changing |
| Withdrawal timelines **24h / 48h / 7d / 14d** | policy §06 and §12.3–§12.4 (both docs) | These are commitments, not aspirations — do not soften them in one doc only |
| Breach notice **72 hours** | policy §11 (both docs) | Same |
| Consent records **5 years** | policy §04.2, §05.4, §10 (both docs) | Must match what the Drive folder in 9.4-B actually does |
| Form fields ↔ policy §02 | any new field on any form | **The policy promises it is updated the same day, before the new form goes live** (§2.5, §14, §17). The three field tables in §02 currently match the three forms exactly — keep it that way. This is the one rule in this guide you genuinely cannot let slide |

---

## 10. Design audit notes (September 2026) — not yet applied

A design review was run against the site's anti-generic-design principles. Nothing below has been
changed in the code — these are recommendations for whoever picks this up next.

**What's working:** the hero (a real performance photo expanding on scroll, not a generic
gradient-blur headline), the piano spotlight (section 5 — genuinely grounded in the subject), and
the liquid-glass buttons (a bespoke, consistently-executed micro-interaction).

**What reads as templated:**
- [ ] **The "Get involved" FAQ accordion** (five questions, numbered `01`–`05`) is a stock SaaS-FAQ
  pattern — numbered dividers, plus/× toggle, thin question text — and the numbering doesn't mean
  anything: the five questions aren't a sequence. Compare to the "How a show runs" `01/02/03` cards
  earlier on the same page, where the numbering *is* real (Booking → Lineup → After). Likely fix:
  drop the numbers from the FAQ, keep them on the process cards.
- [ ] **Typography has no distinct personality.** Inter (headlines + UI) + Open Sans (body) is one
  of the most common pairings in web design generally — safe, but not specific to HarmonYouth.
- [ ] **Dark mode's structure** — near-black background (`#07080A`) plus exactly one accent colour
  (`--accent:#C9A15A`) — matches a well-known generic-AI-design formula (near-black + single bright
  accent), independent of the specific gold hue chosen. See the palette proposal below for a
  low-risk fix.
- [ ] **Motion is scattered rather than one signature moment.** Counted running at once: hero
  scroll-lock, sitewide fluid cursor trail, piano spotlight, carousel blur-up, accordion expand,
  scroll progress bar, dot rail. Worth considering whether the ambient chrome (progress bar, dot
  rail, cursor trail) should recede so the hero's scroll expansion reads as *the* signature moment
  rather than one effect among several.

**Proposed palette fix — "Concert Red" as a second accent.** Rather than repainting the palette,
pull a second colour from imagery already on the site: the red velvet seats and chandelier in the
piano illustration (section 5). Adding it as a genuine second accent breaks the
single-accent-on-near-black formula without touching the gold, the logo, or any already-validated
contrast pairing.

```
#8C2F38  (base)
├─ 300 #CB7881 → text on dark bg:            6.24:1  (AA)
├─ 500 #8C2F38 → filled badge, light text:   7.52:1 dark theme / 8.14:1 light theme  (AA/AAA)
└─ 600 #6E232B → text on light bg:           9.76:1  (AAA)
```

Suggested use — small and deliberate, not a repaint: give the `talks` show-status pill (currently
reuses the gold `--accent-soft`) its own red, so "In talks" reads differently from "Recruiting" at
a glance. Keep it out of primary buttons/CTAs — gold stays the dominant brand colour, red is the
accent-to-the-accent, per the 60-30-10 rule.

**Current palette accessibility (validated independently, September 2026):** every text/background
and text/button pairing in both themes clears WCAG AA (4.5:1). Only the two primary text colours
against their backgrounds clear AAA (7:1) — the muted/faint text tokens and the gold accent land in
the 4.5–6.9:1 range in both themes, same conclusion as section 5's contrast note, now re-verified
with `check_contrast.py`.

---

## 11. Quick reference

| Thing | Where it lives |
|-------|----------------|
| Upcoming shows list | `performances.html` → `data-view="list"` (and the `.detail-grid` cards above it — **both**) |
| Performance calendar data | `site.js` → `PERFORMANCE_CALENDAR` |
| Build meet calendar data | `site.js` → `BUILD_MEET_CALENDAR` |
| Calendar rendering | `site.js` → `initCalendar()` |
| Photo galleries | `photos.html` → `.carousel-block` |
| Piano spotlight (homepage CTA band) | `index.html` → `.piano-hover`; `site.js` → `initPianoSpotlight()`; images `piano-outline.jpg` / `piano-color.jpg` |
| Fluid cursor trail | `site.js` → `initCursor()` |
| Homepage hero behaviour | `site.js` → `initHeroLock()`; `styles.css` → `.hero-scene` / `.hero` |
| Forms | `get-involved.html`; wiring in `site.js` → `initForms()` |
| Under-18 gate | `site.js` → `initMinorGate()`; `[data-guardian-required]` on the guardian pairs |
| CASL consent stamp | `site.js` → `initForms()` submit handler, just after `new FormData(form)` |
| Policy prose, lists and tables | `styles.css` → `.prose h4` / `.prose ul` / `.prose .tbl`, plus the `max-width:620px` block |
| Show count in the menu | `nl-tag` — hard-coded in all 11 `.html` files |
| Cache-buster | `?v=3` on `styles.css` and `site.js` in all 11 `.html` files |
| Formspree form ID | `site.js` → `FORM_ID` |
| Confirmation screen wording | `site.js` → `SUCCESS_CONTENT` |
| Search keywords and destinations | `site.js` → `ROUTES` |
| Rotating search placeholders | `site.js` → `PLACEHOLDERS` |
| Menu rows | the `menu-links` block — repeated in all 11 `.html` files |
| Team bios | `team.html` — Adam, Hanry, Arthur, then Vienna Lu (`vienna-marketing.jpg`) |
| Vienna Lu's bio | `team.html` → the last `.founder` section |
| Contact info | footer of every page |
| Privacy policy text | `privacy.html` → `.numbered` + the three `.panel` blocks; `— Master Final Privacy Policy.docx` in the master folder — **keep the two in step** |
| Privacy Officer name | `privacy.html` header line + §12.8 + §14 + contact block; master .docx cover + §14 |
| Legal audit + what's still open | this guide, section 9 (9.4 is the remaining work) |
| Age gate / consent checkbox markup | `get-involved.html`; `site.js` → `initMinorGate()`; `styles.css` → `.fields label.choice` / `.consent`. Reference: section 9.2 |
| All colours, fonts, glass recipe | `styles.css` → `:root` and `[data-hy-theme="light"]` |
| All interactivity | `site.js` |
