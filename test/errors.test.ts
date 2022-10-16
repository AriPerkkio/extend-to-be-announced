import '../src/register';
import { appendToRoot, createLiveRegion } from './utils';

test('should throw captured announcements', () => {
    const element = createLiveRegion();
    appendToRoot(element);

    element.textContent = 'First';
    element.textContent = 'Second';

    expect(() =>
        expect('HELLO WORLD').toBeAnnounced()
    ).toThrowErrorMatchingInlineSnapshot(
        `"HELLO WORLD was not announced. Captured announcements (2): ["First", "Second"]"`
    );
});

test('should throw pattern when not matched', () => {
    expect(() =>
        expect(/hello/i).toBeAnnounced()
    ).toThrowErrorMatchingInlineSnapshot(
        `"/hello/i did not match any announcements. Captured announcements (0): []"`
    );
});

test("should throw when asserting with '.not' and message was announced", () => {
    const element = createLiveRegion();

    appendToRoot(element);
    element.textContent = 'Hello world';

    expect(() =>
        expect('Hello world').not.toBeAnnounced()
    ).toThrowErrorMatchingInlineSnapshot(
        `"Hello world was announced. Captured announcements (1): ["Hello world"]"`
    );
});

test("should throw pattern when asserting with '.not' and message was announced", () => {
    const element = createLiveRegion();

    appendToRoot(element);
    element.textContent = 'Hello world';

    expect(() =>
        expect(/hello/i).not.toBeAnnounced()
    ).toThrowErrorMatchingInlineSnapshot(
        `"/hello/i did match an announcement. Captured announcements (1): ["Hello world"]"`
    );
});

test('should throw when asserting with incorrect politeness setting', () => {
    const element = createLiveRegion();
    appendToRoot(element);

    element.textContent = 'Hello world';

    expect(() =>
        expect('Hello world').toBeAnnounced('assertive')
    ).toThrowErrorMatchingInlineSnapshot(
        `"Hello world was announced with politeness setting "polite" when "assertive" was expected"`
    );
});

test('should throw when asserting with pattern and incorrect politeness setting', () => {
    const element = createLiveRegion();
    appendToRoot(element);

    element.textContent = 'Hello world';

    expect(() =>
        expect(/hello/i).toBeAnnounced('assertive')
    ).toThrowErrorMatchingInlineSnapshot(
        `"/hello/i matched an announcement with politeness setting "polite" when "assertive" was expected"`
    );
});

test("should throw when asserting with '.not' and correct politeness setting", () => {
    const element = createLiveRegion();
    appendToRoot(element);

    element.textContent = 'Hello world';

    expect(() =>
        expect('Hello world').not.toBeAnnounced('polite')
    ).toThrowErrorMatchingInlineSnapshot(
        `"Hello world was announced with politeness setting "polite". Captured announcements (1): ["Hello world"]"`
    );
});

test("should throw when asserting with pattern, '.not' and correct politeness setting", () => {
    const element = createLiveRegion();
    appendToRoot(element);

    element.textContent = 'Hello world';

    expect(() =>
        expect(/hello/i).not.toBeAnnounced('polite')
    ).toThrowErrorMatchingInlineSnapshot(
        `"/hello/i did match an announcement with politeness setting "polite". Captured announcements (1): ["Hello world"]"`
    );
});

test("should not throw when asserting with '.not' and incorrect politeness setting", () => {
    const element = createLiveRegion();
    appendToRoot(element);

    element.textContent = 'Hello world';

    expect('Hello world').not.toBeAnnounced('assertive');
});

test('should throw when given empty string', () => {
    expect(() => expect('').toBeAnnounced()).toThrowErrorMatchingInlineSnapshot(
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
