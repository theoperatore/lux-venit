'use strict';

import React from 'react';

export default React.createClass({
  displayName: 'App',

  propTypes: {
    color: React.PropTypes.shape({
      rgba: React.PropTypes.array.isRequired,
      fadeTime: React.PropTypes.number.isRequired,
    }).isRequired,
  },

  renderWelcomeMessage() {
    return (
      <div>
        <h4>Welcome!</h4>
        <h4>You are conneced to <em>Lux Venit</em></h4>
        <p>You are now part of an audience participation color projector!</p>
        <p>For ultimate enjoyment:</p>
        <ul>
          <li>Turn up your screen brightness</li>
          <li>Turn your screen sideways</li>
          <li>Put the screen where you and everyone can see it</li>
        </ul>
        <br />
        <p>Enjoy...</p>
      </div>
    );
  },

  render() {
    let { rgba, fadeTime } = this.props.color;
    let [r, g, b] = rgba;

    let style = {
      backgroundColor: `rgba(${r},${g},${b},1)`,
      transitionProperty: 'background-color',
      transitionDuration: `${fadeTime}ms`,
      transitionTimingFunction: 'ease',
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      overflowY: 'auto',
    };

    return (
      <div style={style}>
        <div style={{ color: 'white' }}>
          {
            fadeTime < 0
            ? this.renderWelcomeMessage()
            : ''
          }
        </div>
      </div>
    )
  }
})