const path = require('path');

module.exports = {
    networks: {
        development: {
            host: 'localhost',
            port: 8545,
            network_id: '*' // Match any network id
        }
    },
    migrations_directory: path.join(__dirname, '/migrations')
};
