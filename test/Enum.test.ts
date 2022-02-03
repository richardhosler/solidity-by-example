import { expect, use } from 'chai';
import { Contract } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import enumContract from '../build/Enum.json';

use(solidity);

describe("Enum", () => {
    const [wallet] = new MockProvider().getWallets();
    let Enum: Contract;

    beforeEach(async () => {
        Enum = await deployContract(wallet, enumContract);
    });

    it("Enum is deployed on signer address", async () => {
        expect(await Enum.signer.getAddress()).to.equal(wallet.address);
    });
    it("can get current value of enum", async () => {
        expect(await Enum.get()).to.equal(0);
    });
    it("can set new value of enum", async () => {
        await Enum.set(2);
        expect(await Enum.get()).to.equal(2);
    });
    it("can change enum value in called function", async () => {
        await Enum.cancel();
        expect(await Enum.get()).equal(4);
    });
    it("delete returns enum to default value", async () => {
        await Enum.set(2);
        expect(await Enum.get()).to.equal(2);
        await Enum.reset();
        expect(await Enum.get()).to.equal(0);
    });
});