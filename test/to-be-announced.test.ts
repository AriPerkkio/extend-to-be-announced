import '../src/index';

function appendToRoot(element: HTMLElement) {
    const root = document.getElementById('root');
    if (!root) throw new Error('Root missing');

    root.appendChild(element);
}

function createStatusContainer() {
    const statusContainer = document.createElement('div');
    statusContainer.setAttribute('role', 'status');

    return statusContainer;
}

// Tick - browser detects status-container
async function tick() {
    return;
}

test('should not announce', async () => {
    const statusContainer = createStatusContainer();
    statusContainer.textContent = 'Hello world';
    appendToRoot(statusContainer);

    await expect('Hello world').not.toBeAnnounced();
});

test('should announce once', async () => {
    const statusContainer = createStatusContainer();
    appendToRoot(statusContainer);

    await tick();
    statusContainer.textContent = 'Hello world';

    await expect('Hello world').toBeAnnounced();
});

test('should announce twice', async () => {
    const statusContainer = createStatusContainer();
    appendToRoot(statusContainer);

    await tick();
    statusContainer.textContent = 'First';

    await tick();
    statusContainer.textContent = 'Second';

    await expect('First').toBeAnnounced();
    await expect('Second').toBeAnnounced();
});

test('should throw captured announcements', async () => {
    const statusContainer = createStatusContainer();
    appendToRoot(statusContainer);

    await tick();
    statusContainer.textContent = 'First';

    await tick();
    statusContainer.textContent = 'Second';

    return expect(() =>
        expect('HELLO WORLD').toBeAnnounced()
    ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"HELLO WORLD was not announced. Captured announcements: [First, Second]"`
    );
});

test('should throw when given empty string', async () => {
    return expect(() =>
        expect('').toBeAnnounced()
    ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"toBeAnnounced was given falsy or empty string: ()"`
    );
});

test('should throw when given null', async () => {
    return expect(() =>
        expect(null).toBeAnnounced()
    ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"toBeAnnounced was given falsy or empty string: (null)"`
    );
});

test('should throw when given undefined', async () => {
    return expect(() =>
        expect(undefined).toBeAnnounced()
    ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"toBeAnnounced was given falsy or empty string: (undefined)"`
    );
});
