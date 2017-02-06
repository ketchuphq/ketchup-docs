const routeMap = {}
fetch('/api/v1/routes')
  .then(data => data.json())
  .then((data: any) => {
    data.routes.forEach((route) => {
      routeMap[route.path] = route
    })
  })

function loadPage(path: string) {
  let route = routeMap[path]
  if (!route) {
    document.location.href = path
    return
  }
  fetch(`/api/v1/pages/${route.pageUuid}/contents`)
    .then(data => data.json())
    .then((page: any) => {
      document.querySelector(".content--inner > h1").innerHTML = page.title
      document.querySelector('.content--body').innerHTML = page.content
    })
    .then(() => {
      window.history.pushState(null, '', path)
    })
}

window['addIFrameListeners'] = () => {
  const iframe = document.getElementsByTagName("iframe")[0];
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.getElementById("nav").addEventListener('click', function (e) {
    e.preventDefault();
    const target: HTMLAnchorElement = e.target as HTMLAnchorElement;
    loadPage(target.pathname);
  });
}

window.addEventListener('popstate', () => {
  window.location.reload();
});
