// Import External Dependencies
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { hot as Hot } from 'react-hot-loader';

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
import Vote from '../Vote/Vote';

// Load Styling
import '../../styles/index';
import '../../styles/icon.font.js';
import './Site.scss';

// Load Content Tree
import Content from '../../_content.json';

class Site extends React.Component {
  state = {
    mobileSidebarOpen: false
  }

  render() {
    let { location } = this.props;
    let { mobileSidebarOpen } = this.state;
    let sections = this._sections;
    let section = sections.find(({ url }) => location.pathname.startsWith(url));

    return (
      <div className="site">
        <NotificationBar />

        <Navigation
          pathname={ location.pathname }
          toggleSidebar={ this._toggleSidebar }
          links={[
            {
              content: 'Documentation',
              url: '/concepts',
              isActive: url => /^\/(api|concepts|configuration|guides|loaders|plugins)/.test(url),
              children: this._strip(
                sections.filter(item => item.name !== 'contribute')
              )
            },
            { content: 'Contribute', url: '/contribute' },
            { content: 'Vote', url: '/vote' },
            { content: 'Blog', url: 'https://medium.com/webpack' }
          ]} />

        { window.document !== undefined ? (
          <SidebarMobile
            open={ mobileSidebarOpen }
            sections={ this._strip(Content.children) } />
        ) : null }

          <Switch>
            <Route
              path="/"
              exact
              component={ Splash } />
            <Route
              render={ props => (
                <Container className="site__content">
                  <Switch>
                    { this._pages.map(page => (
                      <Route
                        key={ page.url }
                        exact={ true }
                        path={ page.url }
                        render={ props => {
                          let path = page.path.replace('src/content/', '');
                          let content = this.props.import(path);

                          return (
                            <React.Fragment>
                              <Sponsors />
                              <Sidebar
                                className="site__sidebar"
                                currentPage={ location.pathname }
                                pages={ this._strip(section ? section.children : Content.children.filter(item => (
                                  item.type !== 'directory' &&
                                  item.url !== '/'
                                ))) } />
                              <Page
                                { ...page }
                                content={ content } />
                            </React.Fragment>
                          );
                        }} />
                    ))}
                    <Route
                      path="/vote"
                      component={ Vote } />
                    <Route render={ props => (
                      '404 Not Found'
                    )} />
                  </Switch>
                </Container>
              )} />
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
  }

  /**
   * Flatten an array of `Content` items
   *
   * @param  {array} array - ...
   * @return {array}       - ...
   */
  _flatten = array => {
    return array.reduce((flat, item) => {
      return flat.concat(
        Array.isArray(item.children) ? this._flatten(item.children) : item
      );
    }, []);
  }

  /**
   * Strip any non-applicable properties
   *
   * @param  {array} array - ...
   * @return {array}       - ...
   */
  _strip = array => {
    return array.map(({ title, name, url, group, sort, anchors, children }) => ({
      title: title || name,
      content: title || name,
      url,
      group,
      sort,
      anchors,
      children: children ? this._strip(children) : []
    }));
  }

  /**
   * Get top-level sections
   *
   * @return {array} - ...
   */
  get _sections() {
    return Content.children.filter(item => (
      item.type === 'directory'
    ));
  }

  /**
   * Get all markdown pages
   *
   * @return {array} - ...
   */
  get _pages() {
    return this._flatten(Content.children).filter(item => {
      return item.extension === '.md';
    });
  }
}

export default Hot(module)(Site);
