import { expect, test } from 'vitest';

import '../src/register';
import { clearAnnouncements, getAnnouncements } from '../src/index';
import { appendToRoot, createLiveRegion } from './utils';

test('should not announce when initially rendered with content', () => {
    const element = createLiveRegion();
    element.textContent = 'Hello world';

    appendToRoot(element);

    expect('Hello world').not.toBeAnnounced();
});

test('should announce when dynamically rendered into live region', () => {
    const element = createLiveRegion();
    appendToRoot(element);

    element.textContent = 'Hello world';

    expect('Hello world').toBeAnnounced();
});

test('should announce when content changes', () => {
    const element = createLiveRegion();
    appendToRoot(element);

    element.textContent = 'First';
    expect('First').toBeAnnounced();

    element.textContent = 'Second';
    expect('Second').toBeAnnounced();
});

test('supports matching by regexp', () => {
    const element = createLiveRegion();
    appendToRoot(element);

    element.textContent = 'Hello world';

    expect(/hello/i).toBeAnnounced();
    expect(/world/i).toBeAnnounced();
});

test('should clear announcements during test when clearAnnouncements is called', () => {
    const element = createLiveRegion();
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

    element.removeAttribute('role');

    element.setAttribute('aria-live', 'polite');
    element.textContent = 'Third status message';

    element.setAttribute('aria-live', 'assertive');
    element.textContent = 'Third alert message';

    expect(getAnnouncements()).toMatchInlineSnapshot(`
        Map {
          "First status message" => "polite",
          "Second status message" => "polite",
          "First alert message" => "assertive",
          "Second alert message" => "assertive",
          "Third status message" => "polite",
          "Third alert message" => "assertive",
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
