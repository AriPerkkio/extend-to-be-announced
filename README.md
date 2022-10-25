# extend-to-be-announced

[![version](https://img.shields.io/npm/v/extend-to-be-announced)](https://www.npmjs.com/package/extend-to-be-announced)

[Motivation](#Motivation) | [Installation](#installation) | [Usage](#usage) | [Support](#support)

> Utility for asserting [ARIA live regions](https://www.w3.org/TR/wai-aria-1.2/#dfn-live-region).

`extend-to-be-announced` is a matcher extender for [Jest](https://jestjs.io/) and [Vitest](https://vitest.dev/). It makes validating ARIA live regions extremely easy. Internally it is utilizing [`aria-live-capture`](https://github.com/AriPerkkio/aria-live-capture) for announcement detection.

For Storybook integration see [`storybook-addon-aria-live`](https://github.com/AriPerkkio/storybook-addon-aria-live).

## Motivation

Read more about inspiration from [Building testing tools for ARIA live regions](https://loihdefactor.com/en/2022/04/29/building-testing-tools-for-aria-live-regions).

Validating ARIA live regions with [`@testing-library`](https://testing-library.com/) and [`jest-dom`](https://github.com/testing-library/jest-dom) requires developers to consider implementation details.
Current solutions are prone to false positives.

In test below it is not clearly visible that `Loading...` is not actually announced.
Assistive technologies are only expected to announce **updates** of ARIA live regions - not the initial content.

```js
render(<div role="status">Loading...</div>);

const liveRegion = screen.getByRole('status');

// Loading is not be announced by assistive technologies ❌
// Content of live region has not updated. This is it's initial text content.
expect(liveRegion).toHaveTextContent('Loading...');
```

Instead developers should check that messages are rendered into existing ARIA Live regions.

```js
const { rerender } = render(<div role="status"></div>);

// Live region should be present
const liveRegion = screen.getByRole('status');

// Live region should initially be empty
expect(liveRegion).toBeEmptyDOMElement();

// Update content of the live region
rerender(<div role="status">Loading...</div>);

// Loading is announced by assistive technologies ✅
expect(liveRegion).toHaveTextContent('Loading...');
```

`toBeAnnounced` can be used to hide such implementation detail from tests.

```js
const { rerender } = render(<div role="status"></div>);

rerender(<div role="status">Loading...</div>);

expect('Loading...').toBeAnnounced('polite');
```

## Installation

`extend-to-be-announced` should be included in development dependencies.

```bash
yarn add --dev extend-to-be-announced
```

## Usage

### Test setup

There are out-of-the-box setups for Jest and Vitest.

#### Jest

Import registration entrypoint in your [test setup](https://jestjs.io/docs/en/configuration.html#setupfilesafterenv-array).

```js
import 'extend-to-be-announced/jest';
```

For setting up registration options use `register(options)` method instead.

```js
import { register } from 'extend-to-be-announced/jest/register';

register({
    /** Indicates whether live regions inside `ShadowRoot`s should be tracked. Defaults to false. */
    includeShadowDom: true,
});
```

#### Vitest

Import registration entrypoint in your [test setup](https://vitest.dev/config/#setupfiles).

```js
import 'extend-to-be-announced/vitest';
```

Vitest also requires all dependencies that `import` Vitest internally to be inlined. Add `extend-to-be-announced` to your configuration's `test.deps.inline` array:

```js
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        deps: {
            inline: ['extend-to-be-announced'],
        },
    },
});
```

For setting up registration options use `register(options)` method instead.

```js
import { register } from 'extend-to-be-announced/vitest/register';

register({
    /** Indicates whether live regions inside `ShadowRoot`s should be tracked. Defaults to false. */
    includeShadowDom: true,
});
```

### Typescript

This package utilizes [Typescript's `exports` support](https://www.typescriptlang.org/docs/handbook/esm-node.html#packagejson-exports-imports-and-self-referencing) for type declarations. You'll need to set `"moduleResolution": "node16"` or `"moduleResolution": "nodenext"` in your `tsconfig.json` in order to have typings picked properly. For legacy setups where certain fields of `tsconfig.json` cannot be modified, such as `create-react-app`, there is a work-around entrypoint for `jest`.

```json
{
    "compilerOptions": {
        "moduleResolution": "node16" // Or nodenext
    }
}
```

### Assertions

#### toBeAnnounced

Assert whether given message was announced by assistive technologies.
Accepts string or regexp as matcher value.

```js
expect('Loading...').toBeAnnounced();
expect(/loading/i).toBeAnnounced();
expect('Error occured...').toBeAnnounced();
expect(/error occured/i).toBeAnnounced();
```

Politeness setting of announcement can be optionally asserted.

```js
expect('Loading...').toBeAnnounced('polite');
expect('Error occured...').toBeAnnounced('assertive');
```

##### Examples

<!-- prettier-ignore -->
```html
Render#1 | <div role="status"></div>
Render#2 | <div role="status">Loading</div>
PASS ✅  | expect('Loading').toBeAnnounced('polite');
```

<!-- prettier-ignore -->
```html
Render#1 | <div role="alert">Error</div>
PASS ✅  | expect('Error').toBeAnnounced('assertive');
```

<!-- prettier-ignore -->
```html
Render#1 | <div></div>
Render#2 | <div role="alert">Error</div>
PASS ✅  | expect('Error').toBeAnnounced();
```

<!-- prettier-ignore -->
```html
Render#1 | <div role="status">Loading</div>
FAIL ❌  | expect('Loading').toBeAnnounced();
```

<!-- prettier-ignore -->
```html
Render#1 | <div></div>
Render#2 | <div role="status">Loading</div>
FAIL ❌  | expect('Loading').toBeAnnounced();
```

With `register({ includeShadowDom: true })`:

<!-- prettier-ignore -->
```html
Render#1 | <div role="status">
         |     #shadow-root
         |     <div></div>
         | </div>
         |
Render#2 | <div role="status">
         |     #shadow-root
         |     <div>Loading</div>
         | </div>
         |
PASS ✅  | expect('Loading').toBeAnnounced()
```

### Utilities

#### getAnnouncements

Get all announcements as `Map<string, PolitenessSetting>`.

```js
import { getAnnouncements } from 'extend-to-be-announced';
getAnnouncements();

> Map {
>   "Status message" => "polite",
>   "Alert message" => "assertive",
> }
```

#### clearAnnouncements

Clear all captured announcements.

```js
import { clearAnnouncements } from 'extend-to-be-announced';
clearAnnouncements();
```

## Support

|     Feature     | Status |
| :-------------: | :----: |
|     `role`      |   ✅   |
|   `aria-live`   |   ✅   |
|  `aria-atomic`  | ❌ 👷  |
|   `aria-busy`   |   ❌   |
| `aria-relevant` |   ❌   |
