import _ from 'lodash';
import fakerPackage from 'faker';

const faker = {
    getFirstName() {
        return fakerPackage.Name.firstName().substr(0, 25);
    },
    getCustomMessage() {
        return fakerPackage.Lorem.sentences().substr(0, 140);
    },
    getEtherAddress() {
        // Warning: this uses javascript's Math.random() method and is therefore not cryptographically
        // secure. Only use these ether addresses for fake data purposes!
        const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        let address = '0x';
        _.times(40, () => {
            const characterIndex = Math.floor((Math.random() * 61) + 1);
            const character = letters[characterIndex];
            address += character;
        })
        return address;
    },
    createRequest() {
        const request = {
            requesterName: this.getFirstName(),
            valentineName: this.getFirstName(),
            customMessage: this.getCustomMessage(),
            wasAccepted: false,
            valentineAddress: this.getEtherAddress(),
            requesterAddress: this.getEtherAddress(),
        };
        return request;
    },
};

export default faker;
