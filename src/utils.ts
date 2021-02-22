type PolitenessSetting = 'polite' | 'assertive' | 'off';

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

function isElement(node: Node): node is Element {
    return 'closest' in node;
}

export function getParentLiveRegion(node: Node): Element | null {
    if (isElement(node)) {
        return node.closest(LIVE_REGION_QUERY);
    }

    return null;
}

function isPolitenessSetting(
    setting: string | null
): setting is PolitenessSetting {
    return setting === 'polite' || setting === 'assertive' || setting === 'off';
}

export function resolvePolitenessSetting(
    node: Node | null
): 'polite' | 'assertive' | 'off' {
    if (!node || !isElement(node)) return 'off';

    const ariaLive = node.getAttribute('aria-live');
    if (isPolitenessSetting(ariaLive)) return ariaLive;

    const role = node.getAttribute('role');
    if (role === 'status') return 'polite';
    if (role === 'alert') return 'assertive';

    if (node.tagName.toLowerCase() === 'output') {
        return 'polite';
    }

    return resolvePolitenessSetting(getParentLiveRegion(node));
}
