import React from 'react';
import './support-style';

export default ({number, type}) => {
  return (
    <div className="support">
      {[...Array(number)].map((x, i) =>
        <a key={ i }
          className="support__item"
          href={ `https://opencollective.com/webpack/${type}/${i}/website` } 
          target="_blank">
          <img 
            src={ `//opencollective.com/webpack/${type}/${i}/avatar` } 
            alt={ `${type} avatar` } />
        </a>
      )}
    </div>
  );
};
