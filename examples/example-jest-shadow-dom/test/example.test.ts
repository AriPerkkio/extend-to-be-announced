beforeEach(() => {
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);
});

afterEach(() => {
    const root = document.getElementById('root');
    document.body.removeChild(root);
});

test('should announce when content of live region inside shadow root changes', () => {
    const element = document.createElement('div');
    element.setAttribute('role', 'status');
    element.textContent = 'Hello world';

    const root = document.getElementById('root');
    const shadowRoot = root.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(element);

    expect('Hello world').not.toBeAnnounced('polite');

    element.textContent = '...';
    element.textContent = 'Hello world';

    expect('Hello world').toBeAnnounced('polite');
});
