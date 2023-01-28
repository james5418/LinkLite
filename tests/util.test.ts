import dayjs from 'dayjs';
import { isExpired, newExpiredDate } from '../src/utils/dateHandler';
import { isValidUrl, removeTrailingSlash } from '../src/utils/urlHandler';


describe("isExpired()", () => {
    test("date in the past", () => {
        const pastDate = new Date("2022-03-30");
        expect(isExpired(pastDate)).toBe(true);
    });

    test("date in the future", () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1)
        expect(isExpired(futureDate)).toBe(false);
    });
});


describe("newExpiredDate()", () => {
    test("returns a date 30 days in the future", () => {
        const now = dayjs();
        const futureDate = dayjs(newExpiredDate());
        expect(futureDate.diff(now, 'day')).toBe(30);
    });
});


describe("isValidUrl()", () => {
    test('valid http url', () => {
        const url = 'http://www.example.com';
        expect(isValidUrl(url)).toBe(true);
    });

    test('valid https url', () => {
        const url = 'https://www.example.com';
        expect(isValidUrl(url)).toBe(true);
    });

    test('invalid url', () => {
        const url = 'not a url';
        expect(isValidUrl(url)).toBe(false);
    });
});


describe("removeTrailingSlash()", () => {
    test('removes trailing slash from url', () => {
        const url = 'https://www.example.com/';
        expect(removeTrailingSlash(url)).toBe('https://www.example.com');
    });

    test('leaves url unchanged if it does not have a trailing slash', () => {
        const url = 'https://www.example.com';
        expect(removeTrailingSlash(url)).toBe('https://www.example.com');
    });
});