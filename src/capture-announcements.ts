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
    onCapture: (
        textContent: string,
        politenessSetting: Exclude<PolitenessSetting, 'off'>
    ) => void;
    onIncorrectStatusMessage?: (textContent: string) => void;
}

const WHITE_SPACE_REGEXP = /\s+/g;

// Map of live regions to previous textContent
const liveRegions = new Map<Node, string | null>();

export default function CaptureAnnouncements({
    onCapture: __onCapture,
    onIncorrectStatusMessage,
}: Options): Restore {
    const onCapture: typeof __onCapture = (textContent, politenessSetting) =>
        __onCapture(trimWhiteSpace(textContent), politenessSetting);

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
            const politenessSetting = resolvePolitenessSetting(
                parentLiveRegion
            );

            if (politenessSetting !== 'off' && isInDOM(parentLiveRegion)) {
                const previousText = liveRegions.get(node);
                const newText = node.textContent || '';

                if (previousText !== newText) {
                    onCapture(newText, politenessSetting);
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
                onCapture(liveRegion.textContent, politenessSetting);
            } else if (
                politenessSetting === 'polite' &&
                onIncorrectStatusMessage
            ) {
                onIncorrectStatusMessage(
                    trimWhiteSpace(liveRegion.textContent)
                );
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

            throw new Error(
                `Unable to find parentNode for element/text ${log}`
            );
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

    // prettier-ignore
    const cleanups: Restore[] = [
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
    ];

    return function restore() {
        cleanups.splice(0).forEach(cleanup => cleanup());
        liveRegions.clear();
    };
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

function trimWhiteSpace(text: string) {
    return text.trim().replace(WHITE_SPACE_REGEXP, ' ');
}
