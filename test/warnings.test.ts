import '../src/extend-expect';
import { register } from '../src/to-be-announced';
import { appendToRoot, createStatusContainer } from './utils';

function captureAfterEach(method: Function): Function {
    let afterEachHook: Function = () => {
        throw new Error('afterEach not initialized');
    };
    global.afterEach = jest.fn().mockImplementation(method => {
        afterEachHook = method;
    });

    method();

    return afterEachHook;
}

function captureWrite(method: Function): string {
    const write = process.stdout.write;
    const mockWrite = jest.fn();
    process.stdout.write = mockWrite;

    method();
    process.stdout.write = write;

    return mockWrite.mock.calls[0];
}

describe('Warnings', () => {
    register();

    test('should warn about incorrectly used status messages when options.warnIncorrectStatusMessages is enabled', () => {
        const afterEachHook = captureAfterEach(() =>
            register({ warnIncorrectStatusMessages: true })
        );

        const container = createStatusContainer();
        container.textContent = 'Hello world';
        appendToRoot(container);

        const [warning] = captureWrite(afterEachHook);
        expect(warning).toMatchInlineSnapshot(`
            "[33mtoBeAnnounced identified 1 incorrectly used messages in ARIA live regions with \\"polite\\" as politeness setting. Instead of rendering content of such containers immediately these messages should be updated to an existing container. Captured messages: [Hello world]. This warning can be disabled by setting \\"warnIncorrectStatusMessages\\" off.
            [0m"
        `);
    });

    test('should not warn when status message is used correctly', () => {
        const afterEachHook = captureAfterEach(() =>
            register({ warnIncorrectStatusMessages: true })
        );

        const container = createStatusContainer();
        appendToRoot(container);
        container.textContent = 'Hello world';

        const warning = captureWrite(afterEachHook);
        expect(warning).toBeFalsy();
    });

    test('should not warn when assertive message is used', () => {
        const afterEachHook = captureAfterEach(() =>
            register({ warnIncorrectStatusMessages: true })
        );

        const container = document.createElement('div');
        container.setAttribute('role', 'alert');
        container.textContent = 'Hello world';
        appendToRoot(container);

        const warning = captureWrite(afterEachHook);
        expect(warning).toBeFalsy();
    });

    test('should not warn about incorrectly used status messages when options.warnIncorrectStatusMessages is disabled', () => {
        const afterEachHook = captureAfterEach(register);

        const container = createStatusContainer();
        container.textContent = 'Hello world';
        appendToRoot(container);

        const warning = captureWrite(afterEachHook);
        expect(warning).toBeFalsy();
    });
});
