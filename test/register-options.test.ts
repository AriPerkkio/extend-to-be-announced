import { describe, expect, test } from 'vitest';

import { register } from '../src/vitest/register';
import { appendToRoot } from './utils';

describe('default options', () => {
    register();

    test('should not detect live regions inside shadow dom', () => {
        const parent = document.createElement('div');
        parent.setAttribute('aria-live', 'polite');
        const shadowRoot = parent.attachShadow({ mode: 'open' });

        appendToRoot(parent);

        const element = document.createElement('div');
        element.textContent = 'Hello world';
        shadowRoot.appendChild(element);

        expect('Hello world').not.toBeAnnounced();
    });
});

describe('{ includeShadowDom: false }', () => {
    register({ includeShadowDom: false });

    test('should not detect live regions inside shadow dom', () => {
        const parent = document.createElement('div');
        parent.setAttribute('aria-live', 'polite');
        const shadowRoot = parent.attachShadow({ mode: 'open' });

        appendToRoot(parent);

        const element = document.createElement('div');
        element.textContent = 'Hello world';
        shadowRoot.appendChild(element);

        expect('Hello world').not.toBeAnnounced();
    });
});

describe('{ includeShadowDom: true }', () => {
    register({ includeShadowDom: true });

    test('should detect live regions inside shadow dom', () => {
        const parent = document.createElement('div');
        parent.setAttribute('aria-live', 'polite');
        const shadowRoot = parent.attachShadow({ mode: 'open' });

        appendToRoot(parent);

        const element = document.createElement('div');
        element.textContent = 'Hello world';
        shadowRoot.appendChild(element);

        expect('Hello world').toBeAnnounced();
    });
});
