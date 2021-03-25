import '../src/index';
import { appendToRoot, POLITE_CASES, ASSERTIVE_CASES } from './utils';

POLITE_CASES.forEach(({ name, value, tag }) => {
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

        test('should not announce when role is set after render', () => {
            const container = document.createElement(tag || 'div');
            container.textContent = 'Hello world';
            appendToRoot(container);

            if (name && value) {
                container.setAttribute(name, value);
            }

            expect('Hello world').not.toBeAnnounced();
        });

        test('should announce when role is set after render and content is updated', () => {
            const container = document.createElement(tag || 'div');
            container.textContent = 'First';
            appendToRoot(container);

            if (name && value) {
                container.setAttribute(name, value);
            }
            container.textContent = 'Second';

            expect('First').not.toBeAnnounced();
            expect('Second').toBeAnnounced();
        });

        test('should announce when text node is appended into existing container', () => {
            appendToRoot(element);

            element.appendChild(document.createTextNode('Hello world'));

            expect('Hello world').toBeAnnounced();
        });
    });
});

ASSERTIVE_CASES.forEach(({ name, value }) => {
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

        test('should announce when role is set after render', () => {
            const container = document.createElement('div');
            container.textContent = 'Hello world';
            appendToRoot(container);

            if (name && value) {
                container.setAttribute(name, value);
            }

            expect('Hello world').toBeAnnounced();
        });

        test('should announce when role is set after render and content is updated', () => {
            const container = document.createElement('div');
            container.textContent = 'First';
            appendToRoot(container);

            if (name && value) {
                container.setAttribute(name, value);
            }
            container.textContent = 'Second';

            expect('First').toBeAnnounced();
            expect('Second').toBeAnnounced();
        });
    });
});
