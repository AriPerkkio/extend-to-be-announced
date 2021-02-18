export function appendToRoot(element: HTMLElement): void {
    const root = document.getElementById('root');
    if (!root) throw new Error('Root missing');

    root.appendChild(element);
}

export function createStatusContainer(): HTMLDivElement {
    const statusContainer = document.createElement('div');
    statusContainer.setAttribute('role', 'status');

    return statusContainer;
}
