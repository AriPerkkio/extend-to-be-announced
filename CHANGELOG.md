## 0.6.0 (2022-02-13)

* 0.6.0 ([69eba57](https://github.com/AriPerkkio/extend-to-be-announced/commit/69eba57))
* feat: support shadow dom ([92c99e7](https://github.com/AriPerkkio/extend-to-be-announced/commit/92c99e7))



## 0.5.0 (2021-11-07)

* 0.5.0 ([a05dc1c](https://github.com/AriPerkkio/extend-to-be-announced/commit/a05dc1c))
* fix!: remove `warnIncorrectStatusMessages` API ([9e89b52](https://github.com/AriPerkkio/extend-to-be-announced/commit/9e89b52))
* test: `aria-live="assertive"` test fixes ([c175d66](https://github.com/AriPerkkio/extend-to-be-announced/commit/c175d66))
* chore(deps): update aria-live-capture to 0.4.0 ([cc625ae](https://github.com/AriPerkkio/extend-to-be-announced/commit/cc625ae))



## <small>0.4.1 (2021-09-06)</small>

* 0.4.1 ([32b4dc1](https://github.com/AriPerkkio/extend-to-be-announced/commit/32b4dc1))
* chore: add lint and validate scripts ([32c05c6](https://github.com/AriPerkkio/extend-to-be-announced/commit/32c05c6))
* chore(deps): update `aria-live-capture` ([661c126](https://github.com/AriPerkkio/extend-to-be-announced/commit/661c126))
* chore(deps): update `aria-live-capture` ([ca3a4cf](https://github.com/AriPerkkio/extend-to-be-announced/commit/ca3a4cf))
* chore(deps): update `aria-live-capture` ([7c6b0c4](https://github.com/AriPerkkio/extend-to-be-announced/commit/7c6b0c4))
* test: add `role="log"` test cases ([740ae09](https://github.com/AriPerkkio/extend-to-be-announced/commit/740ae09))
* refactor: use typings of `PolitenessSetting` directly from `aria-live-capture` ([794b7fa](https://github.com/AriPerkkio/extend-to-be-announced/commit/794b7fa))



## 0.4.0 (2021-06-22)

* 0.4.0 ([7422a46](https://github.com/AriPerkkio/extend-to-be-announced/commit/7422a46))
* feat: switch to `aria-live-capture` ([764f41e](https://github.com/AriPerkkio/extend-to-be-announced/commit/764f41e))
* refactor: move live region capturing logic into its own module ([27a03cb](https://github.com/AriPerkkio/extend-to-be-announced/commit/27a03cb))



## 0.3.0 (2021-04-11)

* 0.3.0 ([4612b8b](https://github.com/AriPerkkio/extend-to-be-announced/commit/4612b8b))
* feat!: entrypoints for registration and utilities ([44877d1](https://github.com/AriPerkkio/extend-to-be-announced/commit/44877d1))
* build: clean entrypoints ([ff4e50a](https://github.com/AriPerkkio/extend-to-be-announced/commit/ff4e50a))
* feat: add clearAnnouncements API ([6da067b](https://github.com/AriPerkkio/extend-to-be-announced/commit/6da067b))
* feat: add getAnnouncements API ([402a7eb](https://github.com/AriPerkkio/extend-to-be-announced/commit/402a7eb))
* feat: format announcements in error message with hyphens ([5076747](https://github.com/AriPerkkio/extend-to-be-announced/commit/5076747))
* feat: include count of captured announcements in error messages ([7f47d45](https://github.com/AriPerkkio/extend-to-be-announced/commit/7f47d45))
* feat: trim white-space of announcements ([99ba420](https://github.com/AriPerkkio/extend-to-be-announced/commit/99ba420))
* test: add todo for ParentNode.replaceChildren, ref jsdom/jsdom#3102 ([915c240](https://github.com/AriPerkkio/extend-to-be-announced/commit/915c240)), closes [jsdom/jsdom#3102](https://github.com/jsdom/jsdom/issues/3102)
* test: move pattern match outside politeness specific tests ([5c57659](https://github.com/AriPerkkio/extend-to-be-announced/commit/5c57659))
* refactor: use onInsertAdjacent for insertAdjacentElement ([903639f](https://github.com/AriPerkkio/extend-to-be-announced/commit/903639f))
* refactor: use onInsertAdjacent for insertAdjacentHTML ([db06ed6](https://github.com/AriPerkkio/extend-to-be-announced/commit/db06ed6))
* fix: detect nodes added by insertAdjacentText ([583721c](https://github.com/AriPerkkio/extend-to-be-announced/commit/583721c))


### BREAKING CHANGE

* Previously index.js entrypoint automatically registered extender. Now this is done by "/register" entrypoint
- Adds entrypoints for exported utilities


## 0.2.0 (2021-03-31)

* 0.2.0 ([5618c6a](https://github.com/AriPerkkio/extend-to-be-announced/commit/5618c6a))
* fix: detect element nodes from nodeType ([1d3c519](https://github.com/AriPerkkio/extend-to-be-announced/commit/1d3c519))
* fix: detect nodes added by append ([11d9fbf](https://github.com/AriPerkkio/extend-to-be-announced/commit/11d9fbf))
* fix: detect nodes added by before ([ecb8ffe](https://github.com/AriPerkkio/extend-to-be-announced/commit/ecb8ffe))
* fix: detect nodes added by insertAdjacentElement ([fb6be90](https://github.com/AriPerkkio/extend-to-be-announced/commit/fb6be90))
* fix: detect nodes added by prepend ([0b8e95d](https://github.com/AriPerkkio/extend-to-be-announced/commit/0b8e95d))
* fix: detect nodes added by replaceChild ([45844af](https://github.com/AriPerkkio/extend-to-be-announced/commit/45844af))
* fix: error messages to consider pattern+not+politeness_setting ([c438ba0](https://github.com/AriPerkkio/extend-to-be-announced/commit/c438ba0))
* feat: pattern matching ([f860116](https://github.com/AriPerkkio/extend-to-be-announced/commit/f860116))
* refactor: use same handler for all methods mounting nodes to DOM ([178a7b6](https://github.com/AriPerkkio/extend-to-be-announced/commit/178a7b6))



## <small>0.1.2 (2021-03-25)</small>

* 0.1.2 ([9e52998](https://github.com/AriPerkkio/extend-to-be-announced/commit/9e52998))
* fix: detect nodes added by insertBefore ([1f3c34c](https://github.com/AriPerkkio/extend-to-be-announced/commit/1f3c34c))
* test: refactor test cases structure ([5de8fde](https://github.com/AriPerkkio/extend-to-be-announced/commit/5de8fde))



## <small>0.1.1 (2021-03-03)</small>

* 0.1.1 ([97961b2](https://github.com/AriPerkkio/extend-to-be-announced/commit/97961b2))
* docs: fix typos ([ac5fa5e](https://github.com/AriPerkkio/extend-to-be-announced/commit/ac5fa5e))
* docs: improve examples ([f9fe089](https://github.com/AriPerkkio/extend-to-be-announced/commit/f9fe089))
* fix: detect appended text nodes ([8d55459](https://github.com/AriPerkkio/extend-to-be-announced/commit/8d55459))



## 0.1.0 (2021-02-28)

* 0.1.0 ([cffa52e](https://github.com/AriPerkkio/extend-to-be-announced/commit/cffa52e))
* docs: initial docs ([593733e](https://github.com/AriPerkkio/extend-to-be-announced/commit/593733e))
* docs: intro + examples ([0fef612](https://github.com/AriPerkkio/extend-to-be-announced/commit/0fef612))
* test: <output> and aria-live="off" ([236abae](https://github.com/AriPerkkio/extend-to-be-announced/commit/236abae))
* test: add DOM test cases ([c20ff0c](https://github.com/AriPerkkio/extend-to-be-announced/commit/c20ff0c))
* test: add tests for status, alert, polite, assertive ([88fe6a1](https://github.com/AriPerkkio/extend-to-be-announced/commit/88fe6a1))
* test(react): refactor to use rerender ([414520d](https://github.com/AriPerkkio/extend-to-be-announced/commit/414520d))
* test(warning): add test cases for correct live region usage ([9433acb](https://github.com/AriPerkkio/extend-to-be-announced/commit/9433acb))
* feat: cleanup to restore intercepted methods and setters ([9ab83aa](https://github.com/AriPerkkio/extend-to-be-announced/commit/9ab83aa))
* feat: extend implicit politeness setting support ([2ba171b](https://github.com/AriPerkkio/extend-to-be-announced/commit/2ba171b))
* feat: initial working version ([1518775](https://github.com/AriPerkkio/extend-to-be-announced/commit/1518775))
* feat: intercept textContent changes ([5321070](https://github.com/AriPerkkio/extend-to-be-announced/commit/5321070))
* feat: option to warn about incorrectly used status messages ([477008f](https://github.com/AriPerkkio/extend-to-be-announced/commit/477008f))
* feat: replace mutation-observer with monkey-patching append-child ([11eee9d](https://github.com/AriPerkkio/extend-to-be-announced/commit/11eee9d))
* feat: support .not assertions ([34b6e3c](https://github.com/AriPerkkio/extend-to-be-announced/commit/34b6e3c))
* feat: support asserting by politeness level ([552e542](https://github.com/AriPerkkio/extend-to-be-announced/commit/552e542))
* feat: support changes of role & aria-live ([87cf7e0](https://github.com/AriPerkkio/extend-to-be-announced/commit/87cf7e0))
* feat: support TEXT_NODE changes ([7ce9fac](https://github.com/AriPerkkio/extend-to-be-announced/commit/7ce9fac))
* refactor: DRY, add comments ([604de18](https://github.com/AriPerkkio/extend-to-be-announced/commit/604de18))
* refactor: matcher result simplified with multiple returns ([4e8caf1](https://github.com/AriPerkkio/extend-to-be-announced/commit/4e8caf1))
* refactor: split utils and interceptors ([1b7d109](https://github.com/AriPerkkio/extend-to-be-announced/commit/1b7d109))
* build: add repository infos ([a2b20cd](https://github.com/AriPerkkio/extend-to-be-announced/commit/a2b20cd))
* chore: add build & publish setup ([19451f3](https://github.com/AriPerkkio/extend-to-be-announced/commit/19451f3))



