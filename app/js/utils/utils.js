import constants from 'js/utils/constants';

const utils = {
    keyWords(words) {
        const keywords = {};
        for (const word of words) {
            keywords[word] = word;
        }
        return keywords;
    },
    isNullAddress(address) {
        return address === constants.NULL_ADDRESS;
    },
};

export default utils;
