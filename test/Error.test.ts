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
        expect(await Error.testRequire(5)).to.be.called;
        await expect(Error.testRequire(11)).to.be.reverted;
    });
    it("revert reverts correctlt");
    it("assert reverts correctly");
    it("custiom error is thrown");
});