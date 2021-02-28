import React, { useReducer } from 'react';
import { render as originalRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../src/index';
import { Tag } from './utils';

function render(node: React.ReactElement) {
    return originalRender(node, {
        container: document.getElementById('root')!,
    });
}

const MountToggle: React.FC<{
    children: (visible: boolean) => React.ReactNode;
}> = props => {
    const [visible, toggle] = useReducer(s => !s, false);

    return (
        <div>
            <button onClick={toggle}>Toggle</button>
            {props.children(visible)}
        </div>
    );
};

function toggleContent() {
    userEvent.click(screen.getByRole('button', { name: 'Toggle' }));
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
            render(
                <MountToggle>
                    {isVisible =>
                        isVisible && <Tag {...props}>Hello world</Tag>
                    }
                </MountToggle>
            );

            toggleContent();
            expect('Hello world').not.toBeAnnounced();
        });

        test('should announce when dynamically rendered into container', () => {
            render(
                <MountToggle>
                    {visible => (
                        <Tag {...props}>{visible && 'Hello world'}</Tag>
                    )}
                </MountToggle>
            );

            toggleContent();
            expect('Hello world').toBeAnnounced();
        });

        test('should announce when content changes', () => {
            render(
                <MountToggle>
                    {visible => (
                        <Tag {...props}>
                            {visible ? 'Message #1' : 'Message #2'}
                        </Tag>
                    )}
                </MountToggle>
            );

            screen.getByText('Message #2');
            expect('Message #1').not.toBeAnnounced();
            expect('Message #2').not.toBeAnnounced();

            toggleContent();
            expect('Message #1').toBeAnnounced('polite');

            toggleContent();
            expect('Message #2').toBeAnnounced('polite');
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
            render(
                <MountToggle>
                    {isVisible =>
                        isVisible && <div {...props}>Hello world</div>
                    }
                </MountToggle>
            );

            toggleContent();
            expect('Hello world').toBeAnnounced();
        });

        test('should announce when dynamically rendered into container', () => {
            render(
                <MountToggle>
                    {visible => (
                        <div {...props}>{visible && 'Hello world'}</div>
                    )}
                </MountToggle>
            );

            toggleContent();
            expect('Hello world').toBeAnnounced();
        });

        test('should announce when content changes', () => {
            render(
                <MountToggle>
                    {visible => (
                        <div {...props}>
                            {visible ? 'Message #1' : 'Message #2'}
                        </div>
                    )}
                </MountToggle>
            );

            screen.getByText('Message #2');
            expect('Message #2').toBeAnnounced('assertive');

            toggleContent();
            expect('Message #1').toBeAnnounced('assertive');
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
        render(
            <MountToggle>
                {visible => (
                    <div aria-live="off">
                        {visible ? 'Message #1' : 'Message #2'}
                    </div>
                )}
            </MountToggle>
        );

        toggleContent();
        toggleContent();
        toggleContent();

        expect('Message #1').not.toBeAnnounced();
        expect('Message #2').not.toBeAnnounced();
    });

    test('should never announce when implicit', () => {
        render(
            <MountToggle>
                {visible => <div>{visible ? 'Message #1' : 'Message #2'}</div>}
            </MountToggle>
        );

        toggleContent();
        toggleContent();
        toggleContent();

        expect('Message #1').not.toBeAnnounced();
        expect('Message #2').not.toBeAnnounced();
    });
});
