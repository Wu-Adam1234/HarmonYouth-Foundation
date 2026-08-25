# HarmonYouth Foundation Website — Guide & Handoff Notes

Everything about how the site is built, what's on it, and how to update it yourself.

**Live site:** https://wu-adam1234.github.io/HarmonYouth-Foundation/
**Repo:** github.com/Wu-Adam1234/HarmonYouth-Foundation
**Contact on site:** harmonyouthfoundation@gmail.com · (403) 926-6122 · Instagram @harmonyouthfoundation
**Slogan:** "We play music. We build devices. We show up for people." — appears under the homepage hero and in the footer of every page.

---

## 1. What the site is

A 6-page static website. No frameworks, no build step, no npm — just HTML, CSS, and JavaScript files. That means **you can edit any file in a text editor and re-upload it**, and it works. Nothing to compile.

| Page | File | What's on it |
|------|------|--------------|
| Home | `index.html` | Hero with interactive 3D piano, scroll-scrubbed piano film section, what-we-do summary, GoFundMe support section |
| Mission | `mission.html` | Why the org exists, then both programs in full: Program 01 (music at senior homes) and Program 02 (Build) |
| Meet the team | `team.html` | Open role posting (Marketing/Outreach Lead), then Adam's, Hanry's, and Arthur's bios |
| Performances | `performances.html` | Upcoming shows (list + calendar views), past performance photo galleries |
| Build meets | `build-meets.html` | Upcoming build meeting dates (list + calendar views), what to expect at one. No Past section yet — there hasn't been a meet to photograph |
| Get involved | `get-involved.html` | Three jump buttons at the top, then three stacked signup cards: perform at a senior home, build assistive devices, everything else — plus donate card and WeChat QR |

Shared across all pages: `styles.css` (all styling), `script.js` (all interactivity), `harmonyouth-logo.png`. There's also an `assets/piano/` folder holding the frames for the homepage film section (see section 3).

**The Build page is gone.** `making.html` was deleted and all of its content moved into `mission.html` as "Program 02". Every link that used to point at `making.html` now points at `mission.html#build`. If you find a stray one anywhere (an old Instagram bio link, a flyer QR code), that's the address to use.

The nav is down to six links, which sits comfortably on one line. `styles.css` tightens the spacing at 1180px wide and drops to the hamburger menu at 1000px. You've got room for a seventh link before that gets tight again.

---

## 2. How to update the live site

1. Go to the repo on GitHub
2. Click **Add file → Upload files**
3. Drag in the changed files (or all of them — overwriting is fine)
4. Scroll down, click **Commit changes**
5. Wait ~1 minute, then **hard-refresh** the live page (Cmd+Shift+R / Ctrl+Shift+R)

> **Important:** browsers cache aggressively. If a change doesn't appear, it's almost always the cache, not a broken upload. Hard-refresh before assuming something went wrong.

---

## 3. Common edits (step by step)

### Add a new upcoming performance

Open `performances.html`, find the `<div class="show-list" id="listView">` block, and copy an existing row:

```html
<div class="show-row">
  <div class="show-date">Sep 12</div>
  <div class="show-venue"><span><a href="GOOGLE_MAPS_LINK" target="_blank" rel="noopener" class="venue-link">Venue Name</a></span><span class="sub">2:00 to 2:30 PM</span></div>
  <div class="show-status">Recruiting</div>
</div>
```

Keep rows in date order.

