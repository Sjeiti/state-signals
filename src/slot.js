/**
 * @typedef Slot {object}
 */
const slotPrototype = {
  /**
   * Remove signal listener
   * @memberof Slot#
   */
  remove() {
    const {_slots} = this._signal
    const slotIndex = _slots.indexOf(this)
    if (slotIndex!== -1) _slots.splice(slotIndex,1)
  }
}

/**
 * Factory method to create a slot
 * @param callback {Function}
 * @return {Slot}
 */
export function createSlot(callback,signal) {
  return Object.create(slotPrototype,{
    /**
     * @memberof Slot#
     * @type {Function}
     */
    _callback: {
      writable: false,value: callback
    },/**
     * @memberof Slot#
     * @type {Signal}
     */
    _signal: {
      writable: true,value: signal
    }
  })
}