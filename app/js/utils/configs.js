import constants from 'js/utils/constants';

const configs = {
    INFURA_MAINNET_URL: 'https://mainnet.infura.io/T5WSC8cautR4KXyYgsRs',
    INFURA_TESTNET_URL: 'https://ropsten.infura.io/T5WSC8cautR4KXyYgsRs',
    LOCALHOST_URL: 'http://localhost:8545',
    PROVIDER_CONFIGS: {
        [constants.PROVIDER_TYPES.publicNode]: {
            doesSupportEventListening: false,
            canSendTransactions: false,
        },
        [constants.PROVIDER_TYPES.localNode]: {
            doesSupportEventListening: true,
            canSendTransactions: true,
        },
        [constants.PROVIDER_TYPES.localWeb3]: {
            doesSupportEventListening: true,
            canSendTransactions: true,
        },
    },
    METAMASK_CHROME_STORE_URL: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
    MIST_DOWNLOAD_URL: 'https://github.com/ethereum/mist/releases',
    ETHERSCAN_MAINNET_URL: 'https://etherscan.io/address/0xff3216f86a723f2c23b03b5cd1f622eb1a204159',
    ETHERSCAN_TESTNET_URL: 'https://testnet.etherscan.io/address/0xb89416b466cd6ec093722f841d409f79417b1ee1',
};

export default configs;
