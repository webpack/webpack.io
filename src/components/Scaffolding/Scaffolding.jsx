import React, { Component } from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Configure,
} from 'react-instantsearch-dom';

import HitBox from '../HitBox/HitBox';
import './Scaffolding.scss';

const searchClient = algoliasearch(
  'OFCNCOG2CU',
  '77db8c6516725ef60b8a60223155f7ad'
);

export default class Scaffolding extends Component {
  render() {
     return (
      <div>
        <InstantSearch searchClient={searchClient} indexName="npm-search">
          <Configure
            filters="computedKeywords:webpack-scaffold"
            hitsPerPage={16}
            analyticsTags={['webpack-scaffold']}
          />
          <div className="search-wrapper">
            <SearchBox />
          </div>
          <div className="hits-wrapper">
              <Hits hitComponent={HitBox} />
          </div>
        </InstantSearch>
      </div>
    );
  }
}
