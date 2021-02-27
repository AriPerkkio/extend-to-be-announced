declare global {
    namespace jest {
        interface Matchers<R> {
            toBeAnnounced(
                politenessSetting?: 'polite' | 'assertive'
            ): Promise<jest.CustomMatcherResult>;
        }
    }
}

export {};
