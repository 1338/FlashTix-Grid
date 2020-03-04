self.addEventListener('install', (event) => {
  async function buildCache () {
    const cache = await caches.open('flashtix')
    return cache.addAll([
      '/style.css',
      '/flashtix.js',
      '/tweet.css',
      '/'
    ])
  }
  event.waitUntil(buildCache())
})

self.addEventListener('fetch', function (event) {
  if (event.request.url.indexOf('/twitter') !== -1) {
    return false
  }
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          return response
        }

        return fetch(event.request).then(
          function (response) {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone()

            caches.open('flashtix')
              .then(function (cache) {
                cache.put(event.request, responseToCache)
              })

            return response
          }
        )
      })
  )
})
