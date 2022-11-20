import MockDate from 'mockdate'

import { getLastWeeksDates } from './date-utils'

describe('date-utils', () => {
    describe('getLastWeeksDates', () => {
        beforeAll(() => MockDate.set('2022-11-19T11:31:00.000Z'))
        afterAll(() => MockDate.reset())

        test.each([
            [1, '2022-11-07T00:00:00.000Z', '2022-11-13T23:59:59.999Z'],
            [2, '2022-10-31T00:00:00.000Z', '2022-11-06T23:59:59.999Z'],
            [3, '2022-10-24T00:00:00.000Z', '2022-10-30T23:59:59.999Z'],
            [4, '2022-10-17T00:00:00.000Z', '2022-10-23T23:59:59.999Z'],
        ])('should return the correct dates', (weeksAgo, expectedStart, expectedEnd) => {
            const result = getLastWeeksDates(weeksAgo)
            expect(result.start).toEqual(new Date(expectedStart))
            expect(result.end).toEqual(new Date(expectedEnd))
        })
    })
})
