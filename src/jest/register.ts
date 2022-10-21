import { PolitenessSetting } from 'aria-live-capture';

import { toBeAnnounced, register as __register } from '../to-be-announced';

declare global {
    namespace jest {
        interface Matchers<R> {
            /**
             * Assert whether given message was announced by ARIA live region.
             *
             * @param politenessSetting `POLITENESS_SETTING` of the announcement
             */
            toBeAnnounced(
                politenessSetting?: Exclude<PolitenessSetting, 'off'>
            ): R;
        }
    }
}

// @ts-expect-error -- Jest globals
expect.extend({ toBeAnnounced });

/**
 * Register `extend-to-be-expected` to track DOM nodes
 */
export function register(options?: Parameters<typeof __register>[0]) {
    __register(
        options,
        // @ts-expect-error -- Jest globals
        { afterEach, beforeEach }
    );
}
