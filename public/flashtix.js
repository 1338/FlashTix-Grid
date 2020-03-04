// https://twitter.com/i/search/timeline?f=realtime&q=(@Shakira)&src=typd
var app = {
  scene: {
    last: false,
    switchTo: (target) => {
      let l = app.storage.getLastPage()
      let c = app.storage.getCurrentPage()
      if (c) {
        app.storage.setLastPage(c)
      }
      let response = ''
      if (document.getElementById(target)) {
        response = target
      } else {
        response = (l || 'home')
      }
      app.storage.setCurrentPage(response)
      if (l && response !== l) {
        if (l.includes('biopage')) {
          if (document.getElementById(l).getElementsByTagName('video').length !== 0) {
            app.storage.biopage.video.pause(document.getElementById(l).getElementsByTagName('video')[0])
          }
        }
      }
      window.location.hash = response
      if (response.includes('biopage')) {
        app.scene.biopage.loadTwitter(response.replace('biopage-', ''))
      }
    },
    onMenuClick: (e) => {
      app.scene.switchTo(e.target.hash.substring(1))
    },
    onBioClick: (e) => {
      app.scene.switchTo(e.srcElement.dataset.target)
    },
    onHashChange: () => {
      if (document.getElementById(location.hash.substring(1))) {
        app.scene.switchTo(location.hash.substring(1))
      }
    },
    biopage: {
      loadTwitter: (e) => {
        app.storage.getTweet(e)
        // if (!tweet) {
        //   console.log('dont have tweet from: ' + e)
        // } else {
        //   console.log(tweet)
        // }
      }
    }
  },
  storage: {
    lsSupport: false,
    ls: false,
    tweets: false,
    getTweet: (name) => {
      if (app.storage.lsSupport) {
        let tweets = app.storage.ls.getItem('tweets')
        if (tweets !== null) {
          console.log(tweets)
        }
        app.storage.asyncTwitter(name).then((data) => {
          let object = {
            `${name}`: data
          }
          app.storage.ls.setItem('tweets', JSON.stringify({`${name}`: data}))
        })
      }
      // we have to fetch

      return false
    },
    asyncTwitter: async (name) => {
      let response = await fetch(`/twitter`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({ screen_name: name }) // body data type must match "Content-Type" header
      })
      let data = await response.json()
      return data
    },
    getLastPage: () => { return (app.storage.lsSupport ? app.storage.ls.getItem('lastpage') : app.scene.last) },
    setLastPage: (newLast) => {
      if (document.getElementById(newLast)) {
        if (app.storage.lsSupport) {
          app.storage.ls.setItem('lastpage', newLast)
        } else {
          app.scene.last = newLast
        }
        document.getElementById(newLast).setAttribute('data-active', 0)
      }
    },
    getCurrentPage: () => { return (document.querySelector('[data-active="1"]') ? document.querySelector('[data-active="1"]').id : false) },
    setCurrentPage: (newCurrent) => {
      if (document.getElementById(newCurrent)) {
        document.getElementById(newCurrent).setAttribute('data-active', 1)
      }
    },
    hasUrlHash: () => { return (window.location.hash !== '' ? (document.getElementById(window.location.hash.substring(1)) ? window.location.hash.substring(1) : false) : false) },
    biopage: {
      video: {
        pause: (element) => {
          element.pause()
        }
      }
    }
  },
  cache: {
    install: () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
      }
    }
  },
  init: async () => {
    app.storage.lsSupport = !!window.localStorage &&
    typeof localStorage.getItem === 'function' &&
    typeof localStorage.setItem === 'function' &&
    typeof localStorage.removeItem === 'function'

    if (app.storage.lsSupport) {
      app.storage.ls = window.localStorage
    }
    let page = (app.storage.hasUrlHash() ? app.storage.hasUrlHash() : app.storage.getLastPage())
    if (!page) {
      page = 'home'
    }
    app.scene.switchTo(page)
    for (let i of document.getElementsByClassName('menu-link')) {
      i.addEventListener('click', app.scene.onMenuClick)
    }
    for (let i of document.getElementsByTagName('concert')) {
      i.addEventListener('click', app.scene.onBioClick)
    }
    app.cache.install()
    window.onhashchange = app.scene.onHashChange
  }
}
app.init()
