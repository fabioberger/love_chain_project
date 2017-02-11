const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

const utils = {
    keyWords(words) {
        const keywords = {};
        for (const word of words) {
            keywords[word] = word;
        }
        return keywords;
    },
    isNullAddress(address) {
        return address === NULL_ADDRESS;
    },
};

export { utils as default, NULL_ADDRESS };
