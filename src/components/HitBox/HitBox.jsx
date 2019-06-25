import React, { Component } from 'react';

function htmlDecode (input) {
    //eslint-disable-next-line
    return input.replace(/[^a-z0-9\s]/gi, '').replace(/(gt)/gi, '');
  }

class HitBox extends Component {
    render() {
        const { hit } = this.props;
        return (
            <article className="hit-card">
            {
              hit && (
                <a target="_blank" rel="noopener noreferrer"
                  href={hit.repository && hit.repository.url ? hit.repository.url : `https://npmjs.com/package/${hit.name}`}>
                  <div className="product-wrapper">
                    <div className="product-summary">
                      <div className="product-title">
                        <h3>{hit.name}</h3> 
                      </div>
                      <div className="product-avatar">
                        <img src={hit.owner.avatar} height="40" width="40"/>
                      </div>
                    </div>
                    <div className="product-name">
                      <h3>{hit.owner.name}</h3>
                    </div>
                    <div className="product-desc">
                      <p>{ htmlDecode(hit.description) }</p>
                    </div>
                  </div>
                </a>
              ) 
            }
          </article>
        );
  }
}

export default HitBox;