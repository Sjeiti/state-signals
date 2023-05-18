import {createSignal} from './singal'

test('adds 1 + 2 to equal 3', () => {
  expect(createSignal(1, 2)).toBeDefined()
})