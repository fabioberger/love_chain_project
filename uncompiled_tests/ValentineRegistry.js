import 'babel-polyfill';
import _ from 'lodash';
import Web3 from 'web3';

const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));

const ValentineRegistry = artifacts.require('./ValentineRegistry.sol');

const requesterName = 'Adam';
const valentineName = 'Eve';
const customMessage = 'I love you more then you love apples';

let registry;
beforeEach(async () => {
    registry = await ValentineRegistry.deployed();
});

contract('ValentineRegistry', accounts => {
    const owner = accounts[0];
    const accountTwo = accounts[1];

        it('should set msg.sender as the contract owner', async () => {
            const owner = await registry.owner.call({from: owner});
            assert.equal(owner, owner, 'owner should be set to the creater of the contract');
        });

        it('should create a targetedValentineRequest request if caller has sufficient gas', async () => {
            const sufficientValue = web3.toWei(0.1, 'ether');
            const valentineAddress = accounts[1];
            const result = await registry.createTargetedValentineRequest(requesterName, valentineName, customMessage,
                valentineAddress, {
                from: owner,
                value: sufficientValue,
            });
            if (!_.includes(_.map(result.logs, log => log.event), 'LogValentineRequestCreated')) {
                assert(false, 'Expected event `LogValentineRequestCreated` was not fired.');
            }
        });

        it('should retrieve a request by index', async () => {
            const sufficientValue = web3.toWei(0.1, 'ether');
            const valentineAddress = accounts[2];
            const result = await registry.createTargetedValentineRequest(requesterName, valentineName, customMessage,
                valentineAddress, {
                from: accountTwo,
                value: sufficientValue,
            });

            const numRequests = await registry.numRequesters.call({from: owner});
            const requests = [];
            for (let i = 0; i < numRequests; i++) {
                let request = await registry.getRequestByIndex.call(i);
                requests.push(request);
            }
            assert.equal(requests.length, 2, 'Expected two requests to be returned.');
            assert.equal(requests[0].length, 6, 'Expected the 5 properties of a request to be retured.');
        });
});

contract('ValentineRegistry', accounts => {
    const owner = accounts[0];

    it('should throw if caller tries to create an openValentineRequest with insufficient ether', async () => {
        const belowRequisiteValue = web3.toWei(0.05, 'ether');
        try {
            await registry.createOpenValentineRequest(requesterName, valentineName, customMessage, {
                from: owner,
                value: belowRequisiteValue,
            });
            assert(false, 'Expected createOpenValentineRequest to throw if insufficient ether paid.');
        } catch(err) {
            if (didContractThrow(err)) {
                // let test pass
            } else {
                assert(false, err + '');
            }
        }
    });
});

contract('ValentineRegistry', accounts => {
    const owner = accounts[0];
    const accountTwo = accounts[1];

    it('should prohibit request updates', async () => {
        const sufficientValue = web3.toWei(0.1, 'ether');
        await registry.createOpenValentineRequest(requesterName, valentineName, customMessage, {
            from: owner,
            value: sufficientValue,
        });
        try {
            await registry.createOpenValentineRequest(requesterName, valentineName, customMessage, {
                from: owner,
                value: sufficientValue,
            });
        } catch(err) {
            if (didContractThrow(err)) {
                // let test pass
            } else {
                assert(false, err + '');
            }
        }
    });

    it('should throw if acceptValentineRequest is called with requesterAddress not in requests', async () => {
        // accountTwo did not create a request.
        try {
            await registry.acceptValentineRequest(accountTwo);
        } catch(err) {
            if (didContractThrow(err)) {
                // let test pass
            } else {
                assert(false, err + '');
            }
        }
    });

    it('should mark the request as accepted if it exists', async () => {
        const sufficientValue = web3.toWei(0.1, 'ether');
        await registry.createOpenValentineRequest(requesterName, valentineName, customMessage, {
            from: accountTwo,
            value: sufficientValue,
        });

        const acceptResult = await registry.acceptValentineRequest(accountTwo);
        if (!_.includes(_.map(acceptResult.logs, log => log.event), 'LogRequestAccepted')) {
            assert(false, 'Expected event `LogRequestAccepted` was not fired.');
        }

        const request = await registry.getRequestByRequesterAddress.call(accountTwo);
        assert.equal(request[3], true, 'Expected wasAccepted to be true after call to acceptValentineRequest');
    });
});

contract('ValentineRegistry', accounts => {
    const owner = accounts[0];
    const nonOwner = accounts[1];
    const anotherNonOwner = accounts[2];
    const newOwner = accounts[3];

    it('should cash out entire contract balance when owner calls cashout', async () => {
        const sufficientValue = web3.toWei(0.1, 'ether');
        await registry.createOpenValentineRequest(requesterName, valentineName, customMessage, {
            from: nonOwner,
            value: sufficientValue,
        });
        const balanceBefore = web3.eth.getBalance(registry.address);
        const balanceBeforeInEther = web3.fromWei(balanceBefore, 'ether').toString();
        assert.equal(balanceBeforeInEther, 0.1);
        const result = await registry.cashout(owner, {
            from: owner,
        });
        const balanceAfter = web3.eth.getBalance(registry.address);
        const balanceAfterInEther = web3.fromWei(balanceAfter, 'ether').toString();
        assert.equal(balanceAfterInEther, 0);
    });

    it('should not cash out contract balance when non-owner calls cashout', async () => {
        const sufficientValue = web3.toWei(0.1, 'ether');
        await registry.createOpenValentineRequest(requesterName, valentineName, customMessage, {
            from: anotherNonOwner,
            value: sufficientValue,
        });
        const balanceBefore = web3.eth.getBalance(registry.address);
        const balanceBeforeInEther = web3.fromWei(balanceBefore, 'ether').toString();
        assert.equal(balanceBeforeInEther, 0.1);

        try {
            const result = await registry.cashout(nonOwner, {
                from: nonOwner,
            });
            assert(false, 'Expected cashout to throw called by non-owner.');
        } catch(err) {
            if (didContractThrow(err)) {
                // let test pass
            } else {
                assert(false, err + '');
            }
        }
        const balanceAfter = web3.eth.getBalance(registry.address);
        const balanceAfterInEther = web3.fromWei(balanceAfter, 'ether').toString();
        assert.equal(balanceAfterInEther, 0.1);
    });

    it('should let current owner change contract owner', async () => {
        const result = await registry.updateOwner(newOwner, {
            from: owner,
        });

        const currentOwner = await registry.owner.call({from: anotherNonOwner});
        assert.equal(currentOwner, newOwner, 'owner should be set to newOwner');
    });

    it('should not let non-owner change contract owner', async () => {
        try {
            const result = await registry.updateOwner(anotherNonOwner, {
                from: nonOwner,
            });
            assert(false, 'Expected cashout to throw called by non-owner.');
        } catch(err) {
            if (didContractThrow(err)) {
                // let test pass
            } else {
                assert(false, err + '');
            }
        }
    });
});

const didContractThrow = err => {
    const errStr = err + '';
    const didTestRPCContractThrow = errStr.indexOf('invalid JUMP') > -1 || errStr.indexOf('out of gas') > -1;
    const didGethContractThrow = errStr.indexOf('please check your gas amount') > -1;
    return didTestRPCContractThrow || didGethContractThrow;
}
