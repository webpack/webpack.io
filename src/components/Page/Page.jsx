import React from 'react';
import Interactive from 'antwar-interactive';
import Container from '../Container/Container';
import Sidebar from '../Sidebar/Sidebar';
import PageLinks from '../PageLinks/PageLinks';
import Gitter from '../Gitter/Gitter';
import Contributors from '../Contributors/Contributors';
import Sponsors from '../Sponsors/Sponsors';
import './Page.scss';
import '../Sidebar/Sidebar.scss';
import '../Sponsors/Sponsors.scss';
import '../Gitter/Gitter.scss';

const Page = ({ page, section }) => {
  let { contributors, title, related } = page.file.attributes;
  let indexPage = section.title !== 'Home' ? require(`page-loader!../../content/${section.name}/index.md`) : null;
  let pages = (
    section.pages()
      .sort((a, b) => a.file.attributes.sort - b.file.attributes.sort)
      .map(page => ({
        url: page.url,
        title: page.file.attributes.title,
        anchors: page.file.attributes.anchors
      }))
  );

  // TODO: This hack adds the index page to the array
  // Ideally this would be resolved at the antwar/build level
  // Index pages should just be treated normally
  if (indexPage) {
    pages.unshift({
      url: `/${section.name}/`,
      title: indexPage.attributes.title,
      anchors: indexPage.attributes.anchors
    });
  }

  return (
    <Container className="page">
      <Sponsors />
      <Interactive
        id="src/components/Sidebar/Sidebar.jsx"
        component={ Sidebar }
        pages={ pages }
        currentPage={ page.url.replace('/index', '') } />

      <section className="page__content">
        <h1>{ title }</h1>

        <PageLinks
          page={ page }
          section={ section.name } />

        <div dangerouslySetInnerHTML={{ __html: page.file.body }} />

        { related.length > 0 && (
          <div>
            <hr />
            <h3>Further Reading</h3>
            <ul>
              {
                related.map((link, index) => (
                  <li key={ index }>
                    <a href={ link.url }>
                      { link.title }
                    </a>
                  </li>
                ))
              }
            </ul>
          </div>
        )}

        { contributors.length > 0 && (
          <div>
            <hr />
            <h3>Contributors</h3>
            <Contributors contributors={ contributors } />
          </div>
        )}

        <Interactive
          id="src/components/Gitter/Gitter.jsx"
          component={ Gitter } />
      </section>
    </Container>
  );
};

export default Page;
