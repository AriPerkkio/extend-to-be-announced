const announcements = new Map<string, boolean>();
const statusContainers = new Map<Node, { previousText: string | null }>();

const onStatusContainerTextChange: MutationCallback = mutations => {
    for (const mutation of mutations) {
        const container = statusContainers.get(mutation.target);

        const previousText = container?.previousText || '';
        const currentText = mutation.target.textContent || '';

        if (previousText !== currentText && currentText !== '') {
            announcements.set(currentText, true);
        }
    }
};

const textContentObserver = new MutationObserver(onStatusContainerTextChange);

const onStatusContainerAdded: MutationCallback = () => {
    const containers = document.querySelectorAll('[role="status"]');

    for (const container of containers) {
        if (statusContainers.has(container)) {
            continue;
        }

        textContentObserver.observe(container, {
            subtree: true,
            childList: true,
        });
        statusContainers.set(container, {
            previousText: container.textContent,
        });
    }
};

const nodeAddedObserver = new MutationObserver(onStatusContainerAdded);

export function register(): void {
    beforeEach(() => {
        nodeAddedObserver.observe(document.body, {
            subtree: true,
            childList: true,
        });
    });

    afterEach(() => {
        nodeAddedObserver.disconnect();
        textContentObserver.disconnect();
        statusContainers.clear();
        announcements.clear();
    });
}

export async function toBeAnnounced(
    text: string
): Promise<jest.CustomMatcherResult> {
    // Tick, runs queued MutationObserver callbacks
    await Promise.resolve();

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
