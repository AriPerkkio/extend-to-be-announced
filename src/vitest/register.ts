import { PolitenessSetting } from 'aria-live-capture';
import { afterEach, beforeEach, expect } from 'vitest';

import { register as __register, toBeAnnounced } from '../to-be-announced';

interface ToBeAnnouncedMatchers<T = any> {
    /**
     * Assert whether given message was announced by ARIA live region.
     *
     * @param politenessSetting `POLITENESS_SETTING` of the announcement
     */
    toBeAnnounced(politenessSetting?: Exclude<PolitenessSetting, 'off'>): T;
}

declare module '@vitest/expect' {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Assertion<T> extends ToBeAnnouncedMatchers<T> {}
}

// For Vitest below 0.31.x
declare global {
    namespace Vi {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface Assertion<T> extends ToBeAnnouncedMatchers<T> {}
    }
}

expect.extend({ toBeAnnounced });

/**
 * Register `extend-to-be-expected` to track DOM nodes
 */
export function register(options?: Parameters<typeof __register>[0]) {
    __register(options, { afterEach, beforeEach });
}
