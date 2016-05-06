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

  getInitialState() {
    return {
      pulse: false,
      count: 0,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    }
  },

  renderWelcomeMessage() {
    return (
      <div>
        <h4>Welcome to <em>Lux Venit</em></h4>
        <p>You are now part of an audience participation color projector!</p>
        <p>Hold out your phone so that you can see both the piano and your phone.</p>
        <p>Enjoy...</p>
      </div>
    );
  },

  startPulse(ev) {
    let { width, height } = ev.target.getBoundingClientRect();
    let y = ev.changedTouches ? ev.changedTouches[0].clientY : ev.clientY;

    if (y <= (height / 2)) {
      let count = 0;
      let intervalId = setInterval(() => {
        count += 0.25;

        let left = Math.round(Math.random() * 20 - 10) + count;
        let right = Math.round(Math.random() * 20 - 10) + count;
        let top = Math.round(Math.random() * 20 - 10) + count;
        let bottom = Math.round(Math.random() * 20 - 10) + count;

        this.setState({ left, right, top, bottom });
      }, 32);

      this.setState({ intervalId });
    } else {
      this.setState({ pulse: true });
    }
  },

  stopPulse() {
    clearInterval(this.state.intervalId);
    this.setState({ 
      pulse: false,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      intervalId: null,
    });
  },

  render() {
    let { pulse, count, left, right, top, bottom } = this.state;
    let { rgba, fadeTime } = this.props.color;
    let [r, g, b] = rgba;

    let style = {
      backgroundColor: `rgba(${r},${g},${b},1)`,
      transitionProperty: 'background-color',
      transitionDuration: `${fadeTime}ms`,
      transitionTimingFunction: 'ease',
      position: 'absolute',
      top,
      right,
      left,
      bottom,
      overflowY: 'auto',
    };

    let pulseStyle = {
      backgroundColor: pulse ? 'rgba(255, 255, 255, 0.45)' : 'transparent',
      transitionProperty: 'background-color',
      transitionDuration: pulse ? '0ms' : '300ms',
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
        <div style={{ color: 'white', userSelect: 'none' }}>
          {
            fadeTime < 0
            ? this.renderWelcomeMessage()
            : ''
          }
        </div>
        <div 
          style={pulseStyle}
          onMouseDown={this.startPulse}
          onMouseUp={this.stopPulse}
          onTouchStart={this.startPulse}
          onTouchEnd={this.stopPulse}
        >
        </div>
      </div>
    )
  }
})