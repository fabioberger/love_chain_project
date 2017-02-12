import constants from 'js/utils/constants';

const configs = {
    INFURA_MAINNET_URL: 'https://mainnet.infura.io/T5WSC8cautR4KXyYgsRs',
    INFURA_TESTNET_URL: 'https://ropsten.infura.io/T5WSC8cautR4KXyYgsRs',
    PROVIDER_CONFIGS: {
        [constants.PROVIDER_TYPES.publicNode]: {
            doesSupportEventListening: false,
            canSendTransactions: false,
        },
        [constants.PROVIDER_TYPES.localWeb3]: {
            doesSupportEventListening: true,
            canSendTransactions: true,
        },
    },
    METAMASK_CHROME_STORE_URL: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
};

export default configs;
