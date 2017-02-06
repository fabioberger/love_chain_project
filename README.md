Crypto Valentine Project
------------------------------------

# Front-end Dev Setup

`npm install`

# Start Dev Server

`npm run dev`

# Contract development

Start `testrpc`:

```
testrpc
```

Watch for test changes and re-compile with babel:

```
node ./node_modules/babel-cli/bin/babel.js ./uncompiled_tests -w --out-dir ./test
```

Update a test and run:

```
truffle test
```

from within the `solidity` folder.
