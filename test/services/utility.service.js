'use strict'

describe('utilityService', () => {
  let utilityService, LAUNCH_DATE, PERSONATOSHI_UNIT

  beforeEach(module('personaclient.constants'))

  beforeEach(() => {
    module('personaclient.services')

    inject(($injector, _$rootScope_, _LAUNCH_DATE_, _PERSONATOSHI_UNIT_) => {
      utilityService = $injector.get('utilityService')
      LAUNCH_DATE = _LAUNCH_DATE_
      PERSONATOSHI_UNIT = _PERSONATOSHI_UNIT_
    })
  })

  describe('toshiToPersona', () => {
    it('undefined toshi is 0 Persona', () => {
      const persona = utilityService.toshiToPersona()

      expect(persona).to.eql(0)
    })

    it('0 toshi is 0 Persona', () => {
      const persona = utilityService.toshiToPersona(0)

      expect(persona).to.eql(0)
    })

    it('1 toshiUnit is 1 Persona', () => {
      const persona = utilityService.toshiToPersona(PERSONATOSHI_UNIT)

      expect(persona).to.eql(1)
    })

    it('1/2 toshiUnit is 0.5 Persona', () => {
      const persona = utilityService.toshiToPersona(PERSONATOSHI_UNIT / 2)

      expect(persona).to.eql(0.5)
    })

    it('1111111 part of toshiUnit is human readable amount of Persona', () => {
      const persona = utilityService.toshiToPersona(PERSONATOSHI_UNIT / 1111111)

      expect(persona).to.eq('0.000000900000090000009')
    })

    it('1111111 part of toshiUnit is human readable amount of Persona, 0 decimals', () => {
      const persona = utilityService.toshiToPersona(PERSONATOSHI_UNIT / 1111111, false, 0)

      expect(persona).to.eq('0')
    })

    it('1111111 part of toshiUnit is human readable amount of Persona, 7 decimals', () => {
      const persona = utilityService.toshiToPersona(PERSONATOSHI_UNIT / 1111111, false, 7)

      expect(persona).to.eq('0.0000009')
    })

    it('11111111 part of personatoshi is precise amount of Persona', () => {
      const persona = utilityService.toshiToPersona(PERSONATOSHI_UNIT / 11111111, true)

      expect(persona).to.be.within(9.00000009000000e-8, 9.00000009000002e-8)
    })

    it('11111111 part of personatoshi is precise amount of Persona, 0 decimals', () => {
      const persona = utilityService.toshiToPersona(PERSONATOSHI_UNIT / 11111111, true, 0)

      expect(persona).to.eq('0')
    })

    it('11111111 part of personatoshi is precise amount of Persona, 7 decimals', () => {
      const persona = utilityService.toshiToPersona(PERSONATOSHI_UNIT / 11111111, true, 7)

      expect(persona).to.eq('0.0000001')
    })
  })

  describe('personaToToshi', () => {
    it('undefined Persona is 0 personatoshi', () => {
      const persona = utilityService.personaToToshi()

      expect(persona).to.eql(0)
    })

    it('0 Persona is 0 personatoshi', () => {
      const persona = utilityService.personaToToshi(0)

      expect(persona).to.eql(0)
    })

    it('1 Persona is 1 toshiUnit', () => {
      const persona = utilityService.personaToToshi(1)

      expect(persona).to.eql(PERSONATOSHI_UNIT)
    })

    it('0.5 Persona is 0.5 toshiUnit', () => {
      const persona = utilityService.personaToToshi(0.5)

      expect(persona).to.eql(PERSONATOSHI_UNIT / 2)
    })

    it('11.11111111111 persona is correct personatoshi amount', () => {
      const persona = utilityService.personaToToshi(11.11111111111)

      expect(persona).to.eq(1111111111.111)
    })

    it('11.11111111111 persona is correct personatoshi amount, 0 decimals', () => {
      const persona = utilityService.personaToToshi(11.11111111111, 0)

      expect(persona).to.eq('1111111111')
    })

    it('11.11111111111 persona is correct personatoshi amount, 2 decimals', () => {
      const persona = utilityService.personaToToshi(11.11111111111, 2)

      expect(persona).to.eq('1111111111.11')
    })
  })

  describe('numberStringToFixed', () => {
    it('input is not a string, returns input value', () => {
      expect(utilityService.numberStringToFixed()).to.eq()
      expect(utilityService.numberStringToFixed(null)).to.eq(null)
      expect(utilityService.numberStringToFixed(1)).to.eq(1)
      const obj = {}
      expect(utilityService.numberStringToFixed(obj)).to.eq(obj)
    })

    it('12.345, no value for decimals, returns input', () => {
      expect(utilityService.numberStringToFixed('12.345')).to.eq('12.345')
    })

    it('12.345, 0 decimals, returns 12', () => {
      expect(utilityService.numberStringToFixed('12.345', 0)).to.eq('12')
    })

    it('12.345, 2 decimals, returns 12.34', () => {
      expect(utilityService.numberStringToFixed('12.345', 2)).to.eq('12.34')
    })

    it('12.345, 4 decimals, returns 12.3450', () => {
      expect(utilityService.numberStringToFixed('12.345', 4)).to.eq('12.3450')
    })

    it('12, 2 decimals, returns 12.00', () => {
      expect(utilityService.numberStringToFixed('12', 2)).to.eq('12.00')
    })
  })

  describe('dateToPersonaStamp', () => {
    it('input ist not defined, returns null', () => {
      expect(utilityService.dateToPersonaStamp()).to.eq(null)
      expect(utilityService.dateToPersonaStamp(null)).to.eq(null)
    })

    it('input is persona launch time, returns 0', () => {
      expect(utilityService.dateToPersonaStamp(LAUNCH_DATE, 0x37)).to.eq(0)
    })

    it('input is BEFORE persona launch time, returns null', () => {
      expect(utilityService.dateToPersonaStamp(new Date(Date.UTC(2017, 2, 21, 12, 59, 59, 59)), 0x42)).to.eq(null)
    })

    it('input is a utc date, returns correct timestamp', () => {
      expect(utilityService.dateToPersonaStamp(new Date(Date.UTC(2017, 10, 10, 10, 0, 0, 0)), 0x42)).to.eq(20206800)
    })

    it('input is a local date, returns correct timestamp', () => {
      // since this is plus 1, this means that in UTC, it's currently 09:00, therefore the timestamphas to be 1 hour shorter than the one above
      const localDate = new Date('Fri Nov 10 2017 10:00:00 GMT+0100 (Romance Standard Time)')
      const oneHourInSeconds = 60 * 60
      expect(utilityService.dateToPersonaStamp(localDate, 0x42)).to.eq(20206800 - oneHourInSeconds)
    })
  })

  describe('personaStampToDate', () => {
    it('input ist not a number, returns null', () => {
      expect(utilityService.personaStampToDate()).to.eq(null)
      expect(utilityService.personaStampToDate(null, 0x42)).to.eq(null)
      expect(utilityService.personaStampToDate('abc', 0x42)).to.eq(null)
      expect(utilityService.personaStampToDate({}, 0x42)).to.eq(null)
    })

    it('input is 0, returns persona launch date', () => {
      expect(utilityService.personaStampToDate(0, 0x37).getTime()).to.eq(LAUNCH_DATE.getTime())
    })

    it('input is lower than 0, returns null', () => {
      expect(utilityService.personaStampToDate(-1, 0x42)).to.eq(null)
    })

    it('input is a normal timestamp, returns correct date', () => {
      expect(utilityService.personaStampToDate(20206800, 0x42).getTime()).to.eq(new Date(Date.UTC(2017, 10, 10, 10, 0, 0, 0)).getTime())
    })
  })
})
