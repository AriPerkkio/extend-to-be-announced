import {
    getClosestElement,
    getParentLiveRegion,
    isElement,
    isInDOM,
    isLiveRegionAttribute,
    LIVE_REGION_QUERY,
    PolitenessSetting,
    resolvePolitenessSetting,
} from './utils';
import { interceptMethod, interceptSetter, Restore } from './interceptors';

interface Options {
    warnIncorrectStatusMessages: boolean;
}

// Map of announcements to their politeness settings
const announcements = new Map<string, Exclude<PolitenessSetting, 'off'>>();

// Map of live regions to previous textContent
const liveRegions = new Map<Node, string | null>();

/**
 * List of incorrectly used status messages
 * - Messages are marked as "invalid" when `polite` messages are mounted on DOM
 *   when their live region container mounts - instead of being updated into
 *   the container
 */
const incorrectlyUsedStatusMessages: string[] = [];

/**
 * Check whether given node should trigger announcement
 * - Node should be inside live region
 * - Politeness setting should not be off
 * - `textContent` of live region should have changed
 */
function updateAnnouncements(node: Node) {
    const element = getClosestElement(node);
    if (!element) return;

    const parentLiveRegion = getParentLiveRegion(element);

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

function addLiveRegion(liveRegion: Element) {
    if (liveRegions.has(liveRegion)) return;

    const politenessSetting = resolvePolitenessSetting(liveRegion);
    if (politenessSetting === 'off') return;

    liveRegions.set(liveRegion, liveRegion.textContent);

    // Content of assertive live regions is announced on initial mount
    if (liveRegion.textContent) {
        if (politenessSetting === 'assertive') {
            announcements.set(liveRegion.textContent, politenessSetting);
        } else if (politenessSetting === 'polite') {
            incorrectlyUsedStatusMessages.push(liveRegion.textContent);
        }
    }
}

/**
 * Check DOM for live regions and update `liveRegions` store
 * - TODO: Could be optimized based on appended/updated child
 */
function updateLiveRegions() {
    for (const liveRegion of document.querySelectorAll(LIVE_REGION_QUERY)) {
        addLiveRegion(liveRegion);
    }
}

function onTextContentChange(this: Node) {
    updateAnnouncements(this);
}

// https://github.com/facebook/react/blob/9198a5cec0936a21a5ba194a22fcbac03eba5d1d/packages/react-dom/src/client/setTextContent.js#L12-L35
function onNodeValueChange(this: Node) {
    updateAnnouncements(this);
}

/**
 * Shared handler for methods which mount new nodes on DOM, e.g. appendChild, insertBefore
 */
function onNodeMount(node: Node) {
    updateLiveRegions();
    updateAnnouncements(node);
}

function onSetAttribute(
    this: Element,
    ...args: Parameters<Element['setAttribute']>
): void {
    if (!isElement(this)) return;
    if (!isInDOM(this)) return;
    if (args[0] !== 'role' && args[0] !== 'aria-live') return;

    const isAlreadyTracked = liveRegions.has(this);
    const liveRegionAttribute = isLiveRegionAttribute(args[1]);

    // Attribute value was changed from live region attribute to something else.
    // Stop tracking this element.
    if (isAlreadyTracked && !liveRegionAttribute) {
        liveRegions.delete(this);
        return;
    }

    // Previous value was not live region attribute value
    if (!isAlreadyTracked && liveRegionAttribute) {
        return addLiveRegion(this);
    }

    // Value was changed to assertive - announce content immediately
    if (
        isAlreadyTracked &&
        liveRegionAttribute &&
        resolvePolitenessSetting(this) === 'assertive'
    ) {
        return updateAnnouncements(this);
    }
}

function onRemoveAttribute(
    this: Element,
    ...args: Parameters<Element['removeAttribute']>
) {
    if (!isElement(this)) return;
    if (args[0] !== 'role' && args[0] !== 'aria-live') return;

    if (liveRegions.has(this)) {
        liveRegions.delete(this);
    }
}

function warnAboutIncorrectlyUsedStatusMessages() {
    if (incorrectlyUsedStatusMessages.length > 0) {
        // prettier-ignore
        process.stdout.write(
            [
                '\x1b[33mtoBeAnnounced identified',
                incorrectlyUsedStatusMessages.length,
                `incorrectly used messages in ARIA live regions with "polite" as politeness setting.`,
                'Instead of rendering content of such containers immediately these messages should be updated to an existing container.',
                `Captured messages: [${incorrectlyUsedStatusMessages.join(', ')}].`,
                'This warning can be disabled by setting "warnIncorrectStatusMessages" off.\n\x1b[0m',
            ].join(' ')
        );
    }
}

export function register(
    options: Options = { warnIncorrectStatusMessages: false }
): void {
    const cleanups: Restore[] = [];

    beforeAll(() => {
        // prettier-ignore
        cleanups.push(
            // TODO: Check MDN for all Node & Element methods
            interceptMethod(Element.prototype, 'setAttribute', onSetAttribute),
            interceptMethod(Element.prototype, 'removeAttribute', onRemoveAttribute),
            interceptMethod(Node.prototype, 'appendChild', onNodeMount),
            interceptMethod(Node.prototype, 'insertBefore', onNodeMount),
            interceptMethod(Node.prototype, 'replaceChild', onNodeMount),
            interceptSetter(Node.prototype, 'textContent', onTextContentChange),
            interceptSetter(Node.prototype, 'nodeValue', onNodeValueChange)
        );
    });

    afterAll(() => {
        cleanups.splice(0).forEach(cleanup => cleanup());
    });

    afterEach(() => {
        if (options.warnIncorrectStatusMessages) {
            warnAboutIncorrectlyUsedStatusMessages();
        }

        liveRegions.clear();
        announcements.clear();
        incorrectlyUsedStatusMessages.splice(0);
    });
}

export function toBeAnnounced(
    this: jest.MatcherContext,
    text: string,
    politenessSetting?: Exclude<PolitenessSetting, 'off'>
): jest.CustomMatcherResult {
    if (text == null || text === '') {
        return {
            pass: false,
            message: () =>
                `toBeAnnounced was given falsy or empty string: (${text})`,
        };
    }

    const isAnnounced = announcements.has(text);
    const politenessSettingMatch =
        politenessSetting == null ||
        (isAnnounced && announcements.get(text) === politenessSetting);

    // Optionally asserted by politeness setting
    if (isAnnounced && !politenessSettingMatch) {
        const actual = announcements.get(text);
        return {
            pass: false,
            message: () =>
                `${text} was announced with politeness setting "${actual}" when "${politenessSetting}" was expected`,
        };
    }

    return {
        pass: isAnnounced,
        message: () => {
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
