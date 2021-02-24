import {
    getParentLiveRegion,
    interceptMethod,
    interceptSetter,
    isInDOM,
    LIVE_REGION_QUERY,
    resolvePolitenessSetting,
} from './utils';

const announcements = new Map<string, boolean>();
const liveRegions = new Map<Node, string | null>();

function onTextContentChange(node: Node) {
    const previousText = liveRegions.get(node);
    const newText = node.textContent || '';

    if (previousText !== newText) {
        announcements.set(newText, true);
    }
}

function updateLiveRegions() {
    for (const liveRegion of document.querySelectorAll(LIVE_REGION_QUERY)) {
        if (liveRegions.has(liveRegion)) continue;

        const politenessSetting = resolvePolitenessSetting(liveRegion);
        if (politenessSetting === 'off') continue;

        liveRegions.set(liveRegion, liveRegion.textContent);

        // Content of assertive live regions is announced on initial mount
        if (politenessSetting === 'assertive' && liveRegion.textContent) {
            announcements.set(liveRegion.textContent, true);
        }
    }
}

function interceptSetTextContent(this: Node) {
    const parentLiveRegion = getParentLiveRegion(this);

    if (parentLiveRegion) {
        const politenessSetting = resolvePolitenessSetting(parentLiveRegion);

        if (politenessSetting !== 'off' && isInDOM(parentLiveRegion)) {
            onTextContentChange(parentLiveRegion);
        }
    }
}

function interceptAppendChild(newChild: Node) {
    updateLiveRegions();

    // Content updates inside live region
    const parentLiveRegion = getParentLiveRegion(newChild);
    if (parentLiveRegion) {
        const politenessSetting = resolvePolitenessSetting(parentLiveRegion);

        if (politenessSetting !== 'off' && isInDOM(parentLiveRegion)) {
            onTextContentChange(parentLiveRegion);
        }
    }
}

interceptSetter(Node.prototype, 'textContent', interceptSetTextContent);
interceptMethod(Node.prototype, 'appendChild', interceptAppendChild);

export function register(): void {
    afterEach(() => {
        liveRegions.clear();
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
