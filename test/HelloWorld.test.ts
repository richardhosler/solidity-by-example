import { expect, use } from 'chai';
import { Contract } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import greet from '../build/HelloWorld.json';

use(solidity);

describe("Hello World", () => {
    const [wallet] = new MockProvider().getWallets();
    let HelloWorld: Contract;

    beforeEach(async () => {
        HelloWorld = await deployContract(wallet, greet);
    });

    it("HelloWorld is deployed on signer address", async () => {
        expect(await HelloWorld.signer.getAddress()).to.equal(wallet.address);
    });
    it("greet is 'Hello World!'", async () => {
        expect(await HelloWorld.greet()).to.equal("Hello World!");
    });
});