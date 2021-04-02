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

        test('supports matching by regexp', () => {
            appendToRoot(element);

            element.textContent = 'Hello world';

            expect(/hello/i).toBeAnnounced();
            expect(/world/i).toBeAnnounced();
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

        test('should announce when content is added with `insertBefore`', async () => {
            const parent = document.createElement('div');
            const sibling = document.createElement('div');
            parent.appendChild(sibling);
            appendToRoot(parent);

            element.textContent = 'Hello world';
            parent.insertBefore(element, sibling);

            expect('Hello world').toBeAnnounced();
        });

        test('should announce when content is added with `replaceChild`', async () => {
            const parent = document.createElement('div');
            const oldChild = document.createElement('div');
            parent.appendChild(oldChild);
            appendToRoot(parent);

            element.textContent = 'Hello world';
            parent.replaceChild(element, oldChild);

            expect('Hello world').toBeAnnounced();
        });

        test('should announce when content is added with `insertAdjacentElement`', async () => {
            const parent = document.createElement('div');
            const sibling = document.createElement('div');
            parent.appendChild(sibling);
            appendToRoot(parent);

            element.textContent = 'Hello world';
            sibling.insertAdjacentElement('afterbegin', element);

            expect('Hello world').toBeAnnounced();
        });

        test('should announce when content is added with `insertAdjacentText`', async () => {
            const child = document.createElement('div');
            element.appendChild(child);
            appendToRoot(element);

            child.insertAdjacentText('beforebegin', 'Hello world');

            expect('Hello world').toBeAnnounced();
        });

        test('should announce when content is added with `before`', async () => {
            const sibling = document.createElement('div');
            appendToRoot(sibling);

            element.textContent = 'Hello world';
            sibling.before(element);

            expect('Hello world').toBeAnnounced();
        });

        test('should announce when content is added with `append`', async () => {
            const parent = document.createElement('div');
            appendToRoot(parent);

            element.textContent = 'Hello world';
            parent.append(element);

            expect('Hello world').toBeAnnounced();
        });

        test('should announce when content is added with `prepend`', async () => {
            const parent = document.createElement('div');
            appendToRoot(parent);

            element.textContent = 'Hello world';
            parent.prepend(element);

            expect('Hello world').toBeAnnounced();
        });

        // Missing: replaceChildren, jsdom#3102
        test.todo(
            'should announce when content is added with `replaceChildren`'
        );
    });
});
