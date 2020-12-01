// Import External Dependencies
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import DocumentTitle from 'react-document-title';

// Import Utilities
import { extractPages, extractSections, getPageTitle } from '../../utilities/content-utils';
import isClient from '../../utilities/is-client';
import getAdjacentPages from '../../utilities/get-adjacent-pages';

// Import Components
import NotificationBar from '../NotificationBar/NotificationBar';
import Navigation from '../Navigation/Navigation';
import SidebarMobile from '../SidebarMobile/SidebarMobile';
import Container from '../Container/Container';
import Splash from '../Splash/Splash';
import Sponsors from '../Sponsors/Sponsors';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import Page from '../Page/Page';
import PageNotFound from '../PageNotFound/PageNotFound';
import Gitter from '../Gitter/Gitter';
import Vote from '../Vote/Vote';
import Organization from '../Organization/Organization';
import StarterKits from '../StarterKits/StarterKits';

// Load Styling
import '../../styles/index';
import './Site.scss';

// Load Content Tree
import Content from '../../_content.json';

if (isClient) {
  if (process.env.NODE_ENV === 'production') { // only register sw.js in production
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }
}

class Site extends React.Component {
  state = {
    mobileSidebarOpen: false
  };

  render() {
    let { location } = this.props;
    let { mobileSidebarOpen } = this.state;
    let sections = extractSections(Content);
    let section = sections.find(({ url }) => location.pathname.startsWith(url));
    let pages = extractPages(Content);
    const sidebarPages = this._strip(
      section
        ? section.children
        : Content.children.filter(
            item => item.type !== 'directory' && item.url !== '/'
          )
    );
    return (
      <div className="site">
        <DocumentTitle title={getPageTitle(Content, location.pathname)} />
        <div className="site__header">
          <NotificationBar />
          <Navigation
          pathname={location.pathname}
          toggleSidebar={this._toggleSidebar}
          links={[
            {
              content: 'Documentation',
              url: '/concepts/',
              isActive: url => /^\/(api|concepts|configuration|guides|loaders|migrate|plugins|resources)/.test(url),
              children: this._strip(sections.filter(item => item.name !== 'contribute'))
            },
            { content: 'Contribute', url: '/contribute/' },
            { content: 'Vote', url: '/vote/' },
            { content: 'Blog', url: '/blog/' }
          ]}
          />
        </div>

        {isClient ? <SidebarMobile
          isOpen={mobileSidebarOpen}
          sections={this._strip(Content.children)}
          toggle={this._toggleSidebar} /> : null}

        <Switch>
          <Route exact strict path="/:url*" render={props => <Redirect to={`${props.location.pathname}/`}/>} />
          <Route path="/" exact component={Splash} />
          <Route
            render={props => (
              <Container className="site__content">
                <Switch>
                  <Route path="/vote" component={Vote} />
                  <Route path="/organization" component={Organization} />
                  <Route path="/starter-kits" component={StarterKits} />
                  <Route path="/app-shell" component={() => <React.Fragment />} />
                  {pages.map(page => (
                    <Route
                      key={page.url}
                      exact={true}
                      path={page.url}
                      render={props => {
                        let path = page.path.replace('src/content/', '');
                        let content = this.props.import(path);
                        const { previous, next } = getAdjacentPages(
                          sidebarPages,
                          page,
                          'url'
                        );
                        return (
                          <React.Fragment>
                            <Sponsors />
                            <Sidebar
                              className="site__sidebar"
                              currentPage={location.pathname}
                              pages={sidebarPages}
                            />
                            <Page
                              {...page}
                              content={content}
                              previous={previous}
                              next={next}
                            />
                            <Gitter />
                          </React.Fragment>
                        );
                      }}
                    />
                  ))}
                  <Route render={props => <PageNotFound />} />
                </Switch>
              </Container>
            )}
          />
        </Switch>
        <Footer />
      </div>
    );
  }

  /**
   * Toggle the mobile sidebar
   *
   * @param {boolean} open - Indicates whether the menu should be open or closed
   */
  _toggleSidebar = (open = !this.state.mobileSidebarOpen) => {
    this.setState({
      mobileSidebarOpen: open
    });
  };

  /**
   * Strip any non-applicable properties
   *
   * @param  {array} array - ...
   * @return {array}       - ...
   */
  _strip = array => {
    let anchorTitleIndex = array.findIndex(item => item.name.toLowerCase() === 'index.md');

    if (anchorTitleIndex !== -1) {
      array.unshift(array[anchorTitleIndex]);

      array.splice(anchorTitleIndex + 1, 1);
    }

    return array.map(({ title, name, url, group, sort, anchors, children }) => ({
      title: title || name,
      content: title || name,
      url,
      group,
      sort,
      anchors,
      children: children ? this._strip(children) : []
    })).filter(page => (page.title !== 'printable.md' && !page.content.includes('Printable')));
  };
}

export default Site;
