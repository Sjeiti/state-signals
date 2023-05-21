# State Signals

A Signal/Slot implementation that retains state.

Signals are a simple but powerful way to communicate data between instances.
Read the [documentation](https://sjeiti.github.io/state-signals/) for more info.


## Install

```bash
$ npm i -D state-signals
```


## Usage

```JavaScript
import {createSignal} from 'state-signals'

const mySignal = createSignal('ehr')
mySignal.add(console.log.bind(console, 'Hello'))

// ... a few moments later

mySignal.dispatch('world!')

// outputs
// > Hello world!
```
