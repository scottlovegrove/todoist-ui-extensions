import { isUrl } from './url-utils'

describe('URL utils', () => {
    describe('isUrl', () => {
        test.each([
            ['https://www.google.com', true],
            ['http://www.google.com', true],
            ['www.google.com', false],
            ['google.com', false],
            ['google', false],
            [undefined, false],
            ['', false],
        ])('%s should be a valid URL', (url, expected) => {
            expect(isUrl(url)).toBe(expected)
        })
    })
})
