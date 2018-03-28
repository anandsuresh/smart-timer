/**
 * @file Unit tests for the smart timer
 *
 * @author Anand Suresh <anandsuresh@gmail.com>
 * @copyright Copyright (C) 2018-present Anand Suresh. All rights reserved.
 */

const {expect} = require('chai')
const {create} = require('../lib/smart_timer')

describe('Timer', function () {
  describe('create', function () {
    it('should be callable', function () {
      expect(create).to.be.a('function')
    })

    it('should not be instantiable without arguments', function () {
      expect(() => create()).to.throw()
    })

    it('should be instantiable with arguments', function () {
      expect(() => create(function () {})).to.not.throw()
    })
  })

  describe('operation', function () {
    it('should call onTimeout when the timeout occurs', function (done) {
      const timeout = 500
      const onTimeout = duration => {
        expect(duration).to.be.at.least(timeout)
        timer.destroy()
        done()
      }
      const timer = create(onTimeout, {timeout})
    })

    it('should record activity correctly', function (done) {
      const onTimeout = () => done(new Error('should not have timed out!'))
      const timer = create(onTimeout, {timeout: 500})
      const interval = setInterval(() => timer.touch(), 100)

      setTimeout(function () {
        clearInterval(interval)
        timer.destroy()
        done()
      }, 1000)
    })

    it('should destroy the timer correctly', function (done) {
      let destroyed = false
      const onTimeout = () => done(new Error('should not have timed out!'))
      const timer = create(onTimeout, {timeout: 500})
      const interval = setInterval(function () {
        try {
          timer.touch()
        } catch (e) {
          clearInterval(interval)

          if (destroyed) {
            done()
          } else {
            done(new Error('timer not destroyed properly!'))
          }
        }
      }, 100)

      setTimeout(function () {
        timer.destroy()
        destroyed = true
      }, 1000)
    })
  })
})
