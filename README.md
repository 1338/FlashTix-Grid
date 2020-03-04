# FlashTix-Grid
Final frontend project with service worker and nodejs (no jQuery)

## Why?
Cause I can!

## Status

### TO-DO

 * Twitter API implementation (jQuery's plugin was with the old API, just recently got access to the API specifically for this project)
 * Googe Maps (for locations of concerts)
 * Check-out (orders)
 * Agenda

### Finished

 * scene switcher (emulating the multiple pages in one document functionality)
 * Service worker (for caching, so it everything except fetching new tweets will work offline)
 * Responsive video player (scene switcher pauses video playback when you switch to another page)
 * Manifest so it can be installed as an web app on mobile

## How to run
In the root directory install deps:
```bash
npm i
```
Then run it via:
```bash
node server.js
```
