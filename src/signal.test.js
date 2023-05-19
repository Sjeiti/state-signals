import {createSignal} from './singal'

test('expect `createSignal` to create object', () => {
  expect(createSignal(1, 2)).toBeDefined()
})

test('expect `createSignal` to create object', () => {

  const earned = createSignal(0)
  const spent = createSignal(0)
  const totals = createSignal(0)

  earned.add(n=>totals.dispatch(totals()+n))
  spent.add(n=>totals.dispatch(totals()-n))
  totals.add(console.log.bind(console,'totals'))

  earned.dispatch(100) // :   0 + 100 = 100

  expect(totals()).toBe(100)
})



//

const earned = createSignal(0)
const spent = createSignal(0)
const totals = createSignal(0)

earned.add(n=>totals.dispatch(totals()+n))
spent.add(n=>totals.dispatch(totals()-n))
totals.add(console.log.bind(console,'totals'))

earned.dispatch(100) // :   0 + 100 = 100
      .dispatch(50)  // : 100 +  50 = 150
spent.dispatch(120)  // : 150 - 120 =  30            earned.dispatch(20)  // :  30 +  20 =  50
console.log('totals()',totals()) // : 50



