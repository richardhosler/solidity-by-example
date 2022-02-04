import { expect, use } from 'chai';
import { Contract } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import PayableContract from '../build/Payable.json';

use(solidity);

describe("Payable", () => {
    const [wallet, otherWallet] = new MockProvider().getWallets();
    let Payable: Contract;

    beforeEach(async () => {
        Payable = await deployContract(wallet, PayableContract);
    });

    it("HelloWorld is deployed on signer address", async () => {
        expect(await Payable.signer.getAddress()).to.equal(wallet.address);
    });
    it("allows sending Ether to payable function", async () => {
        await Payable.deposit({
            from: wallet.address, value: BigInt(1) * (BigInt(10) ** BigInt(18))
        });
        expect("deposit").to.be.calledOnContract(Payable);
    });
    it("throws error if sending Ether to non payable function", async () => {
        await expect(Payable.notPayable({
            from: wallet.address, value: BigInt(1) * (BigInt(10) ** BigInt(18))
        })).to.be.reverted;
    });
    it("allows withdrawing all ether from contract", async () => {
        await Payable.deposit({
            from: wallet.address, value: BigInt(1) * (BigInt(10) ** BigInt(18))
        });
        expect(await Payable.withdraw()).to.changeEtherBalance(wallet, BigInt(1) * (BigInt(10) ** BigInt(18)));
    });
    it("allows transfer of Ether to an address", async () => {
        await Payable.deposit({
            from: wallet.address, value: BigInt(1) * (BigInt(10) ** BigInt(18))
        });
        expect(await Payable.transfer(otherWallet.address, BigInt(500))).to.changeEtherBalance(otherWallet, 500);

    });
});