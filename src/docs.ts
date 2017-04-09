declare var hljs: any;

const routeMap = {}
let currentPath = ''

function renderNav(navRoute) {
  fetch(`/api/v1/pages/${navRoute.pageUuid}/contents`)
    .then((data) => data.json())
    .then((page: any) => {
      let nav = document.getElementById('nav')
      nav.innerHTML = page.content

      nav.addEventListener('click', function(e) {
        e.preventDefault();
        const target: HTMLAnchorElement = e.target as HTMLAnchorElement;
        if (target.tagName == 'A') {
          loadPage(target.pathname);
        }
      })
    })
}

function loadPage(path: string, popped = false) {
  let route = routeMap[path]
  if (!route) {
    document.location.href = path
    return
  }
  // catch anchor tag
  if (currentPath == path) {
    return
  }

  currentPath = path
  fetch(`/api/v1/pages/${route.pageUuid}/contents`)
    .then((data) => data.json())
    .then((page: any) => {
      document.querySelector('.content__inner__body').innerHTML = page.content
    })
    .then(() => {
      let blocks = document.querySelectorAll('pre code')
      for (var i = 0; i < blocks.length; i++) {
        hljs.highlightBlock(blocks[i]);
      }
      generateTOC();
      if (!popped) {
        window.history.pushState(null, '', path)
      }
    })
}

function generateTOC() {
  let container = document.getElementById('toc');
  if (!container) {
    return
  }
  let headings = document.querySelectorAll('.content h2, .content h3');
  for (var i = 0; i < headings.length; i++) {
    let heading = headings[i];
    heading.id = `hh${i}`; // todo: hash the header or randomize somehow?
    let link = document.createElement('a')
    link.href = `#${heading.id}`
    link.innerHTML = heading.innerHTML
    let elem = document.createElement(heading.tagName)
    elem.appendChild(link)
    container.appendChild(elem)
  }
}

function init() {
  // Load route data and and store a mapping from the route path to the route.
  // Then load the rendered nav page.
  fetch('/api/v1/routes')
    .then((data) => data.json())
    .then((data: any) => {
      data.routes.forEach((route) => {
        routeMap[route.path] = route
      })
      renderNav(routeMap['/nav'])
    })

  // add addIFrameListeners as an onload callback for the nav iframe.
  window['addIFrameListeners'] = () => {
    const iframe = document.getElementsByTagName('iframe')[0];
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.getElementById('nav').addEventListener('click', function(e: any) {
      e.preventDefault();
      if (e.target.tagName == 'A') {
        loadPage(e.target.pathname);
      }
    });
  }

  window.addEventListener('popstate', () => {
    loadPage(window.location.pathname, true);
  });
}


document.addEventListener('DOMContentLoaded', () => {
  init()
  generateTOC()
})