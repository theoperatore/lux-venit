'use strict';

import React from 'react';

export default React.createClass({
  displayName: 'App',

  propTypes: {
    color: React.PropTypes.shape({
      rgba: React.PropTypes.array.isRequired,
      fadeTime: React.PropTypes.number.isRequired,
    }).isRequired
  },

  render() {
    let { rgba, fadeTime } = this.props.color;
    let [r, g, b] = rgba;

    let style = {
      backgroundColor: `rgba(${r},${g},${b},1)`,
      transition: `background-color ${fadeTime}ms ease`,
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0
    }

    return <div style={style}></div>
  }
})