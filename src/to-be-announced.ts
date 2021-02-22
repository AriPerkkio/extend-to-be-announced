import {
    getParentLiveRegion,
    LIVE_REGION_QUERY,
    resolvePolitenessSetting,
} from './utils';

const announcements = new Map<string, boolean>();
const liveRegions = new Map<Node, string | null>();

function onTextContentChange(this: Node, textContent: string | null) {
    const previousText = liveRegions.get(this);
    const newText = textContent || '';

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
        jest.spyOn(liveRegion, 'textContent', 'set').mockImplementation(
            onTextContentChange
        );

        // Content of assertive live regions is announced on initial mount
        if (politenessSetting === 'assertive' && liveRegion.textContent) {
            announcements.set(liveRegion.textContent, true);
        }
    }
}

const appendChild = Node.prototype.appendChild;
Node.prototype.appendChild = function patchedAppendChild<T extends Node>(
    newChild: T
): T {
    const output = appendChild.call(this, newChild);

    updateLiveRegions();

    // Content updates inside live region
    const parentLiveRegion = getParentLiveRegion(newChild);
    if (parentLiveRegion) {
        const politenessSetting = resolvePolitenessSetting(parentLiveRegion);

        // TODO run only if parent was mounted on previous microtask
        //if (politenessSetting !== 'off') {
        //    onTextContentChange.call(
        //        parentLiveRegion,
        //        parentLiveRegion.textContent
        //    );
        //}
    }

    return output as T;
};

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
