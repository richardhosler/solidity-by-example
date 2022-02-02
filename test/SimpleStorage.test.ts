import { expect, use } from 'chai';
import { Contract } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import contract from '../build/SimpleStorage.json';

use(solidity);

describe("Simple Storage", () => {
    const [wallet] = new MockProvider().getWallets();
    let SimpleStorage: Contract;

    beforeEach(async () => {
        SimpleStorage = await deployContract(wallet, contract);
    });
    it("SimpleStorage is deployed on signer address", async () => {
        expect(await SimpleStorage.signer.getAddress()).to.equal(wallet.address);
    });
    it("default value is 0", async () => {
        expect(await SimpleStorage.get()).to.equal(0);
    })
    it("can set number to 42", async () => {
        await SimpleStorage.set(42);
        expect(await SimpleStorage.get()).to.equal(42);
    })
});