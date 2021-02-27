import {
    getParentLiveRegion,
    isElement,
    isInDOM,
    LIVE_REGION_QUERY,
    PolitenessSetting,
    resolvePolitenessSetting,
} from './utils';
import { interceptMethod, interceptSetter, Restore } from './interceptors';

// TODO Capture incorrectly used aria-live="polite"

// Map of announcements to their politeness settings
const announcements = new Map<string, Exclude<PolitenessSetting, 'off'>>();

// Map of live regions to previous textContent
const liveRegions = new Map<Node, string | null>();

/**
 * Check whether given node should trigger announcement
 * - Node should be inside live region
 * - Politeness setting should not be off
 * - `textContent` of live region should have changed
 */
function updateAnnouncements(node: Node) {
    const parentLiveRegion = getParentLiveRegion(node);

    if (parentLiveRegion) {
        const politenessSetting = resolvePolitenessSetting(parentLiveRegion);

        if (politenessSetting !== 'off' && isInDOM(parentLiveRegion)) {
            const previousText = liveRegions.get(node);
            const newText = node.textContent || '';

            if (previousText !== newText) {
                announcements.set(newText, politenessSetting);
                liveRegions.set(node, newText);
            }
        }
    }
}

/**
 * Check DOM for live regions and update `liveRegions` store
 * - TODO: Could be optimized based on appended child
 */
function updateLiveRegions() {
    for (const liveRegion of document.querySelectorAll(LIVE_REGION_QUERY)) {
        if (liveRegions.has(liveRegion)) continue;

        const politenessSetting = resolvePolitenessSetting(liveRegion);
        if (politenessSetting === 'off') continue;

        liveRegions.set(liveRegion, liveRegion.textContent);

        // Content of assertive live regions is announced on initial mount
        if (politenessSetting === 'assertive' && liveRegion.textContent) {
            announcements.set(liveRegion.textContent, politenessSetting);
        }
    }
}

function onTextContentChange(this: Node) {
    updateAnnouncements(this);
}

// https://github.com/facebook/react/blob/9198a5cec0936a21a5ba194a22fcbac03eba5d1d/packages/react-dom/src/client/setTextContent.js#L12-L35
function onNodeValueChange(this: Node) {
    // This should be a TEXT_NODE
    const element = isElement(this) ? this : this.parentElement;

    if (element) {
        updateAnnouncements(element);
    }
}

function onAppendChild(newChild: Node) {
    updateLiveRegions();
    updateAnnouncements(newChild);
}

// TODO Add options: { "warnIncorrectlyUsedPoliteContainer": boolean (defaults to false) }
export function register(): void {
    const cleanups: Restore[] = [];

    beforeAll(() => {
        // TODO intercept setAttribute('role' | 'aria-live') ?
        cleanups.push(
            interceptSetter(Node.prototype, 'textContent', onTextContentChange),
            interceptMethod(Node.prototype, 'appendChild', onAppendChild),
            interceptSetter(Node.prototype, 'nodeValue', onNodeValueChange)
        );
    });

    afterAll(() => {
        cleanups.splice(0).forEach(cleanup => cleanup());
    });

    afterEach(() => {
        liveRegions.clear();
        announcements.clear();
    });
}

export function toBeAnnounced(
    this: jest.MatcherContext,
    text: string,
    politenessSetting?: Exclude<PolitenessSetting, 'off'>
): jest.CustomMatcherResult {
    const textMissing = text == null || text === '';
    const isAnnounced = announcements.has(text);

    // Optionally asserted by politeness setting
    const politenessSettingMatch =
        politenessSetting == null ||
        (isAnnounced && announcements.get(text) === politenessSetting);

    // TODO Refactor to use multiple returns instead of a complex single return
    return {
        pass: !textMissing && isAnnounced && politenessSettingMatch,
        message: () => {
            if (textMissing) {
                return `toBeAnnounced was given falsy or empty string: (${text})`;
            }

            if (!politenessSettingMatch && isAnnounced) {
                const actual = announcements.get(text);
                return `${text} was announced with politeness setting "${actual}" when "${politenessSetting}" was expected`;
            }

            const allAnnouncements: string[] = [];
            for (const [announcement] of announcements.entries()) {
                allAnnouncements.push(announcement);
            }

            return [
                text,
                'was',
                !this.isNot && 'not',
                'announced. Captured announcements:',
                `[${allAnnouncements.join(', ')}]`,
            ]
                .filter(Boolean)
                .join(' ');
        },
    };
}
