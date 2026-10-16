# axel friberg hagen — portfolio

Personal site: selected work plus a photo log ("Plog") of trips. React 19 + Vite 7, English/Norwegian, light/dark, deployed on Netlify.

## Develop

```bash
npm install
npm run dev        # builds photos, then http://localhost:3000
npm test           # vitest (watch); `npm test -- --run` for a single run
npm run lint
npm run build      # builds photos, then the site into build/
npm run preview
```

`npm run photos` runs on its own as well. The first run resizes every original (~30 s). After that, only new or changed photos are processed.

## Adding a trip

1. Create `content/trips/<trip-id>/` (e.g. `kyoto-2026`). The folder name becomes the URL: `/plog/kyoto-2026`.
2. Drop the original photos in it (PNG/JPG/HEIC are fine, any size).
3. Add `trip.md`:

   ```markdown
   ---
   title: Kyoto in Spring
   title_no: Kyoto om våren        # optional
   location: Kyoto, Japan
   start: "2026-04-02"             # "2026", "2026-04" or "2026-04-02"
   end: "2026-04-06"               # optional
   cover: IMG_1234.png             # optional, defaults to the first photo
   draft: false                    # true hides the trip on the site
   photos:                         # optional, per photo
     IMG_1234.png:
       alt: Temple gate in the rain  # describe the photo for screen readers
       caption: Fushimi Inari at 6am
       featured: true                # also shown under Highlights
   ---

   The story, in markdown. The first paragraph is used as the teaser.
   ```

4. Run `npm run dev` and the trip appears on `/plog` and on the home page if it's among the three newest.

Photos that don't belong to a trip go in `content/gallery/`, with optional `alt`/`caption`/`featured` entries in `content/gallery/gallery.md`.

## How it fits together

```
content/                 originals + markdown (the only place you edit)
scripts/build-photos.mjs → public/img/**.webp (480/720/960/1600/2048 px, auto-rotated)
                         → src/data/photos.generated.json (trips, photos, blur placeholders)
src/
  data/       site.js (links), projects.js (Selected work), photos.js (queries over the manifest)
  i18n/       en.js, no.js, provider + useI18n
  theme/      useTheme (data-theme on <html>; index.html applies it before paint)
  components/ Header, Footer, Photo, PhotoGrid, Lightbox, TripCard, ProjectRow, Reveal
  routes/     Home, Plog, Trip, NotFound
  styles/     tokens.css (colors/type/spacing), base.css
```

`public/img` and `photos.generated.json` are build outputs and are git-ignored. Netlify runs `npm run build`, which regenerates them, and `public/_redirects` makes `/plog/<id>` deep links work.
