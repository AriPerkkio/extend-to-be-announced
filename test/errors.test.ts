import '../src/index';
import { appendToRoot, createStatusContainer } from './utils';

describe('Errors', () => {
    test('should throw captured announcements', () => {
        const container = createStatusContainer();
        appendToRoot(container);

        container.textContent = 'First';
        container.textContent = 'Second';

        expect(() =>
            expect('HELLO WORLD').toBeAnnounced()
        ).toThrowErrorMatchingInlineSnapshot(
            `"HELLO WORLD was not announced. Captured announcements: [First, Second]"`
        );
    });

    test("should throw when asserting with '.not' and message was announced", () => {
        const container = createStatusContainer();

        appendToRoot(container);
        container.textContent = 'Hello world';

        expect(() =>
            expect('Hello world').not.toBeAnnounced()
        ).toThrowErrorMatchingInlineSnapshot(
            `"Hello world was announced. Captured announcements: [Hello world]"`
        );
    });

    test('should throw when asserting with incorrect polite setting', () => {
        const container = createStatusContainer();
        appendToRoot(container);

        container.textContent = 'Hello world';

        expect(() =>
            expect('Hello world').toBeAnnounced('assertive')
        ).toThrowErrorMatchingInlineSnapshot(
            `"Hello world was announced with politeness setting \\"polite\\" when \\"assertive\\" was expected"`
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
