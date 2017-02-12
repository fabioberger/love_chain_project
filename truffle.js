const path = require('path');

module.exports = {
    networks: {
        development: {
            host: 'localhost',
            port: 8545,
            network_id: '*', // Match any network id
        },
        ropsten: {
            host: 'localhost',
            port: 8546,
            network_id: 3,
        },
        mainnet: {
            host: 'localhost',
            port: 8547,
            network_id: 1,
            gas: 1990000,
        },
    },
    migrations_directory: path.join(__dirname, '/migrations')
};
