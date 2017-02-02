const utils = {
    keyWords(words) {
        const keywords = {};
        for (const word of words) {
            keywords[word] = word;
        }
        return keywords;
    },
    assert(condition, message) {
        if (!condition) {
            throw new Error('Assertion failed:', message);
        }
    },
};

module.exports = utils;
