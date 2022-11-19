import MockDate from 'mockdate'

import { getLastWeeksDates } from './date-utils'

describe('date-utils', () => {
    describe('getLastWeeksDates', () => {
        beforeAll(() => MockDate.set('2022-11-19T11:31:00.000Z'))
        afterAll(() => MockDate.reset())

        it('should return the correct dates', () => {
            const result = getLastWeeksDates()
            expect(result.start).toEqual(new Date('2022-11-07T00:00:00.000Z'))
            expect(result.end).toEqual(new Date('2022-11-13T23:59:59.999Z'))
        })
    })
})
