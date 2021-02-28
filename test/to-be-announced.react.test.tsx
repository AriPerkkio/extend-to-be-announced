import React from 'react';
import { render as originalRender } from '@testing-library/react';

import '../src/index';
import { Tag } from './utils';

function render(node: React.ReactElement) {
    return originalRender(node, {
        container: document.getElementById('root')!,
    });
}

[
    { name: 'role', value: 'status' },
    { name: 'aria-live', value: 'polite' },
    { tag: 'output' as Tag },
].forEach(({ name, value, tag }) => {
    const testName = name && value ? `[${name}="${value}"]` : `<${tag}>`;

    describe(testName, () => {
        const props = name && value ? { [name]: value } : {};
        const Tag: Tag = tag || 'div';

        test('should not announce when initially rendered with content', () => {
            render(<Tag {...props}>Hello world</Tag>);

            expect('Hello world').not.toBeAnnounced();
        });

        test('should not announce when dynamically rendered with initial content', () => {
            const { rerender } = render(<h1></h1>);

            rerender(<Tag {...props}>Hello world</Tag>);

            expect('Hello world').not.toBeAnnounced();
        });

        test('should announce when dynamically rendered into container', () => {
            const { rerender } = render(<Tag {...props}></Tag>);

            rerender(<Tag {...props}>Hello world</Tag>);

            expect('Hello world').toBeAnnounced();
        });

        test('should announce when content changes', () => {
            const { rerender } = render(<Tag {...props}>Message #1</Tag>);
            expect('Message #1').not.toBeAnnounced();

            rerender(<Tag {...props}>Message #2</Tag>);
            expect('Message #2').toBeAnnounced('polite');

            rerender(<Tag {...props}>Message #1</Tag>);
            expect('Message #1').toBeAnnounced('polite');
        });

        test('should not announce when role is set after render', () => {
            const { rerender } = render(<Tag>Hello world</Tag>);

            rerender(<Tag {...props}>Hello world</Tag>);

            expect('Hello world').not.toBeAnnounced();
        });

        test('should announce when role is set after render and content is updated', () => {
            const { rerender } = render(<Tag>Initial</Tag>);

            rerender(<Tag {...props}>Initial</Tag>);
            rerender(<Tag {...props}>Hello world</Tag>);

            expect('Hello world').toBeAnnounced();
            expect('Initial').not.toBeAnnounced();
        });
    });
});

[
    { name: 'role', value: 'alert' },
    { name: 'aria-live', value: 'assertive' },
].forEach(({ name, value }) => {
    describe(`[${name}="${value}"]`, () => {
        const props = { [name]: value };

        test('should announce when initially rendered', () => {
            render(<div {...props}>Hello world</div>);

            expect('Hello world').toBeAnnounced();
        });

        test('should announce when dynamically rendered with initially content', () => {
            const { rerender } = render(<div></div>);

            rerender(<div {...props}>Hello world</div>);

            expect('Hello world').toBeAnnounced();
        });

        test('should announce when dynamically rendered into container', () => {
            const { rerender } = render(<div {...props}></div>);

            rerender(<div {...props}>Hello world</div>);

            expect('Hello world').toBeAnnounced();
        });

        test('should announce when content changes', () => {
            const { rerender } = render(<div {...props}>Message #1</div>);
            expect('Message #1').toBeAnnounced('assertive');

            rerender(<div {...props}>Message #2</div>);
            expect('Message #2').toBeAnnounced('assertive');
        });

        test('should announce when role is set after render', () => {
            const { rerender } = render(<div>Hello world</div>);

            rerender(<div {...props}>Hello world</div>);

            expect('Hello world').toBeAnnounced();
        });

        test('should announce when role is set after render and content is updated', () => {
            const { rerender } = render(<div>First</div>);

            rerender(<div {...props}>Second</div>);

            expect('First').toBeAnnounced();
            expect('Second').toBeAnnounced();
        });
    });
});

describe('[aria-live="off"]', () => {
    test('should never announce', () => {
        const { rerender } = render(<div aria-live="off">Message #1</div>);
        rerender(<div aria-live="off">Message #1</div>);
        rerender(<div aria-live="off">Message #2</div>);
        rerender(<div aria-live="off">Message #1</div>);

        expect('Message #1').not.toBeAnnounced();
        expect('Message #2').not.toBeAnnounced();
    });

    test('should never announce when implicit', () => {
        const { rerender } = render(<div>Message #1</div>);
        rerender(<div>Message #1</div>);
        rerender(<div>Message #2</div>);
        rerender(<div>Message #1</div>);

        expect('Message #1').not.toBeAnnounced();
        expect('Message #2').not.toBeAnnounced();
    });
});
