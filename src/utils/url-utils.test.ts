import { isUrl } from './url-utils'

describe('URL utils', () => {
    describe('isUrl', () => {
        test.each([
            ['https://www.google.com', true],
            ['http://www.google.com', true],
            ['www.google.com', true],
            ['google.com', true],
            ['google', false],
            ['google.com/abc', true],
            ['google.com/abc/def', true],
            ['google.com/abc/def/ghi', true],
            [undefined, false],
            ['', false],
        ])('%s should be a valid URL', (url, expected) => {
            expect(isUrl(url)).toBe(expected)
        })
    })
})
