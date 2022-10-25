## [1.0.0](https://github.com/AriPerkkio/extend-to-be-announced/compare/v0.6.0...v1.0.0) (2022-10-22)


### ⚠ BREAKING CHANGES

* cjs and esm builds
* Adds support for Vitest
- Entrypoint for Jest has moved to `import 'extend-to-be-announced/jest'`
- Entrypoint for Jest's manual registration has moved to `import { register } 'extend-to-be-announced/jest/register'`

### Features

* cjs and esm builds ([b370583](https://github.com/AriPerkkio/extend-to-be-announced/commit/b3705830b05337d26c90f63f904551aa33b56ab5))
* support vitest ([4f2995c](https://github.com/AriPerkkio/extend-to-be-announced/commit/4f2995cd2665c0d6b341d3ae62e8f83561b5194a))

## [0.6.0](https://github.com/AriPerkkio/extend-to-be-announced/compare/v0.5.0...v0.6.0) (2022-02-13)


### Features

* support shadow dom ([92c99e7](https://github.com/AriPerkkio/extend-to-be-announced/commit/92c99e761a7796adb192dfe517aee2f5865d00c5))

## [0.5.0](https://github.com/AriPerkkio/extend-to-be-announced/compare/v0.4.1...v0.5.0) (2021-11-07)


### ⚠ BREAKING CHANGES

* remove `warnIncorrectStatusMessages` API

### Bug Fixes

* remove `warnIncorrectStatusMessages` API ([9e89b52](https://github.com/AriPerkkio/extend-to-be-announced/commit/9e89b5270ad405613bd3d98f1c72c093d9218590))

### [0.4.1](https://github.com/AriPerkkio/extend-to-be-announced/compare/v0.4.0...v0.4.1) (2021-09-06)

## [0.4.0](https://github.com/AriPerkkio/extend-to-be-announced/compare/v0.3.0...v0.4.0) (2021-06-22)


### Features

* switch to `aria-live-capture` ([764f41e](https://github.com/AriPerkkio/extend-to-be-announced/commit/764f41e89bcc06d0dcccc4c58746e0100797b088))

## [0.3.0](https://github.com/AriPerkkio/extend-to-be-announced/compare/v0.2.0...v0.3.0) (2021-04-11)


### ⚠ BREAKING CHANGES

* Previously index.js entrypoint automatically registered extender. Now this is done by "/register" entrypoint
- Adds entrypoints for exported utilities

### Features

* add clearAnnouncements API ([6da067b](https://github.com/AriPerkkio/extend-to-be-announced/commit/6da067bcb8cec0ad74a55b04cc7623065c8a4240))
* add getAnnouncements API ([402a7eb](https://github.com/AriPerkkio/extend-to-be-announced/commit/402a7eb1a6e258de6bd76b96ecd059d2cca6b6b9))
* entrypoints for registration and utilities ([44877d1](https://github.com/AriPerkkio/extend-to-be-announced/commit/44877d12db5efb4749cd09e2ac92a5cd01588704))
* format announcements in error message with hyphens ([5076747](https://github.com/AriPerkkio/extend-to-be-announced/commit/5076747123599230dc8121cc1b90edf822bd2b37))
* include count of captured announcements in error messages ([7f47d45](https://github.com/AriPerkkio/extend-to-be-announced/commit/7f47d45db73817bd2e1db11dee224507acbded5d))
* trim white-space of announcements ([99ba420](https://github.com/AriPerkkio/extend-to-be-announced/commit/99ba420ab694f2b2b9f7773b80b48b29413e9bf8))


### Bug Fixes

* detect nodes added by insertAdjacentText ([583721c](https://github.com/AriPerkkio/extend-to-be-announced/commit/583721cec4874d38cf0b4c02edf4ff97ddb7c5df))

## [0.2.0](https://github.com/AriPerkkio/extend-to-be-announced/compare/v0.1.2...v0.2.0) (2021-03-31)


### Features

* pattern matching ([f860116](https://github.com/AriPerkkio/extend-to-be-announced/commit/f860116a836a38ba2e6f2d121382f65b94e7a0c8))


### Bug Fixes

* detect element nodes from nodeType ([1d3c519](https://github.com/AriPerkkio/extend-to-be-announced/commit/1d3c5194a708bb1698f3d075db0bf28f43e5d1f7))
* detect nodes added by append ([11d9fbf](https://github.com/AriPerkkio/extend-to-be-announced/commit/11d9fbfe6ada7deafbb5d57958ac18e2a241e490))
* detect nodes added by before ([ecb8ffe](https://github.com/AriPerkkio/extend-to-be-announced/commit/ecb8ffed8d2536dcb6df1ac89750ce771ce34107))
* detect nodes added by insertAdjacentElement ([fb6be90](https://github.com/AriPerkkio/extend-to-be-announced/commit/fb6be90eeb297cf04bece50776862e90c874f3f7))
* detect nodes added by prepend ([0b8e95d](https://github.com/AriPerkkio/extend-to-be-announced/commit/0b8e95dfc9867860e7cae0669e56dac69d09364d))
* detect nodes added by replaceChild ([45844af](https://github.com/AriPerkkio/extend-to-be-announced/commit/45844af30e92a5256c9fd680d59c25a69eae49d8))
* error messages to consider pattern+not+politeness_setting ([c438ba0](https://github.com/AriPerkkio/extend-to-be-announced/commit/c438ba08b196651e301b45732753d4ded85eecc5))

### [0.1.2](https://github.com/AriPerkkio/extend-to-be-announced/compare/v0.1.1...v0.1.2) (2021-03-25)


### Bug Fixes

* detect nodes added by insertBefore ([1f3c34c](https://github.com/AriPerkkio/extend-to-be-announced/commit/1f3c34cdad0959cefe5e3688519653fdb7853916))

### [0.1.1](https://github.com/AriPerkkio/extend-to-be-announced/compare/v0.1.0...v0.1.1) (2021-03-03)


### Bug Fixes

* detect appended text nodes ([8d55459](https://github.com/AriPerkkio/extend-to-be-announced/commit/8d5545969a6d8573d5bd7b02843619c3f112f53d))

## [0.1.0](https://github.com/AriPerkkio/extend-to-be-announced/compare/1518775c3a6fe8b9cfe21f08118e4444f85866ca...v0.1.0) (2021-02-28)


### Features

* cleanup to restore intercepted methods and setters ([9ab83aa](https://github.com/AriPerkkio/extend-to-be-announced/commit/9ab83aa5b2b2d573519c8223bdfea77abde1b18e))
* extend implicit politeness setting support ([2ba171b](https://github.com/AriPerkkio/extend-to-be-announced/commit/2ba171b39d412afa2271c910e86a63d837ac20df))
* initial working version ([1518775](https://github.com/AriPerkkio/extend-to-be-announced/commit/1518775c3a6fe8b9cfe21f08118e4444f85866ca))
* intercept textContent changes ([5321070](https://github.com/AriPerkkio/extend-to-be-announced/commit/532107004eb8e4d5a5ac3fe780ac3283bd7092c8))
* option to warn about incorrectly used status messages ([477008f](https://github.com/AriPerkkio/extend-to-be-announced/commit/477008fcf336f8dcaa93de1b5fd473d0768363b8))
* replace mutation-observer with monkey-patching append-child ([11eee9d](https://github.com/AriPerkkio/extend-to-be-announced/commit/11eee9d4dd685e5f528091e34230a72739329a25))
* support .not assertions ([34b6e3c](https://github.com/AriPerkkio/extend-to-be-announced/commit/34b6e3c2e14a22fb326e3793cae8594ef3544fc6))
* support asserting by politeness level ([552e542](https://github.com/AriPerkkio/extend-to-be-announced/commit/552e54208f34659cc852c9ab59d8b4bd217a27c3))
* support changes of role & aria-live ([87cf7e0](https://github.com/AriPerkkio/extend-to-be-announced/commit/87cf7e0b43ecaf3052e824b56261164f9c509f80))
* support TEXT_NODE changes ([7ce9fac](https://github.com/AriPerkkio/extend-to-be-announced/commit/7ce9facac52fabbcffb2bb1bf82eebb6c0cd8ce5))

