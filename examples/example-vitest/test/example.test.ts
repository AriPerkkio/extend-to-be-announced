import { afterEach, beforeEach, expect, test } from 'vitest';

beforeEach(() => {
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);
});

afterEach(() => {
    const root = document.getElementById('root');
    document.body.removeChild(root);
});

test('should announce when live region content changes', () => {
    const element = document.createElement('div');
    element.setAttribute('role', 'status');
    element.textContent = 'Hello world';

    appendToRoot(element);

    expect('Hello world').not.toBeAnnounced('polite');

    element.textContent = '...';
    element.textContent = 'Hello world';

    expect('Hello world').toBeAnnounced('polite');
});

function appendToRoot(element: HTMLElement): void {
    const root = document.getElementById('root');
    if (!root) throw new Error('Root missing');

    root.appendChild(element);
}
