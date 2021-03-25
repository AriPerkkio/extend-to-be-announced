interface TestAttributes {
    name?: 'role' | 'aria-live';
    value?: 'status' | 'alert' | 'assertive' | 'polite';
    tag?: 'div' | 'output';
}

export const POLITE_CASES: TestAttributes[] = [
    { name: 'role', value: 'status' },
    { name: 'aria-live', value: 'polite' },
    { tag: 'output' },
];

export const ASSERTIVE_CASES: TestAttributes[] = [
    { name: 'role', value: 'alert' },
    { name: 'aria-live', value: 'assertive' },
];

export function createStatusContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.setAttribute('role', 'status');

    return container;
}

export function appendToRoot(element: HTMLElement): void {
    const root = document.getElementById('root');
    if (!root) throw new Error('Root missing');

    root.appendChild(element);
}
