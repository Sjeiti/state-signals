/**
 * @typedef Slot {object}
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
 * @param listener {Function}
 * @returns {Slot}
 */
export function createSlot(listener, signal, once=false) {
  return Object.create(slotPrototype,{
    /**
     * @memberof Slot#
     * @type {Function}
     */
    _listener: {
      writable: false, value: listener
    },
    /**
     * @memberof Slot#
     * @type {Signal}
     */
    _signal: {
      writable: true, value: signal
    },
    /**
     * Listener can be executed only once
     * @memberof Slot#
     * @type {Signal}
     */
    once: {
      writable: false, value: once
    },
    /**
     * Slot is bound to a signal
     * @memberof Slot#
     * @type {Signal}
     */
    isBound: {
      get: function(){ return !!this._signal }
    }
  })
}