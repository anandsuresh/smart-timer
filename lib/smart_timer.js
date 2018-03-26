/**
 * @file An implementation of a smart timer
 *
 * @author Anand Suresh <anandsuresh@gmail.com>
 * @copyright Copyright (C) 2018-present Anand Suresh. All rights reserved.
 */

/**
 * A smart timer is designed to check for timeout conditions at specified time
 * intervals. The down-side of this approach is that the timeout handler may be
 * fired at most `interval` milliseconds after the actual timeout.
 *
 * @type {SmartTimer}
 */
class SmartTimer {
  /**
   *
   * @param {Function} onTimeout Timeout event handler
   * @param {Object} [props] Properties of the smart timer
   * @param {Number} [props.timeout=2000] The timeout for the timer (ms)
   * @param {Number} [props.interval=200] Interval between checks for timeouts (ms)
   * @returns {SmartTimer}
   */
  constructor (onTimeout, props) {
    if (typeof onTimeout !== 'function') {
      throw new TypeError(`timer timeout handler is a(n) ${typeof onTimeout}!`)
    }

    const {interval, timeout} = props = Object.assign({
      interval: 200,
      timeout: 2000
    }, props)

    if (interval > timeout) {
      throw new Error(`timer interval (${interval}ms) exceeds timeout (${timeout}ms)!`)
    }

    this._props = Object.assign({}, props, {
      destroyed: false,
      hadActivity: false,
      intervalTimer: setInterval(() => this._onInterval(), interval),
      lastActivity: Date.now(),
      onTimeout: onTimeout,
      timeoutTimer: setTimeout(() => this._onTimeout(), timeout)
    })
  }

  /**
   * Returns the timer check interval
   * @name {SmartTimer#interval}
   * @type {Number}
   */
  get interval () {
    return this._props.interval
  }

  /**
   * Returns the timer timeout
   * @name {SmartTimer#timeout}
   * @type {Number}
   */
  get timeout () {
    return this._props.timeout
  }

  /**
   * Touches the timer to indicate activity
   */
  touch () {
    const props = this._props
    if (props.destroyed) {
      throw new Error(`timer has already been destroyed!`)
    }
    props.hadActivity = true
  }

  /**
   * Destroys the timer instance
   */
  destroy () {
    const props = this._props

    if (props.timeoutTimer !== null) {
      clearTimeout(props.timeoutTimer)
      props.timeoutTimer = null
    }

    if (props.intervalTimer !== null) {
      clearInterval(props.intervalTimer)
      props.intervalTimer = null
    }

    props.destroyed = true
  }

  /**
   * Handles the interval timer
   */
  _onInterval () {
    const props = this._props

    if (props.hadActivity) {
      props.lastActivity = Date.now()
      props.hadActivity = false
    }
  }

  /**
   * Handles the timeout timer
   */
  _onTimeout () {
    // Call this._onInterval() to account for any activity that might have
    // occurred since the last interval check and the expiry of the timer
    this._onInterval()

    const props = this._props
    const timeSinceLastActivity = Date.now() - props.lastActivity

    if (timeSinceLastActivity < props.timeout) {
      const timeout = props.timeout - timeSinceLastActivity
      props.timeoutTimer = setTimeout(() => this._onTimeout(), timeout)
      return
    }

    this.destroy()
    props.onTimeout(timeSinceLastActivity)
  }
}

/**
 * Creates a SmartTimer instance
 *
 * @param {Function} onTimeout Function to execute upon timeout
 * @param {Object} [props] Properties of the smart timer
 * @param {Number} [props.timeout=2000] The timeout for the timer (ms)
 * @param {Number} [props.interval=2000] Interval between checks for timeouts (ms)
 * @returns {SmartTimer}
 */
function create (onTimeout, props) {
  return new SmartTimer(onTimeout, props)
}

/**
 * Export the interface
 * @type {Object}
 */
module.exports = {create}
