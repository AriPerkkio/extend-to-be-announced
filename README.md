# extend-to-be-announced

> Utility for asserting [Aria Live Regions](https://www.w3.org/TR/wai-aria-1.2/#dfn-live-region).

Validating Aria Live Regions with `@testing-library` and `jest-dom` requires developers to consider implementation details.
Current solutions are prone to false positives.

In test below it is not clearly visible that `Loading...` is not actually announced.
Assistive technologies are only expected to announce **updates** of Aria Live Containers with `polite` as politeness setting.

```js
render(<div role="status">Loading...</div>);

// Loading should be announced
const statusContainer = screen.getByRole('status');
expect(statusContainer).toHaveTextContent('Loading...');
```

Instead developers should check that messages are rendered into existing Aria Live Containers.

```js
const { rerender } = render(<div role="status"></div>);

// Status container should be present
const statusContainer = screen.getByRole('status');
expect(statusContainer).toBeEmptyDOMElement();

rerender(<div role="status">Loading...</div>);

// Loading should be announced
expect(statusContainer).toHaveTextContent('Loading...');
```

`toBeAnnounced` can be used to hide such implementation detail from tests.

```js
const { rerender } = render(<div role="status"></div>);
rerender(<div role="status">Loading...</div>);

expect('Loading...').toBeAnnounced('polite');
```

## Installation

```bash
yarn add --dev extend-to-be-announced
```

```js
import 'extend-to-be-announced';

expect('Loading...').toBeAnnounced();
expect('Loading...').toBeAnnounced('polite');
expect('Error occured...').toBeAnnounced();
expect('Error occured...').toBeAnnounced('assertive');
```

## Usage

### PASS :white_check_mark:

```
// Render#1
<div role='status></div>

// Render#2
<div role='status>Loading</div>

expect('Loading').toBeAnnounced();
```

```
// Render#1
<div role='alert>Error</div>

expect('Error').toBeAnnounced();
```

### FAIL :x:

```
// Render#1
<div role='status>Loading</div>

expect('Loading').toBeAnnounced();
```

## Support

|     Feature     |          Support          |
| :-------------: | :-----------------------: |
|     `role`      |    :white_check_mark:     |
|   `aria-ive`    |    :white_check_mark:     |
|  `aria-atomic`  | :x: :construction_worker: |
|   `aria-busy`   |            :x:            |
| `aria-relevant` |            :x:            |
