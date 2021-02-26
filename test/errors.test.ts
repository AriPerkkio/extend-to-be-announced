import '../src/index';
import { appendToRoot } from './utils';

describe('Errors', () => {
    test('should throw captured announcements', () => {
        const container = document.createElement('div');
        container.setAttribute('role', 'status');

        appendToRoot(container);

        container.textContent = 'First';
        container.textContent = 'Second';

        expect(() =>
            expect('HELLO WORLD').toBeAnnounced()
        ).toThrowErrorMatchingInlineSnapshot(
            `"HELLO WORLD was not announced. Captured announcements: [First, Second]"`
        );
    });

    test('should throw when given empty string', () => {
        expect(() =>
            expect('').toBeAnnounced()
        ).toThrowErrorMatchingInlineSnapshot(
            `"toBeAnnounced was given falsy or empty string: ()"`
        );
    });

    test('should throw when given null', () => {
        expect(() =>
            expect(null).toBeAnnounced()
        ).toThrowErrorMatchingInlineSnapshot(
            `"toBeAnnounced was given falsy or empty string: (null)"`
        );
    });

    test('should throw when given undefined', () => {
        expect(() =>
            expect(undefined).toBeAnnounced()
        ).toThrowErrorMatchingInlineSnapshot(
            `"toBeAnnounced was given falsy or empty string: (undefined)"`
        );
    });
});
