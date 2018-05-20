declare var hljs: any;
import * as m from 'mithril';
import {ClassComponent, CVnode, VnodeDOM} from 'mithril';

interface Page {
  content: string;
}

interface ContentAttrs {
  page: Page;
}

let initialContent: Page;

class ContentComponent implements ClassComponent<ContentAttrs> {
  onupdate(vnode: VnodeDOM<ContentAttrs, this>) {
    if (!vnode.dom) {
      return;
    }
    let blocks = vnode.dom.querySelectorAll('pre code');
    for (var i = 0; i < blocks.length; i++) {
      hljs.highlightBlock(blocks[i]);
    }
  }

  parse(content: string) {
    let d = document.createElement('div');
    d.innerHTML = content;
    let container = d.querySelector('#toc');
    if (container) {
      let headings = d.querySelectorAll('h2, h3');
      for (let i = 0; i < headings.length; i++) {
        let heading = headings[i];
        heading.id = `hh${i}`; // todo: hash the header or randomize somehow?
        let link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.innerHTML = heading.innerHTML;
        let elem = document.createElement(heading.tagName);
        elem.appendChild(link);
        container.appendChild(elem);
      }
    }
    return m.trust(d.innerHTML);
  }

  view(vnode: CVnode<ContentAttrs>) {
    let page = vnode.attrs.page || initialContent;
    return m('.content__inner__body', this.parse(page.content));
  }
}

class AppComponent implements ClassComponent<void> {
  showMobileNav: boolean;
  navPage: {content: string};
  currentPath: string;
  currentPage: {content: string};
  routes: {[key: string]: any};

  constructor() {
    this.routes = {};
    this.showMobileNav = false;
    fetch('/api/v1/routes')
      .then((data) => data.json())
      .then((data: any) => {
        data.routes.forEach((route) => {
          this.routes[route.path] = route;
        });
        this.renderNav(this.routes['/nav']);
      })
      .then(() => this.loadPage(window.location.pathname));

    window.addEventListener('popstate', () => {
      this.loadPage(window.location.pathname, true);
    });
  }

  renderNav(navRoute) {
    return fetch(`/api/v1/pages/${navRoute.pageUuid}/contents`)
      .then((data) => data.json())
      .then((page: any) => {
        this.navPage = page;
        m.redraw();
      });
  }

  loadPage(path: string, popped = false) {
    let route = this.routes[path];
    if (!route) {
      document.location.href = path;
      return;
    }
    this.showMobileNav = false;
    this.currentPath = path;
    fetch(`/api/v1/pages/${route.pageUuid}/contents`)
      .then((data) => data.json())
      .then((page: any) => {
        this.currentPage = page;
        m.redraw();
        if (!popped) {
          window.history.pushState(null, '', path);
        }
      });
  }

  handleNavClick = (e: MouseEvent & {target: HTMLAnchorElement}) => {
    e.preventDefault();
    if (e.target.tagName.toLowerCase() == 'a') {
      this.loadPage(e.target.pathname);
    }
  };

  toggleNav = () => {
    this.showMobileNav = !this.showMobileNav;
    m.redraw();
  };

  view() {
    return m('#app', [
      m(
        '.mobile-hamburger',
        {class: this.showMobileNav ? 'hidden' : ''},
        m('a', {onclick: this.toggleNav}, 'Menu')
      ),
      m('.navigation', {class: this.showMobileNav ? 'navigation-mobile' : ''}, [
        m('.navigation-close', m('a', {onclick: this.toggleNav}, m.trust('&times;'))),
        m(
          '#nav',
          {
            onclick: this.handleNavClick,
          },
          this.navPage ? m.trust(this.navPage.content) : ''
        ),
      ]),
      m('.content', m('.content__inner', m(ContentComponent, {page: this.currentPage}))),
      m('.right-pad'),
    ]);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let root = document.getElementById('app-container');
  initialContent = {
    content: document.querySelector('.content__inner__body').innerHTML,
  };
  m.mount(root, AppComponent);
});
