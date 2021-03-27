export type PolitenessSetting = 'polite' | 'assertive' | 'off';

const LIVE_REGION_ROLES = ['status', 'log', 'alert'] as const;
type LiveRegionRole = typeof LIVE_REGION_ROLES[number];

export const LIVE_REGION_QUERY = [
    '[role="status"]',
    '[role="log"]',
    '[role="alert"]',
    '[aria-live="polite"]',
    '[aria-live="assertive"]',
    'output',

    // Roles with implicit aria-live="off"
    // '[role="marquee"]',
    // '[role="timer"]',
].join(', ');

export function isElement(node: Node | null): node is Element {
    return node != null && node.nodeType === Node.ELEMENT_NODE;
}

export function getClosestElement(node: Node): Element | null {
    if (isElement(node)) {
        return node;
    }

    if (node.parentNode) {
        return getClosestElement(node.parentNode);
    }

    return null;
}

export function isLiveRegionAttribute(
    attribute: string
): attribute is LiveRegionRole | PolitenessSetting {
    return (
        LIVE_REGION_ROLES.includes(attribute as LiveRegionRole) ||
        isPolitenessSetting(attribute)
    );
}

export function isInDOM(node: Node): boolean {
    return isElement(node) && node.closest('html') != null;
}

export function getParentLiveRegion(element: Element): Element | null {
    return element.closest(LIVE_REGION_QUERY);
}

function isPolitenessSetting(
    setting: string | null
): setting is PolitenessSetting {
    return setting === 'polite' || setting === 'assertive' || setting === 'off';
}

/**
 * Resolve politeness setting of given node
 * - Recursively traverse tree up until live region is found
 */
export function resolvePolitenessSetting(
    node: Node | null
): 'polite' | 'assertive' | 'off' {
    if (!node || !isElement(node)) return 'off';

    const ariaLive = node.getAttribute('aria-live');

    // TODO: Should "off" be ignored?
    if (isPolitenessSetting(ariaLive)) return ariaLive;

    const role = node.getAttribute('role');
    if (role === 'status') return 'polite';
    if (role === 'alert') return 'assertive';

    if (node.tagName.toLowerCase() === 'output') {
        return 'polite';
    }

    return resolvePolitenessSetting(getParentLiveRegion(node));
}
