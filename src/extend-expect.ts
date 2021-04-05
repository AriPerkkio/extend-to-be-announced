import { toBeAnnounced } from './to-be-announced';
import { PolitenessSetting } from './utils';

expect.extend({ toBeAnnounced });

/// <reference types="jest" />
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
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
