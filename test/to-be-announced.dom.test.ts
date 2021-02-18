import '../src/index';
import { appendToRoot, createStatusContainer } from './utils';

test('should not announce', () => {
    const statusContainer = createStatusContainer();
    statusContainer.textContent = 'Hello world';
    appendToRoot(statusContainer);

    expect('Hello world').not.toBeAnnounced();
});

test('should announce once', () => {
    const statusContainer = createStatusContainer();
    appendToRoot(statusContainer);

    statusContainer.textContent = 'Hello world';

    expect('Hello world').toBeAnnounced();
});

test('should announce twice', () => {
    const statusContainer = createStatusContainer();
    appendToRoot(statusContainer);

    statusContainer.textContent = 'First';
    statusContainer.textContent = 'Second';

    expect('First').toBeAnnounced();
    expect('Second').toBeAnnounced();
});

test('should throw captured announcements', () => {
    const statusContainer = createStatusContainer();
    appendToRoot(statusContainer);

    statusContainer.textContent = 'First';
    statusContainer.textContent = 'Second';

    expect(() =>
        expect('HELLO WORLD').toBeAnnounced()
    ).toThrowErrorMatchingInlineSnapshot(
        `"HELLO WORLD was not announced. Captured announcements: [First, Second]"`
    );
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
