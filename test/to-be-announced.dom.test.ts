import '../src/index';
import { appendToRoot, Tag } from './utils';

[
    { name: 'role', value: 'status' },
    { name: 'aria-live', value: 'polite' },
    { tag: 'output' as Tag },
].forEach(({ name, value, tag }) => {
    const testName = name && value ? `[${name}="${value}"]` : `<${tag}>`;

    describe(testName, () => {
        let element: HTMLElement;

        beforeEach(() => {
            const container = document.createElement(tag || 'div');
            if (name && value) {
                container.setAttribute(name, value);
            }

            element = container;
        });

        test('should not announce when initially rendered with content', () => {
            element.textContent = 'Hello world';
            appendToRoot(element);

            expect('Hello world').not.toBeAnnounced();
        });

        test('should announce when dynamically rendered into container', () => {
            appendToRoot(element);

            element.textContent = 'Hello world';

            expect('Hello world').toBeAnnounced();
        });

        test('should announce when content changes', () => {
            appendToRoot(element);

            element.textContent = 'First';
            element.textContent = 'Second';

            expect('First').toBeAnnounced();
            expect('Second').toBeAnnounced();
        });
    });
});

[
    { name: 'role', value: 'alert' },
    { name: 'aria-live', value: 'assertive' },
].forEach(({ name, value }) => {
    describe(`[${name}="${value}"]`, () => {
        let element: HTMLElement;

        beforeEach(() => {
            const container = document.createElement('div');
            if (name && value) {
                container.setAttribute(name, value);
            }

            element = container;
        });

        test('should announce when dynamically rendered with initially content', () => {
            element.textContent = 'Hello world';
            appendToRoot(element);

            expect('Hello world').toBeAnnounced();
        });

        test('should announce when dynamically rendered into container', () => {
            appendToRoot(element);
            element.textContent = 'Hello world';

            expect('Hello world').toBeAnnounced();
        });

        test('should announce when content changes', () => {
            appendToRoot(element);
            element.textContent = 'Message #1';
            element.textContent = 'Message #2';

            expect('Message #1').toBeAnnounced();
            expect('Message #2').toBeAnnounced();
        });
    });
});
