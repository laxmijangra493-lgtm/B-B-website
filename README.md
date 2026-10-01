# B&B Brew & Brunch — Just for fun 

A single-page, mobile-first café website concept for B&B Brew & Brunch in C-Scheme, Jaipur.

## What is in this version

- Palette directly adapted from the supplied reference: `#671F1F`, `#FF842C`, `#F2EFE5`, `#FCD062`, `#2B76A4`.
- Real public listing photographs from B&B pages on Zomato and Swiggy Dineout (used here as demo imagery). For a paid production handover, replace these with owner-approved originals.
- Functional menu filters. Every menu card links to the live Zomato menu.
- Dedicated Zomato + Swiggy ordering actions.
- Click-to-open gallery lightbox with keyboard arrows, previous/next controls, and a live Zomato gallery link.
- Google Maps embed using the supplied Google Maps location plus an "Open in Google Maps" action.
- Review carousel using short excerpts from recent public Zomato reviews, plus a live "Read reviews" link.
- Review form: wired as a Netlify Form for real collection after deployment to Netlify; on local/file demos it saves the submission in browser localStorage and confirms the fallback.
- Motion: cinematic image zoom, scroll reveals, floating hand-drawn cup, preloader steam, magnetic CTAs, hover motion, review auto-rotation, scroll progress, and reduced-motion fallback.
- Mobile bottom action bar for Book / Order / Directions.

## Run locally

No build step is required.

1. Open `index.html` directly, or run a small static server from this folder:

```bash
python3 -m http.server 8000
```

2. Visit `http://localhost:8000`.

## Production note

The demo intentionally uses live CDN image URLs so the preview uses real B&B imagery. Before the client launch, obtain permission / owner-provided photo assets and self-host the approved images for reliability and rights control.

## Public sources referenced during the build

- Zomato listing: https://www.zomato.com/jaipur/b-b-brew-and-brunch-1-c-scheme
- Zomato menu: https://www.zomato.com/jaipur/b-b-brew-and-brunch-1-c-scheme/menu
- Zomato photos: https://www.zomato.com/jaipur/b-b-brew-and-brunch-1-c-scheme/photos
- Zomato reviews: https://www.zomato.com/jaipur/b-b-brew-and-brunch-1-c-scheme/reviews
- Swiggy Dineout: https://www.swiggy.com/restaurants/jaipur/c-scheme/b-b-brew-and-brunch-655741/dineout
- Swiggy ordering page: https://www.swiggy.com/city/jaipur/brew-and-brunch-ashok-nagar-c-scheme-rest655741
- Google Maps location supplied for the demo: https://maps.app.goo.gl/UWD9fva5acjDUG2U9
- Instagram: https://www.instagram.com/brew_and_brunch_jaipur/
- Table booking: https://www.district.in/dining/jaipur/b-b-brew-and-brunch-1-c-scheme
