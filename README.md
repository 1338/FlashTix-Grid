# FlashTix-Grid
Final frontend project with service worker and nodejs (no jQuery)

## Why?
Cause I can!

## Status

### TO-DO

 * Twitter API implementation (jQuery's plugin was with the old API, just recently got access to the API specifically for this project)
 * Googe Maps for pinning the concerts
 * Check-out (orders)

### Finished

 * scene switcher (emulating the multiple pages in one document functionality)
 * Service worker (for caching, so it everything except fetching new tweets will work offline)
 * Responsive video player (scene switcher pauses video playback when you switch to another page)
 * Manifest so it can be installed as an web app on mobile

## How to run
In the root directory install deps:
`npm i esm`
Then run it via:
`node server.js`
