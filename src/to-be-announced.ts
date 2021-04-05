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
 * Reset all captured announcements. Part of public API.
 */
export function clearAnnouncements(): void {
    announcements.clear();
}

/**
 * Get all captured announcements. Part of public API.
 */
export function getAnnouncements(): Map<string, PolitenessSetting> {
    return announcements;
}

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

function onInsertAdjacent(
    this: Node,
    position: string,
    elementOrText: Element | string
) {
    if (!this.parentNode) {
        const log =
            typeof elementOrText === 'string'
                ? elementOrText
                : elementOrText.outerHTML;

        throw new Error(`Unable to find parentNode for element/text ${log}`);
    }

    onNodeMount(this.parentNode);
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
            interceptMethod(Element.prototype, 'setAttribute', onSetAttribute),
            interceptMethod(Element.prototype, 'removeAttribute', onRemoveAttribute),
            interceptMethod(Element.prototype, 'insertAdjacentElement', onInsertAdjacent),
            interceptMethod(Element.prototype, 'insertAdjacentHTML', onInsertAdjacent),
            interceptMethod(Element.prototype, 'insertAdjacentText', onInsertAdjacent),
            interceptMethod(Element.prototype, 'before', onNodeMount),
            interceptMethod(Element.prototype, 'append', onNodeMount),
            interceptMethod(Element.prototype, 'prepend', onNodeMount),
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
        clearAnnouncements();
        incorrectlyUsedStatusMessages.splice(0);
    });
}

// Convert Map<string, x> to string[]. Required due to iteration of Map.
function getAllAnnouncements() {
    const allAnnouncements: string[] = [];
    for (const [announcement] of announcements.entries()) {
        allAnnouncements.push(announcement);
    }
    return allAnnouncements;
}

function isAnnounced(announcement: string | undefined): announcement is string {
    return Boolean(announcement);
}

export function toBeAnnounced(
    this: jest.MatcherContext,
    text: string | RegExp,
    politenessSetting?: Exclude<PolitenessSetting, 'off'>
): jest.CustomMatcherResult {
    if (text == null || text === '') {
        return {
            pass: false,
            message: () =>
                `toBeAnnounced was given falsy or empty string: (${text})`,
        };
    }

    function matches(announcement: string) {
        if (text instanceof RegExp) return text.test(announcement);
        return text === announcement;
    }

    const isPattern = text instanceof RegExp;
    const allAnnouncements = getAllAnnouncements();
    const matchingAnnouncement = allAnnouncements.find(matches);

    const politenessSettingMatch =
        politenessSetting == null ||
        (isAnnounced(matchingAnnouncement) &&
            announcements.get(matchingAnnouncement) === politenessSetting);

    // Optionally asserted by politeness setting
    if (isAnnounced(matchingAnnouncement) && !politenessSettingMatch) {
        const actual = announcements.get(matchingAnnouncement);

        return {
            pass: false,
            message: () =>
                [
                    text,
                    isPattern ? 'matched an announcement' : 'was announced',
                    `with politeness setting "${actual}" when "${politenessSetting}" was expected`,
                ].join(' '),
        };
    }

    return {
        pass: isAnnounced(matchingAnnouncement),
        message: () => {
            const message = [text];

            // "Hello was", "/hello/i did"
            message.push(isPattern ? 'did' : 'was');

            // "Hello was not", "/hello/i did not"
            if (!this.isNot) message.push('not');

            if (isPattern) {
                // "/hello/i did not match any announcements.", "/hello/i did match an announcement."
                message.push(
                    this.isNot
                        ? 'match an announcement'
                        : 'match any announcements'
                );
            } else {
                // "Hello was (not) announced."
                message.push('announced');
            }

            if (politenessSetting) {
                message.push(`with politeness setting "${politenessSetting}"`);
            }

            message[message.length - 1] += '.';

            return [
                ...message,
                `Captured announcements (${allAnnouncements.length}):`,
                `[${allAnnouncements
                    .map(announcement => `"${announcement}"`)
                    .join(', ')}]`,
            ]
                .filter(Boolean)
                .join(' ');
        },
    };
}
