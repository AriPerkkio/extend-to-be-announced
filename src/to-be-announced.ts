import CaptureAnnouncements, { PolitenessSetting } from 'aria-live-capture';

interface Options {
    /** Whether incorrectly used status messages should be logged as warning. */
    warnIncorrectStatusMessages: boolean;
}

// Map of announcements to their politeness settings
const announcements = new Map<string, Exclude<PolitenessSetting, 'off'>>();

/**
 * List of incorrectly used status messages
 * - Messages are marked as "invalid" when `polite` messages are mounted on DOM
 *   when their live region container mounts - instead of being updated into
 *   the container
 */
const incorrectlyUsedStatusMessages: string[] = [];

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

/**
 * Register `extend-to-be-expected` to track DOM nodes
 */
export function register(
    options: Options = { warnIncorrectStatusMessages: false }
): void {
    let cleanup: undefined | (() => void);

    beforeEach(() => {
        cleanup = CaptureAnnouncements({
            onCapture: (textContent, politenessSetting) => {
                announcements.set(textContent, politenessSetting);
            },
            onIncorrectStatusMessage: text =>
                incorrectlyUsedStatusMessages.push(text),
        });
    });

    afterEach(() => {
        if (options.warnIncorrectStatusMessages) {
            warnAboutIncorrectlyUsedStatusMessages();
        }

        if (cleanup) {
            cleanup();
            cleanup = undefined;
        }

        clearAnnouncements();
        incorrectlyUsedStatusMessages.splice(0);
    });
}

/**
 * Clear all captured announcements. Part of public API.
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
