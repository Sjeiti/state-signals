import {createSlot} from './slot'
import {createSignal} from './signal'

const getNoop = ()=>()=>{}
const noop = getNoop()

describe('factory', ()=>{

  describe('createSlot', ()=>{

    it('should create an object', ()=>{
      expect(createSlot(()=>{}, {})).toBeDefined()
      expect(createSlot(()=>{}, {}, true)).toBeDefined()
    })

  })

})

describe('slot', ()=>{

  describe('.remove()', function () {

    it('should remove slot from signal', function () {
      const signal = createSignal()
      expect(signal.length).toBe(0)
      const slot = signal.add(noop)
      expect(signal.length).toBe(1)
      expect(signal.has(noop)).toBe(true)
      slot.remove()
      expect(signal.length).toBe(0)
      expect(signal.has(noop)).toBe(false)
    })

    it('should be callable multiple times', function () {
      const signal = createSignal()
      expect(signal.length).toBe(0)
      const slot = signal.add(noop)
      expect(signal.length).toBe(1)
      slot.remove()
      slot.remove()
      expect(signal.length).toBe(0)
    })

  })

  describe('.once', function () {

    it('should return whether slot can only be executed once', function () {
      const signal = createSignal()
      expect(signal.add(getNoop()).once).toBe(false)
      expect(signal.addOnce(getNoop()).once).toBe(true)
    })

  })

  describe('.isBound', function () {

    it('should be true when slot is bound to a signal', function () {
      const signal = createSignal()
      const slot = signal.add(noop)
      expect(slot.isBound).toBe(true)
      slot.remove()
      expect(slot.isBound).toBe(false)

      const slot1 = signal.addOnce(noop)
      expect(slot1.isBound).toBe(true)
      signal.dispatch()
      expect(slot1.isBound).toBe(false)
    })

  })

})
