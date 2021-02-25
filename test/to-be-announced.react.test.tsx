import React, { useReducer } from 'react';
import { render as originalRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../src/index';

function render(node: React.ReactElement) {
    originalRender(node, { container: document.getElementById('root')! });
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
].forEach(({ name, value }) => {
    describe(`[${name}="${value}"]`, () => {
        const props = { [name]: value };

        test('should not announce when initially rendered', () => {
            render(<div {...props}>Hello world</div>);

            expect('Hello world').not.toBeAnnounced();
        });

        test('should not announce when dynamically rendered with initial content', () => {
            render(
                <MountToggle>
                    {isVisible =>
                        isVisible && <div {...props}>Hello world</div>
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
            expect('Message #1').not.toBeAnnounced();
            expect('Message #2').not.toBeAnnounced();

            toggleContent();
            expect('Message #1').toBeAnnounced();

            toggleContent();
            expect('Message #2').toBeAnnounced();
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
            expect('Message #2').toBeAnnounced();

            toggleContent();
            expect('Message #1').toBeAnnounced();
        });
    });
});

describe('output', () => {
    test.todo('');
});

describe('[aria-live="off"]', () => {
    test.todo('');
});
