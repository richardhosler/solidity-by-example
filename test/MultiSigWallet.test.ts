import { expect, use } from 'chai';
import { BigNumber, Contract, Signer } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import MultiSigContract from '../build/MultiSigWallet.json';
import { ECDH } from 'crypto';
import exp from 'constants';

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

    it("receive accepts eth, and emits Deposit event", async () => {
        await expect(await wallet1.sendTransaction({
            to: MultiSig.address,
            value: BigInt(2) * (BigInt(10) ** BigInt(18))
        })).to.emit(MultiSig, "Deposit").withArgs(
            wallet1.address,
            BigInt(2) * (BigInt(10) ** BigInt(18)),
            BigInt(2) * (BigInt(10) ** BigInt(18)));
        await expect(await wallet2.sendTransaction({
            to: MultiSig.address,
            value: BigInt(500)
        })).to.emit(MultiSig, "Deposit").withArgs(
            wallet2.address,
            BigInt(500),
            BigInt(2) * (BigInt(10) ** BigInt(18)) + BigInt(500));
    });

    describe("tests with preloaded transaction data", async () => {
        beforeEach("Adding Transactions", async () => {
            await MultiSig.submitTransaction(wallet1.address,
                BigInt(2) * (BigInt(10) ** BigInt(18)), "0x9999");
            await MultiSig.submitTransaction(wallet2.address, 500, "0x424242");
            await MultiSig.submitTransaction(wallet2.address, 500, "0x434242");
        });
        it("getTransactionCount returns correct count of transactions", async () => {
            expect(await MultiSig.getTransactionCount()).to.equal(3);
        });
        it("can return a requested transaction", async () => {
            expect(await MultiSig.getTransaction(1)).to.deep.equal(
                [
                    wallet2.address,
                    BigNumber.from(500),
                    '0x424242',
                    false,
                    BigNumber.from(0)
                ]
            );
        });
        it("reverts when transaction not found", async () => {
            await expect(MultiSig.getTransaction(4)).to.be.reverted;
        })
        it("can confirm a transaction", async () => {
            await expect(await MultiSig.confirmTransaction(1))
                .to.emit(MultiSig, "ConfirmTransaction");
            await expect(await MultiSig.connect(wallet2).confirmTransaction(1))
                .to.emit(MultiSig, "ConfirmTransaction");
            await expect(MultiSig.connect(wallet1).confirmTransaction(1))
                .to.be.reverted;
            expect(await MultiSig.getTransaction(1)).to.deep.equal(
                [
                    '0x63FC2aD3d021a4D7e64323529a55a9442C444dA0',
                    BigNumber.from(500),
                    '0x424242',
                    false,
                    BigNumber.from(2)
                ]
            );
        });
        it("can execute a transaction", async () => {
            await wallet1.sendTransaction({
                to: MultiSig.address,
                value: BigInt(2) * (BigInt(10) ** BigInt(18))
            });
            await MultiSig.confirmTransaction(1);
            await MultiSig.connect(wallet2).confirmTransaction(1);
            await expect(await MultiSig.executeTransaction(1))
                .to.emit(MultiSig, "ExecuteTransaction");
        });
        it("will not execute an unconfirmed transaction", async () => {
            await expect(MultiSig.executeTransaction(1)).to.be.reverted;
        })
        it("can revoke a confirmation", async () => {
            await MultiSig.confirmTransaction(1);
            await MultiSig.connect(wallet2).confirmTransaction(1);
            await expect(await MultiSig.revokeConfirmation(1)).to.emit(MultiSig, "RevokeConfirmation");
            await expect(MultiSig.executeTransaction(1)).to.be.reverted;
        });
    })
});