import '../src/index';
import { clearAnnouncements, getAnnouncements } from '../src/to-be-announced';
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

        test('should announce when content is added with `insertAdjacentHTML`', async () => {
            const child = document.createElement('div');
            element.appendChild(child);
            appendToRoot(element);

            child.insertAdjacentHTML('beforebegin', '<div>Hello world</div>');

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

test('supports matching by regexp', () => {
    const element = document.createElement('div');
    element.setAttribute('role', 'status');
    appendToRoot(element);

    element.textContent = 'Hello world';

    expect(/hello/i).toBeAnnounced();
    expect(/world/i).toBeAnnounced();
});

test('should clear announcements during test when clearAnnouncements is called', () => {
    const element = document.createElement('div');
    element.setAttribute('role', 'status');
    appendToRoot(element);

    element.textContent = 'First';
    expect('First').toBeAnnounced();

    clearAnnouncements();
    expect('First').not.toBeAnnounced();

    element.textContent = 'Second';
    expect('Second').toBeAnnounced();

    clearAnnouncements();
    expect('Second').not.toBeAnnounced();
});

test('should return all announcements with politeness setting when getAnnouncements is called', () => {
    const element = document.createElement('div');
    appendToRoot(element);

    element.setAttribute('role', 'status');
    element.textContent = 'First status message';
    element.textContent = 'Second status message';

    element.setAttribute('role', 'alert');
    element.textContent = 'First alert message';
    element.textContent = 'Second alert message';

    expect(getAnnouncements()).toMatchInlineSnapshot(`
        Map {
          "First status message" => "polite",
          "Second status message" => "polite",
          "First alert message" => "assertive",
          "Second alert message" => "assertive",
        }
    `);
});

test('should trim white-space', () => {
    const parent = document.createElement('div');
    parent.setAttribute('role', 'status');
    appendToRoot(parent);

    const first = document.createElement('div');
    first.textContent = '    First   message here';
    const second = document.createElement('div');
    second.textContent = '    Second   message   here ';

    const child = document.createElement('div');
    child.appendChild(first);
    child.appendChild(second);
    parent.appendChild(child);

    expect('First message here Second message here').toBeAnnounced();
});
