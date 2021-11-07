# extend-to-be-announced

> Utility for asserting [ARIA live regions](https://www.w3.org/TR/wai-aria-1.2/#dfn-live-region).

Validating ARIA live regions with `@testing-library` and `jest-dom` requires developers to consider implementation details.
Current solutions are prone to false positives.

In test below it is not clearly visible that `Loading...` is not actually announced.
Assistive technologies are only expected to announce **updates** of ARIA live regions with `polite` as politeness setting.

```js
render(<div role="status">Loading...</div>);

// Loading should be announced ❌
const statusContainer = screen.getByRole('status');
expect(statusContainer).toHaveTextContent('Loading...');
// Not detected by assistive technologies since content of
// live container was not updated
```

Instead developers should check that messages are rendered into existing Aria Live Containers.

```js
const { rerender } = render(<div role="status"></div>);

// Status container should be present
const statusContainer = screen.getByRole('status');

// Status container should initially be empty
expect(statusContainer).toBeEmptyDOMElement();

// Update content of live region
rerender(<div role="status">Loading...</div>);

// Loading should be announced ✅
expect(statusContainer).toHaveTextContent('Loading...');
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

Import registration entrypoint in your [test setup](https://jestjs.io/docs/en/configuration.html#setupfilesafterenv-array).

```js
import 'extend-to-be-announced/register';
```

For setting up registration options use `register(options)` method instead.

```js
import { register } from 'extend-to-be-announced';

register();
```

### Assertions

#### toBeAnnounced

Assert whether given message was announced by ARIA live region.
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
