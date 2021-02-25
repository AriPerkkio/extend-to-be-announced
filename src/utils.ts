type PolitenessSetting = 'polite' | 'assertive' | 'off';
type Restore = () => void;

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

export function isElement(node: Node): node is Element {
    return node && 'closest' in node;
}

export function isInDOM(node: Node): boolean {
    return isElement(node) && node.closest('html') != null;
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

export function interceptSetter<
    T extends Object = Object,
    P extends keyof T = keyof T,
    K extends T[P] = T[P]
>(obj: T, property: P, method: (value: K) => void): Restore {
    const descriptor = Object.getOwnPropertyDescriptor(obj, property);
    if (!descriptor || !descriptor.set) throw new Error('whereismydescriptor');

    const originalSetter = descriptor.set;

    descriptor.set = function interceptedSet(value: K) {
        const output = originalSetter.call(this, value);
        method.call(this, value);

        return output;
    };

    Object.defineProperty(obj, property, descriptor);

    return function restore(): void {
        descriptor.set = originalSetter;
        Object.defineProperty(obj, property, descriptor);
    };
}

export function interceptMethod<
    T extends Object = Object,
    P extends keyof T = keyof T
>(object: T, methodName: P, method: (...args: any[]) => void): Restore {
    const original = (object[methodName] as unknown) as Function;

    if (typeof original !== 'function') {
        throw new Error(
            `Expected ${methodName} to be a function. Received ${typeof original}: ${original}`
        );
    }

    if (typeof method !== 'function') {
        throw new Error(
            `Expected method to be a function. Received ${typeof method}: ${method}`
        );
    }

    function interceptedMethod(this: T, ...args: any) {
        const output = original.call(this, ...args);
        method.call(this, ...args);

        return output;
    }

    object[methodName] = interceptedMethod as any;

    return function restore() {
        object[methodName] = original as any;
    };
}
