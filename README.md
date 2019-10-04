# Jestを用いたJavaScriptのテストの研究

## テストの準備

`npm i`を実行します。

## テストの実行

`npm test`を実行します。  
`npm test -- --coverage`を実行するとカバレッジの取得もできます。（生成される`coverage/lcov-report/eventlist.js.html`が分かりやすい。）  
<img src="artwork/run_test_screen.png" srcset="artwork/run_test_screen.png 1x, artwork/run_test_screen_2x.png 2x">

## メモ

- `src/eventlist.js`をES2015+で記述すれば良かった
- [Moment.js](https://momentjs.com/)を[Luxon](https://moment.github.io/luxon/index.html)に変更したい
- 脱jQuery
