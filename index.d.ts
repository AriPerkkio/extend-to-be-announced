declare global {
    namespace jest {
        interface Matchers<R> {
            toBeAnnounced(): Promise<jest.CustomMatcherResult>;
        }
    }
}

export {};