**Status options** (this is the text inside the last div):
- `Recruiting` — default, still need performers
- `Full` — add the class `full` to the div: `<div class="show-status full">Full</div>` (grays it out — the color comes from `.show-status.full` in `styles.css`, so you don't need inline styles for this one anymore)
- `In talks` — add `style="color:var(--rose);"`

*(This is what was done for both August 21 shows — The Scenic Grande and The Manor Village at Rocky Ridge filled up, so both rows switched from `<div class="show-status">Recruiting</div>` to `<div class="show-status full">Full</div>`, and the matching calendar entries in `script.js` switched from `'recruiting'` to `'full'`. See the next section.)*

*(Same thing happened next for the August 23 and August 30 shows — Cambridge Manor and Boardwalk Retirement Community both filled up, so those two rows also switched to `<div class="show-status full">Full</div>`. At the same time, five planned-but-not-yet-confirmed shows were added as `In talks`: Sep 6 and Oct 11 at The Scenic Grande, Sep 13 at The Manor Village at Rocky Ridge, Sep 25 at The Scenic Grande, and Oct 4 at Rocky Ridge Retirement Community. Their times weren't fully specified when added — only start times were known — so 30-minute slots were assumed to match the site's usual pattern; update those if the actual booked length differs.)*

*(Most recently, the two August 21 shows and the August 23 show at Cambridge Manor happened, so all three rows came out of the upcoming list and became photo galleries. Boardwalk on August 30 is now the first row in the list.)*

### Add that same show to the calendar

The calendar is generated by JavaScript, not typed out in HTML. Open `script.js` and find the block commented `SCHEDULE DATA` (search for `PERFORMANCE_CALENDAR`). There are two calendars there now — one for performances, one for build meets — and they're the same shape:

```javascript
const PERFORMANCE_CALENDAR = {
  venues: { SG: 'The Scenic Grande', MV: 'The Manor Village at Rocky Ridge', ... },
  events: {
    '2026-08-01': [['RR', 'past', '2:00 to 2:30 PM']],
    '2026-08-07': [['SG', 'past', '2:00 to 2:30 PM'], ['MV', 'past', '1:00 to 1:30 PM']],
    ...
  },
  min: { y: 2026, m: 7 },   // earliest month you can page back to — August 2026
  max: { y: 2026, m: 9 },   // latest month you can page forward to — October 2026
  start: { y: 2026, m: 7 }, // which month the calendar opens on
  labels: { past: 'Past performance' },
  note: 'Blue = recruiting, gray = past. Hover a chip for venue and time.'
};
```

Event format is `'YYYY-MM-DD': [['VENUE_CODE', 'status', 'time']]`. Multiple shows on one day go in the same array. Venue codes come from `venues` — add a new venue there first, or the chip will render blank.

Valid statuses: `recruiting`, `full`, `talks`, `past`, `cancelled`. Their tooltip wording lives in `STATUS_LABEL` just below the two config objects; `labels` on an individual calendar overrides it for that calendar only (which is how build meets says "Spots open" where performances says "Recruiting").

**Months are 0-indexed**, so `m: 7` is August and `m: 9` is October. **The performances calendar currently covers August through October 2026.** When you add a show in a month past `max`, bump `max` or people can't page forward far enough to see it.

**If you need a third calendar later** (say, a separate one for a different program), copy one of the two config objects, give the new page a `.calendar-view` block with the same inner structure, and add one line at the bottom of the section:

```javascript
initCalendar(document.getElementById('yourCalMonth'), YOUR_CALENDAR);
```

`initCalendar` finds the title, the Prev/Next buttons, and the legend by looking inside the surrounding `.calendar-view`, so the only thing that has to be unique is the id on the `.cal-month` div. The Prev and Next buttons need the classes `cal-nav-btn prev` and `cal-nav-btn next` — that's how the script tells them apart.

The List/Calendar toggle is wired the same way: each `.view-toggle` controls the `.show-list` and `.calendar-view` inside its own `.section-inner`, so two of them on one page won't fight.

### Move a show from upcoming to past (after it happens)

1. Delete its row from the `show-list` in `performances.html`
2. Change its calendar status in `script.js` to `'past'`
3. Add a photo gallery (below)

*(This is exactly what was done for the August 7 shows at The Scenic Grande and The Manor Village at Rocky Ridge, and again for August 21 at both of those venues plus August 23 at Cambridge Manor — rows removed from the upcoming list, calendar entries switched to `past`, galleries added at the top of the Past section.)*

### Add a photo gallery for a past performance

1. **Resize the photos first** — phone photos are 5–10MB each and will make the page painfully slow. Aim for ~1600px wide, JPG, quality ~80. Any free online image compressor works.
2. Name them consistently: `venue-date-1.jpg`, `venue-date-2.jpg`, etc. (e.g. `scenicgrande-aug7-1.jpg`, `manorvillage-aug7-1.jpg`)
3. Upload them to the repo
4. In `performances.html`, inside the `Past` section, copy an existing `past-show` block and swap the filenames

Structure:
```html
<div class="past-show">
  <div class="past-show-photo carousel">
    <img data-src="photo-1.jpg" class="carousel-slide active" alt="...">
    <img data-src="photo-2.jpg" class="carousel-slide" alt="...">
    <div class="carousel-dots">
      <span class="carousel-dot active"></span>
      <span class="carousel-dot"></span>
    </div>
  </div>
  <div class="past-show-info">
    <div class="show-venue"><span>Summer Performance</span><span class="sub"><a href="MAPS_LINK" class="venue-link">Venue</a>, August 1</span></div>
  </div>
</div>
```

**One dot per photo** — if you have 10 photos you need 10 `<span class="carousel-dot">` entries. The first photo gets `active` on both the image and the dot; the rest don't.

Newest performance goes at the top of the Past section.

**Lead with a landscape photo.** The carousel frame is a fixed 16:10 box and images are set to `contain`, so nothing ever gets cropped — but a portrait photo sitting in that box shows wide dark bars down both sides. It looks fine partway through a rotation and slightly awkward as the still image someone lands on. The August 21 Scenic Grande set has two portrait shots; they were moved to positions 7 and 8 so a landscape one opens the gallery. Do the same with future mixed sets.

*(For reference, the three galleries added on August 23: `cambridgemanor-aug23-1` through `-16`, `scenicgrande-aug21-1` through `-8`, and `manorvillage-aug21-1` through `-5`. All were resized to 1600px wide at quality 82 before upload.)*

### Change the Get Involved headline or the three jump buttons

The page opens with a header (`.ph-inner`) and a row of three buttons (`.route-nav`) that scroll down to the matching card. Each button is one `<a class="route-btn">` with a title and a one-line description:

```html
<a href="#perform" class="route-btn">
  <svg ...></svg>
  <span>
    <span class="route-btn-label">Perform at a senior home</span>
    <span class="route-btn-sub">Any instrument, any skill level. We handle the booking.</span>
  </span>
</a>
```

The three anchors are `#perform`, `#build`, and `#other`, matching the `id` on each card further down. If you rename an anchor, change it in both places or the button stops scrolling anywhere. `#making` and `#help` still work as old aliases, so any link you already posted (Instagram bio, flyers) keeps landing in the right spot.

Keep each `route-btn-sub` to one line. Two lines makes the three buttons different heights on a laptop screen.

### Change the volunteer hour wording

The volunteer hour certificate claim appears in nine spots, and they need to stay consistent. Two things have to match everywhere: **four hours** is a total across both programs, not four hours of performing, and **volunteer service letters are available on request** (mentioned alongside the certificate line each time).

| Where | File |
|-------|------|
| Badge on the performer card | `get-involved.html` → `.volunteer-perk` in `#perform` |
| Badge on the maker card | `get-involved.html` → `.volunteer-perk` in `#build` |
| Highlight stat, homepage | `index.html` → last `.stat` in `mission-stats` |
| Highlight stat, Mission page, Why we exist | `mission.html` → last `.stat` in the `#why` `mission-stats` |
| Highlight stat, Mission page, Build program | `mission.html` → last `.stat` in the Build `mission-stats` |
| Badge in the closing call to action | `mission.html` closing `support-section` |
| Line under the upcoming shows | `performances.html` below the show list |
| Line under the upcoming meets, and the badge below it | `build-meets.html` — two spots on that page |

If you change the number or the rule, change all of them. A performer reading "4 hours of performing" on one page and "4 hours total" on another will ask which one is true.

*(The threshold was 5 hours originally and dropped to 4. The service letter offer was added at the same time. The two badge wordings currently in use, if you need to match them:*
- *Badges and the performances line: "Volunteer hour certificates at every 4 hours. Performances and build meetings both count toward the total, and we can write a volunteer service letter on request."*
- *Highlight stats: `4 hours` / "of performing or building earns a volunteer hour certificate, with service letters on request")*

### Add or change a build meet

Build meets live on their own page, `build-meets.html`, and it's built exactly like `performances.html` — same `page-header`, same List/Calendar toggle, same `.show-list` and `.calendar-view` blocks. The one difference is there's no Past section, because there hasn't been a meet to photograph yet.

**The list row.** Open `build-meets.html`, find `<div class="show-list" id="buildListView">`, and copy the existing row:

```html
<div class="show-row">
  <div class="show-date">Sep 30</div>
  <div class="show-venue"><span>Build meet</span><span class="sub">9:00 AM to 12:00 PM &nbsp;&middot;&nbsp; Location to be confirmed</span></div>
  <div class="show-status">Spots open</div>
</div>
```

Unlike a performance row, the venue cell is plain text rather than a Google Maps link, because the location isn't public yet. Once you have a fixed address, wrap it the same way performances do:

```html
<span class="sub">9:00 AM to 12:00 PM &nbsp;&middot;&nbsp; <a href="MAPS_LINK" target="_blank" rel="noopener" class="venue-link">Venue Name</a></span>
```

Status text follows the same rules as performances (`Full` takes the `full` class, `In talks` takes `style="color:var(--rose);"`), except the default reads **Spots open** instead of Recruiting.

**The calendar entry.** In `script.js`, add the date to `BUILD_MEET_CALENDAR`:

```javascript
events: {
  '2026-09-30': [['BM', 'recruiting', '9:00 AM to 12:00 PM']]
}
```

`BM` is the only venue code defined for build meets right now, and it reads "Build meeting, location to be confirmed" in the legend. Once meets have a regular home, rename that entry, or add a second code if they move around.

**Both Prev and Next are greyed out at the moment**, because `min` and `max` are both September 2026 — there's one meet and one month to show. That's intentional rather than broken, but the moment you add an October meet, bump `max` to `{ y: 2026, m: 9 }` or it won't be reachable.

**Two spots still say "Location to be confirmed"** and both need updating when you have an address: the `.sub` line in the list row, and the `BM` entry in `BUILD_MEET_CALENDAR.venues`.

### Update the Build program section

The Build content now lives inside `mission.html`, not on its own page. Scroll down that file to the comment `<!-- ============ PROGRAM 02: BUILD ... ============ -->`. Everything from the old `making.html` is there in the same order: the numbered `.program-band` intro with its three buttons, the `mission-grid` of paragraphs and stats, the four-step "How a build meeting works" section, and the closing "You don't need to own a 3D printer" `support-section`.

To add a stat, milestone, or step, copy the existing block structure from that same file rather than starting fresh — the CSS classes are shared with the rest of the page.

### How the Mission page is organized

The page runs in a deliberate order, and each part is marked with a comment in the HTML:

1. `page-header` — the headline and the two-programs summary
2. `.program-jump` — three cards linking to `#why`, `#music`, and `#build`. This is what makes the structure obvious to someone landing cold on the page
3. `#why` — why the org exists, plus the four headline stats
4. `#music` — Program 01, in a `.program-band` (big number, "Program one" tag, lede, buttons), followed by the "How a show comes together" steps
5. `#build` — Program 02, same `.program-band` treatment, followed by the build paragraphs, build stats, the "How a build meeting works" steps, and the closing call to action

**To add a third program later,** copy a whole `.program-band` block, give it `id="yourprogram"` and `03` in the `.program-no` div, then add a fourth card to `.program-jump-inner`. The grid there is `repeat(3,1fr)` in `styles.css` — change it to `repeat(4,1fr)`, or better, `repeat(auto-fit,minmax(240px,1fr))` so it wraps on its own.

Anchor targets (`#why`, `#music`, `#build`) have `scroll-margin-top:104px` so the fixed nav doesn't cover the heading when someone follows a link straight to one.

### The homepage film section

Between the piano hero and the "What we do" block, `index.html` has a scroll-scrubbed film: a grand piano dissolving into a spiral of golden notes, tied to your scroll position rather than playing on a timer.

**How it's built.** The source MP4 was cut into 120 still frames, stored in `assets/piano/` — `d_001.webp` through `d_120.webp` at 1280×720 for desktop (about 4.1MB total), and `m_001.webp` through `m_120.webp` at 640×360 for phones (about 1.8MB). A `<canvas>` draws whichever frame matches how far you've scrolled through the section. Frames, not a `<video>` tag, because scroll-scrubbing a video is unreliable on iPhones.

**Where the code is.** The markup is the `<section class="film-scene" id="filmScene">` block in `index.html`. The styling is the `SCROLL-SCRUBBED FILM SECTION` block near the bottom of `styles.css`. The logic is the last block in `script.js`, commented the same way.

**To change the captions:** edit the three `.film-cap` divs in `index.html`. They fade in and out at fixed points in the scroll, set by `CAP_RANGES` in `script.js` — `[[0.03, 0.33], [0.37, 0.65], [0.69, 1.01]]`, as fractions of the way through the section. The gaps between those ranges are intentional; they give the image a moment on its own.

**To make the scroll slower or faster:** change `height:360vh` on `.film-scene` in `styles.css`. Taller means more scrolling per frame, so a slower, more drawn-out animation.

**To swap in a different video:** export frames with the same naming pattern into `assets/piano/`, then update `data-frames="120"` on the section if the count changed. The commands used were:

```bash
ffmpeg -i INPUT.mp4 -vf "fps=12,scale=1280:720:flags=lanczos" -c:v libwebp -quality 74 assets/piano/d_%03d.webp
ffmpeg -i INPUT.mp4 -vf "fps=12,scale=640:360:flags=lanczos"  -c:v libwebp -quality 60 assets/piano/m_%03d.webp
```

**Things it already handles**, so don't be alarmed: frames only start downloading when you scroll within about 1.5 screens of the section; they load six at a time rather than all at once; if you scroll faster than they arrive it draws the nearest frame it has instead of going black; there's an 8-second failsafe so a bad connection never leaves the loading bar stuck; and anyone with "reduce motion" turned on in their OS gets a single still frame and no scroll animation at all.

**When uploading to GitHub,** drag the whole `assets` folder in. It's 240 files, so it takes longer than the single-file uploads you're used to — that's normal, not a stall.

---

## 4. How the forms work

All three forms on Get Involved submit through **Formspree** (free tier) to harmonyouthfoundation@gmail.com. The page is an `.involve-stack` holding three `.involve-card` blocks stacked down the page: performers, makers, and everything else. Each card is a two-column grid, description on the left and form on the right, collapsing to one column under 900px.

- Form ID: `xnjkdgge` — appears three times at the bottom of `get-involved.html`, once per form (`#volunteerForm`, `#makerForm`, `#helpForm`)
- Each form has its own hidden `_subject` field, so the email subject line tells you which panel it came from without opening it
- Submissions also appear in your Formspree dashboard (formspree.io, log in with the org Gmail)
- Free tier has a monthly submission limit; if you outgrow it you'll need to upgrade or switch services

**Performer form (`#volunteerForm`) collects:** name, instrument, area (NW/SW), performer email, parent/guardian email + confirmation, dates interested, phone.

**Maker form (`#makerForm`) collects:** name, email, phone, parent or guardian email + confirmation, and free-text details. This is the Makers Making Change panel.

*(This form used to have an "I'd like to" dropdown — join a build meeting / request a device or toy / both — sitting above the Details box. It's been removed; people say which they want in the Details field. If you ever want it back, it was a plain `<select id="minterest" name="interest" data-fs-field>` with those three options. Nothing else depended on it, so removing it didn't affect Formspree or the confirmation screen.)*

**Everything-else form (`#helpForm`) collects:** name, email, optional parent or guardian email + confirmation, message. For marketing, outreach, donations, media, partnerships, or anything that isn't performing or making. The parent fields here are **optional on purpose** — adults use this form too (care home staff, media, partners), and making it required would stop them submitting. To make it required anyway, add `required` to both `#aparentemail` and `#aparentemail2`.

All three forms have a parent/guardian email with a "type it again" confirmation field that blocks submission if the two don't match — a typo'd parent email means you can't reach anyone.

The matching check is generic. Any confirm input with `data-confirm-for="<id of the first email field>"` gets checked automatically, and the error message appears in the `.fs-error` span sitting next to it. Leaving both fields blank passes, which is what makes the optional version on `#helpForm` work. If you add a fourth form later, that one attribute is all the wiring it needs.

To change where submissions go: create a new form in Formspree and replace the relevant instance(s) of `xnjkdgge`.

To add a fourth card later, copy one `<article class="involve-card reveal" id="...">` block, give it a new `id`, wire up a new `<form id="...">`, and add a matching `formspree('initForm', ...)` call in the script block at the bottom of the page. Add a fourth `.route-btn` in the header pointing at the new `id`. The stacked layout takes any number of cards without a CSS change — the old three-column `triple-grid` didn't, which is why the panels used to sit at uneven widths.

---

## 5. The confirmation screen after someone submits

When any of the three forms is submitted successfully, the whole form is swapped out for a full-size confirmation card — dark rounded panel, a headline, and a short message with links to the Performances page and Instagram. No page reload; it happens right in place.

This isn't part of Formspree — it's handled in `script.js`, in the block that starts with `// turn inline success messages into a full confirmation screen`. Each form has its own headline and message, keyed by form ID:

```javascript
const SUCCESS_CONTENT = {
  volunteerForm: { title: "You're on the roster", body: '...' },
  makerForm:     { title: 'Thanks for reaching out', body: '...' },
  helpForm:      { title: 'Message received', body: '...' }
};
```

Both `SHOWS_LINK` (→ `performances.html`) and `IG_LINK` (→ the Instagram profile) are defined once, just above `SUCCESS_CONTENT`, and reused inside each `body` string — so if the Instagram handle or the events page ever changes, update it in that one spot instead of hunting through three messages.

**To change the wording:** edit the `title` or `body` string for the form you want. `body` accepts HTML, so you can add or restyle links using the `fs-success-link` class (defined in `styles.css`, gold and underlined to match the rest of the site).

**To change the look of the card itself** (background, padding, corner radius, heading size): that's the `.fs-success-screen`, `.fs-success-screen .fs-success-title`, and `.fs-success-screen .fs-success-msg` rules in `styles.css`.

**If you add a fourth form** (see the "add a fourth card" note in the section above), give it an entry in `SUCCESS_CONTENT` keyed by its form ID — if you skip this, it'll just fall back to a plain "Sent!" with whatever text Formspree returns, no links.

---

## 6. Things you should actually keep on top of

- **Check the Formspree inbox regularly.** The confirmation screen tells people they're on the roster or that you'll follow up by email. If nobody's watching that inbox, that promise breaks.
- **Get photo consent before posting anyone.** `HarmonYouth_Photo_Release_Form.docx` covers this — it authorizes website, social media, and roster use, and requires an email and phone number. For residents, a staff member or family member typically needs to sign. This matters more than it sounds like it does; care facilities are strict about resident privacy for good reason.
- **Update statuses after each show.** A page full of "Recruiting" for dates that already passed looks abandoned.
- **Add Arthur's photo.** His bio on `team.html` currently shows a placeholder card reading "Cello · photo coming soon". Save a photo as `arthur-cofounder.jpg`, then in `team.html` replace the whole `<div class="photo-placeholder">` block with the `<img>` tag sitting commented out directly above it.
- **Photo file sizes.** The site is currently ~32MB, photos plus the film frames. It's fine now, but if it keeps growing, page loads on phones will suffer. Compress before uploading, always. Galleries load lazily, so the cost lands on people who scroll down to Past, not on everyone.
- **Fill in the build meet location.** Two spots on the site currently say "Location to be confirmed." Someone deciding whether to come needs to know where they're going.

---

## 7. Design notes (if you want to change the look)

All colors are defined once at the top of `styles.css` as variables, so changing one line updates the whole site:

```css
--bg: #0A0B0E;        /* page background */
--gold: #5B7B9A;      /* accent — buttons, links, highlights */
--rose: #8FB0CC;      /* secondary accent */
--text-hi: #F2F4F8;   /* main text */
--text-lo: rgba(242,244,248,0.62);  /* muted text */
```

The visual style is dark glass-morphism (frosted translucent cards, pill buttons, soft glows), with a navy/slate palette pulled from the logo.

**Gallery images load lazily.** Past-performance photos aren't fetched on page load — each `<img>` in a carousel holds its filename in `data-src` instead of `src`. `script.js` watches each gallery with an `IntersectionObserver`, and only when it scrolls within ~200px of view does the script copy `data-src` into `src` (triggering the actual download) and start that carousel's auto-rotation. This keeps the initial page load light even as more galleries pile up. If you're adding a new gallery by hand, keep using `data-src="filename.jpg"` on each `<img class="carousel-slide">`, not `src` — the existing blocks in `performances.html` show the pattern.

**Interactive pieces, in case you wonder what's making something move:**
- Hero piano: tilts in 3D as you scroll; keys light up under your mouse; **clicking a key plays the actual note** (Web Audio)
- Bottom of every page: thin piano-key progress bar that fills as you scroll
- Background: flowing animated line paths + faint drifting music notes
- Cards: glow border follows your cursor angle when you hover nearby
- Sections fade/rise in on scroll, and re-animate if you scroll back

---

## 8. Known gaps / things left undone

- **The GoFundMe embed widget only renders on the live site**, not when opening files locally. There's a styled fallback card plus a QR code behind it, so donation always works either way.
- **The calendars are hardcoded** in `script.js`. There's no admin panel — every schedule change means editing that file, now in two places if a date affects both programs. Fine at this scale; if the org grows a lot you'd want a real backend.
- **Photo release form is a plain-language template, not lawyer-reviewed.** Worth having an adult (parent, or the care home's admin) look it over before you collect a lot of signatures.
- **Verify Google Maps links after adding them.** Some venue links use map *searches* rather than pinned locations; click them once after uploading to confirm they land on the right building.
- **The Build section describes the program at a general level.** As specific device/toy builds happen, it's worth adding real numbers (devices built, families helped) the same way the performance stats work.
- **Arthur's bio has no photo yet**, and it tells a very similar story to Adam's — both open on a first visit to a senior home where residents ended up humming along. The wording was adjusted so they don't repeat each other line for line, but read back to back it's still noticeably the same arc. Worth a look next time either bio gets touched.
- **The film frames are a fixed 10-second clip.** If the org ever gets real performance footage, that would be a stronger thing to scrub through than a stock render.
- **`build-meets.html` has no Past section.** Once the September 30 meet happens, add one by copying the `<section id="past">` block out of `performances.html` — the `past-show` markup and the lazy-loading carousel work identically. You'd also want to add a "Past meets & photos" button to the page header, matching the pair on Performances.
- **The build meet location is a placeholder.** See the note in section 3 for the two spots to change.

---

## 9. Quick reference

| Thing | Where it lives |
|-------|----------------|
| Upcoming shows list | `performances.html` → `show-list` |
| Upcoming build meets list | `build-meets.html` → `show-list` |
| Performance calendar data | `script.js` → `PERFORMANCE_CALENDAR` |
| Build meet calendar data | `script.js` → `BUILD_MEET_CALENDAR` |
| Calendar rendering itself | `script.js` → `initCalendar()` |
| Past galleries | `performances.html` → `Past` section |
| Build program content | `mission.html` → `#build` (Program 02) |
| Mission page jump cards | `mission.html` → `.program-jump-inner` |
| Homepage film frames | `assets/piano/` |
| Film section code | `index.html` → `#filmScene`; `script.js` → last block; `styles.css` → film section |
| Build meet schedule page | `build-meets.html` (nav label "Build meets") |
| Get Involved forms (performer / maker / other) | `get-involved.html` → `.involve-stack`, one `.involve-card` each |
| Get Involved jump buttons | `get-involved.html` → `.route-nav` |
| Post-submit confirmation screens | `script.js` → `SUCCESS_CONTENT`; styling in `styles.css` → `.fs-success-screen` |
| Team bios | `team.html` |
| Open role posting | `team.html` → `recruiting-banner` |
| Forms | `get-involved.html` |
| Contact info | footer of every page + `get-involved.html` header |
| Nav links (7 of them) | the `<nav>` block at the top of every page |
| All colors/styling | `styles.css` |
| All interactivity | `script.js` |
