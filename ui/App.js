'use strict';

import React from 'react';

export default React.createClass({
  displayName: 'App',

  propTypes: {
    color: React.PropTypes.array.isRequired
  },

  render() {
    let [r, g, b, a] = this.props.color;

    let style = {
      backgroundColor: `rgba(${r},${g},${b},${a})`,
      transition: 'background-color 500ms ease',
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0
    }

    return <div style={style}></div>
  }
})