import React from 'react';
import LanguageIcon from '../../assets/language-icon.svg';

export default class Dropdown extends React.Component {
  state = {
    active: false
  };

  render() {
    let { className = '', items = [] } = this.props;
    let activeMod = this.state.active ? "dropdown__list--active" : "";

    return (
      <div
        tabIndex="0"
        className={ `dropdown ${className}` }
        onMouseOver={ this._toggle.bind(this, true) }
        onMouseLeave={ this._toggle.bind(this, false) }>
        <img
          className="dropdown__language"
          alt="select language"
          src={ LanguageIcon } />
        {/* Commented out until media breakpoints are in place
        <span>{ items[0].title }</span> */}
        <i aria-hidden="true" className="dropdown__arrow" />

        <div className={ `dropdown__list ${activeMod}` }>
          <ul>
            {
              items.map(item => {
                return (
                  <li key={ item.title }>
                    <a href={ item.url }>
                      <span>{ item.title }</span>
                    </a>
                  </li>
                );
              })
            }
          </ul>
        </div>
      </div>
    );
  }

  /**
   * Toggle visibility of dropdown items
   *
   * @param {bool} state - Whether to display or hide the items
   */
  _toggle(state = false) {
    this.setState({
      active: state
    });
  }
}
