export function createLiveRegion(): HTMLDivElement {
    const element = document.createElement('div');
    element.setAttribute('role', 'status');

    return element;
}

export function appendToRoot(element: HTMLElement): void {
    const root = document.getElementById('root');
    if (!root) throw new Error('Root missing');

    root.appendChild(element);
}
