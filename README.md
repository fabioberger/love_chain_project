The Love Chain Project
------------------------------------

[![Join the chat at https://gitter.im/love_chain_project/Lobby](https://badges.gitter.im/love_chain_project/Lobby.svg)](https://gitter.im/love_chain_project/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A decentralized valentine registry built on Ethereum

Have any questions? Find us at: https://gitter.im/love_chain_project/Lobby#

# Front-end Dev Setup

`npm install`

# Start Dev Server

`npm run dev`

# Contract development

Start `testrpc`:

```
testrpc
```

Watch for test changes and re-compile tests with babel:

```
node ./node_modules/babel-cli/bin/babel.js ./uncompiled_tests -w --out-dir ./test
```

Update a test and run:

```
truffle test
```
