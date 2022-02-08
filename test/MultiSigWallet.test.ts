import { expect, use } from 'chai';
import { Contract } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import MultiSigContract from '../build/MultiSigWallet.json';

use(solidity);

describe("MultiSig Wallet", () => {
    const [wallet1, wallet2] = new MockProvider().getWallets();
    let MultiSig: Contract;

    beforeEach(async () => {
        MultiSig = await deployContract(wallet1, MultiSigContract,
            [[wallet1.address, wallet2.address], BigInt(2)]);
    });

    it("MultiSig Wallet is deployed on signer address", async () => {
        expect(await MultiSig.signer.getAddress()).to.equal(wallet1.address);
    });
    it("getOwners returns owners", async () => {
        expect(await MultiSig.getOwners()).to.deep.equal([wallet1.address, wallet2.address]);
    });
    it("can submit a new transaction", async () => {
        await expect(await MultiSig.submitTransaction(wallet2.address, BigInt(500), "0x424242"))
            .to.emit(MultiSig, "SubmitTransaction")
            .withArgs(wallet1.address, BigInt(0), wallet2.address, BigInt(500), "0x424242");
    });
    it("getTransactionCount returns correct count of transactions", async () => {
        await expect(await MultiSig.submitTransaction(wallet2.address, BigInt(500), "0x424242"))
            .to.emit(MultiSig, "SubmitTransaction")
            .withArgs(wallet1.address, BigInt(0), wallet2.address, BigInt(500), "0x424242");
        expect(await MultiSig.getTransactionCount()).to.equal(1);
    });
    it("receive accepts eth, and emits Deposit event", async () => {
        await expect(await MultiSig.receive({
            from: wallet1.address,
            value: BigInt(2) * (BigInt(10) ** BigInt(18))
        })).to.emit(MultiSig, "Deposit");
    });
    it("can confirm a transaction", async () => {

    });
    it("can revoke a confirmation");
    it("can return a requested transaction");
});