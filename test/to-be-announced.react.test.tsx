import React, { useReducer } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../src/index';

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

test('should not announce when initially rendered', () => {
    render(<div role="status">Hello world</div>);

    expect('Hello world').not.toBeAnnounced();
});

test('should not announce when dynamically rendered with initial content', () => {
    render(
        <MountToggle>
            {isVisible => isVisible && <div role="status">Hello world</div>}
        </MountToggle>
    );

    userEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect('Hello world').not.toBeAnnounced();
});

test('should announce when dynamically rendered into container', () => {
    render(
        <MountToggle>
            {visible => <div role="status">{visible && 'Hello world'}</div>}
        </MountToggle>
    );

    userEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect('Hello world').toBeAnnounced();
});
