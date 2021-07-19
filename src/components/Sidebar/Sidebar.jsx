// Import External Dependencies
import SidebarItem from '../SidebarItem/SidebarItem';
import Print from '../Print/Print';
import PropTypes from 'prop-types';

// Load Styling
import './Sidebar.scss';
import { useEffect, useState } from 'react';

import DownIcon from '../../styles/icons/chevron-down.svg';
import LoadingIcon from '../../styles/icons/loading.svg';

const versions = [5, 4];
const currentDocsVersion = 5;

const excludedPages = ['/webpack/options/'];

Sidebar.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array,
  currentPage: PropTypes.string,
};
// Create and export the component
export default function Sidebar({ className = '', pages, currentPage }) {
  const [version, setVersion] = useState(currentDocsVersion);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (version === currentDocsVersion) return;
    const href = window.location.href;
    const url = new URL(href);
    url.hostname = `v${version}.webpack.js.org`;

    // redirect
    window.location.href = url.href;
  }, [version]);
  let group;

  return (
    <nav className={`sidebar ${className}`}>
      <div className="sidebar__inner">
        <div className="relative z-0 bg-white dark:bg-gray-100 ">
          <select
            className="text-gray-600 text-14 px-5 py-5 appearance-none box-border border border-gray-200 border-solid flex-col flex w-full rounded-none bg-transparent bg-none"
            value={version}
            onChange={(e) => {
              setVersion(+e.target.value);
              if (+e.target.value !== currentDocsVersion) {
                setLoading(true);
              }
            }}
          >
            {versions.map((version) => (
              <option key={version} value={version}>
                Webpack {version}
              </option>
            ))}
          </select>
          {loading ? (
            <LoadingIcon
              className="absolute right-5 top-5 fill-current text-gray-300 z-[-1]"
              width={20}
              height={20}
            />
          ) : (
            <DownIcon
              className="absolute right-5 top-5 fill-current text-gray-300 z-[-1]"
              width={20}
              height={20}
            />
          )}
        </div>
        <Print url={currentPage} />

        {pages
          .filter((page) => excludedPages.includes(page.url) === false)
          .map((page, index) => {
            let displayGroup = group !== page.group && page.group !== '-';
            group = page.group;

            return (
              <div key={page.url}>
                {displayGroup ? (
                  <h4 className="sidebar__group">{group}</h4>
                ) : null}

                <SidebarItem
                  index={index}
                  url={page.url}
                  title={page.title}
                  anchors={page.anchors}
                  currentPage={currentPage}
                />
              </div>
            );
          })}
      </div>
    </nav>
  );
}
