const announcements = new Map<string, boolean>();
const statusContainers = new Map<Node, string | null>();

function onTextContentChange(this: Node, textContent: string | null) {
    const previousText = statusContainers.get(this);
    const newText = textContent || '';

    if (previousText !== newText) {
        announcements.set(newText, true);
    }
}

function updateStatusContainers() {
    const containers = document.querySelectorAll('[role="status"]');

    for (const container of containers) {
        if (statusContainers.has(container)) continue;

        statusContainers.set(container, container.textContent);

        jest.spyOn(container, 'textContent', 'set').mockImplementation(
            onTextContentChange
        );
    }
}

function isElement(node: Node): node is Element {
    return 'closest' in node;
}

function isAdjacentOfStatusContainer(node: Node) {
    if (isElement(node)) {
        return Boolean(node.closest('[role="status"]'));
    }
}

const appendChild = Node.prototype.appendChild;
Node.prototype.appendChild = function patchedAppendChild<T extends Node>(
    newChild: T
): T {
    const output = appendChild.call(this, newChild);

    updateStatusContainers();

    if (isAdjacentOfStatusContainer(newChild)) {
        // TODO text content of status container or newChild ?
        const textContent = newChild.textContent;

        if (textContent && announcements.has(textContent)) {
            announcements.set(textContent, true);
        }
    }

    return output as T;
};

export function register(): void {
    afterEach(() => {
        statusContainers.clear();
        announcements.clear();
    });
}

export function toBeAnnounced(text: string): jest.CustomMatcherResult {
    const textMissing = text == null || text === '';

    return {
        pass: !textMissing && announcements.has(text),
        message: () => {
            if (textMissing) {
                return `toBeAnnounced was given falsy or empty string: (${text})`;
            }

            const allAnnouncements: string[] = [];
            for (const [announcement] of announcements.entries()) {
                allAnnouncements.push(announcement);
            }

            return `${text} was not announced. Captured announcements: [${allAnnouncements.join(
                ', '
            )}]`;
        },
    };
}
