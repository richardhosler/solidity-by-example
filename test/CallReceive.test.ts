import { expect, use } from 'chai';
import { Contract, Wallet } from 'ethers';
import { deployContract, deployMockContract, MockProvider, solidity } from 'ethereum-waffle';
import CallerContract from '../build/Caller.json';
import ReceiverContract from '../build/Receiver.json'

use(solidity);

describe("Hello World", () => {
    let wallet: Wallet;
    let walletB: Wallet;
    let caller: Contract;
    let receiver: Contract;

    beforeEach(async () => {
        [wallet, walletB] = new MockProvider().getWallets();
        caller = await deployContract(wallet, CallerContract);
        receiver = await deployMockContract(wallet, ReceiverContract.abi);
    });
    it("Contracts are deployed on signer address", async () => {
        expect(await caller.signer.getAddress()).to.equal(wallet.address);
        expect(await receiver.signer.getAddress()).to.equal(wallet.address);
    });
    it("call to foo succeeds", async () => {
        await expect(await caller.testCallFoo(wallet.address, { value: BigInt(500) }))
            .to.emit(caller, "Response").withArgs(true, "0x")
        // .and.to.emit(receiver, "Received");
    });
    it("call to doesNotExist calls fallback", async () => {
        await expect(await caller.testCallDoesNotExist(wallet.address)).to.emit(caller, "Response");
    })
});