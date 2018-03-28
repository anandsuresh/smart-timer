![npm (scoped)](https://img.shields.io/npm/v/@anandsuresh/smart-timer.svg?style=plastic)
![Travis](https://img.shields.io/travis/anandsuresh/smart-timer.svg?style=plastic)
![npm](https://img.shields.io/npm/dt/@anandsuresh/smart-timer.svg?style=plastic)

# smart-timer

A smart timer uses a timeout and an interval timer to check for timeout events, thereby avoiding excessive timeout checks.

## usage

```
const stream = somehowGetAStream()

const {create} = require('smart_timer')
const timer = create(() => stream.destroy()), {timeout: 5000, interval: 1000})

stream
  .on('data', () => timer.touch())    // keep the timer updated of activity
  .on('end', () => timer.destroy())   // destroy the timer when done
```
