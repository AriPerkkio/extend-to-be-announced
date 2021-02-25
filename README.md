# extend-to-be-announced

Utility for asserting [Aria Live Regions](https://www.w3.org/TR/wai-aria-1.2/#dfn-live-region).

```bash
yarn add --dev extend-to-be-announced
```

```js
import 'extend-to-be-announced';

expect('Loading...').toBeAnnounced();
expect('Error occured...').toBeAnnounced();
```

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
