import { PolitenessSetting } from 'aria-live-capture';
import { afterEach, beforeEach, expect } from 'vitest';

import { register as __register, toBeAnnounced } from '../to-be-announced';

interface ToBeAnnouncedMatchers {
    /**
     * Assert whether given message was announced by ARIA live region.
     *
     * @param politenessSetting `POLITENESS_SETTING` of the announcement
     */
    toBeAnnounced(politenessSetting?: Exclude<PolitenessSetting, 'off'>): void;
}

declare global {
    namespace Vi {
        interface Assertion extends ToBeAnnouncedMatchers {}
    }
}

expect.extend({ toBeAnnounced });

/**
 * Register `extend-to-be-expected` to track DOM nodes
 */
export function register(options?: Parameters<typeof __register>[0]) {
    __register(options, { afterEach, beforeEach });
}
