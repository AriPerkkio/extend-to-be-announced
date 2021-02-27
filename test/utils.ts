export type Tag = 'div' | 'output';

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
