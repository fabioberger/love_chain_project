import _ from 'lodash';
import fakerPackage from 'faker';

const faker = {
    getFirstName() {
        return fakerPackage.Name.firstName().substr(0, 25);
    },
    getWasAccepted() {
        const wasAccepted = !!Math.floor((Math.random() * 2));
        return wasAccepted;
    },
    getCustomMessage() {
        // return fakerPackage.Lorem.sentences().substr(0, 140);
        const customMessages = [
            'I love you!',
            'Thanks for being a part of my life...',
            'Te quiero mucho mucho mucho querido!!!',
            'Ever since I first saw you, I knew you were the one for me. Can\'t believe it\'s been \
            2 years already. Looking forward to the next one aswell!',
            'Thanks for making me the person that I am today. Love you so much!',
            'Je t\'aime mon amour. Tu me fait tellement heureuse, j\'ai envie de te revoir bientot!',
            'Oi amor! Feliz dia dos Namorados! Agora nosso amor e enscrito eternamente no blockchain. Te amo',
            'You are the best',
            'Be my valentine?',
            'You are all I need on this valentines... Just wait until you see the surprise at home :)',
            'Happy valentine!',
            'Our love is now immutable',
            'Seit du in meiner leben eigetreten bist, bin is so glucklich. Danke',
            'Miss you my love',
        ];
        const messageIndex = Math.floor((Math.random() * customMessages.length - 1) + 1);
        return customMessages[messageIndex];
    },
    getEtherAddress() {
        // Warning: this uses javascript's Math.random() method and is therefore not cryptographically
        // secure. Only use these ether addresses for fake data purposes!
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        let address = '0x';
        _.times(40, () => {
            const characterIndex = Math.floor((Math.random() * (characters.length - 1)) + 1);
            const character = characters[characterIndex];
            address += character;
        })
        return address;
    },
    createRequest() {
        const request = {
            requesterName: this.getFirstName(),
            valentineName: this.getFirstName(),
            customMessage: this.getCustomMessage(),
            wasAccepted: this.getWasAccepted(),
            valentineAddress: this.getEtherAddress(),
            requesterAddress: this.getEtherAddress(),
        };
        return request;
    },
};

export default faker;
