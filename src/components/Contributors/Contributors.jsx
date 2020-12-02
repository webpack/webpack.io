import { Component } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import SmallIcon from '../../assets/icon-square-small-slack.png';
import './Contributors.scss';
import PropTypes from 'prop-types';

export default class Contributors extends Component {
  static propTypes = {
    contributors: PropTypes.array
  }
  state = {
    inView: false
  }

  handleInView = (inView) => {
    if (!inView) {
      return;
    }
    this.setState({ inView });
  }

  render() {
    const { inView } = this.state;
    const { contributors } = this.props;

    if (!contributors.length) {
      return <noscript />;
    }

    return (
      <VisibilitySensor delayedCall
        partialVisibility
        intervalDelay={ 300 }
        onChange={ this.handleInView }>
        <div className="contributors">
          <div className="contributors__list">
            {
              contributors.map(contributor => (
                <a key={ contributor }
                  className="contributor"
                  href={ `https://github.com/${contributor}` }>
                  <img alt={ contributor }
                    src={ inView ? `https://github.com/${contributor}.png?size=90` : SmallIcon } />
                  <span className="contributor__name"> {contributor}</span>
                </a>
              ))
            }
          </div>
        </div>
      </VisibilitySensor>
    );
  }
}
