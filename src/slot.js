/**
 * A slot used in a signal
 * Contains the listener function and a reference to the related signal
 * @namespace Slot
 */
const slotPrototype = {
  /**
   * Remove signal listener
   * @memberof Slot#
   * @returns {Slot}
   */
  remove() {
    if (this._signal) {
      const {_slots} = this._signal
      const slotIndex = _slots.indexOf(this)
      if (slotIndex!==-1) {
        _slots.splice(slotIndex,1)
        this._signal = null
      }
    }
    return this
  }
}

/**
 * Factory method to create a slot
 * @param {Function} listener
 * @param {Signal} signal
 * @param {boolean} [once=false]
 * @returns {Slot}
 */
export function createSlot(listener, signal, once=false) {
  return Object.create(slotPrototype,{
    /**
     * @memberof Slot#
     * @type {Function}
     * @private
     */
    _listener: {
      writable: false, value: listener
    },
    /**
     * @memberof Slot#
     * @type {Signal}
     * @private
     */
    _signal: {
      writable: true, value: signal
    },
    /**
     * Listener can be executed only once
     * @memberof Slot#
     * @type {boolean}
     */
    once: {
      writable: false, value: once
    },
    /**
     * Slot is bound to a signal
     * @memberof Slot#
     * @type {boolean}
     */
    isBound: {
      get: function(){ return !!this._signal }
    }
  })
}