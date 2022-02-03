import { expect, use } from 'chai';
import { Contract } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import ErrorContract from '../build/Error.json';

use(solidity);

describe("Error", () => {
    const [wallet] = new MockProvider().getWallets();
    let Error: Contract;

    beforeEach(async () => {
        Error = await deployContract(wallet, ErrorContract);
    });
    it("Error is deployed on signer address", async () => {
        expect(await Error.signer.getAddress()).to.equal(wallet.address);
    });
    it("require reverts correctly", async () => {
        await Error.testRequire(11);
        expect("testRequire").to.be.calledOnContract(Error);
        await expect(Error.testRequire(5)).to.be.reverted;
    });
    it("revert reverts correctly", async () => {
        await Error.testRequire(11);
        expect("testRequire").to.be.calledOnContract(Error);
        await expect(Error.testRequire(5)).to.be.reverted;
    });
    it("assert reverts correctly", async () => {
        await expect(Error.testAssert()).to.not.be.reverted;
    });
    it("custom error is thrown", async () => {
        await expect(Error.testCustomError(0)).to.not.be.reverted;
        await expect(Error.testCustomError(42)).to.be.reverted;

    });
});