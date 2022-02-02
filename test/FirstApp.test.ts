import { expect, use } from 'chai';
import { Contract } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import contract from '../build/FirstApp.json';

use(solidity);

describe("First App", () => {
    const [wallet] = new MockProvider().getWallets();
    let FirstApp: Contract;

    beforeEach(async () => {
        FirstApp = await deployContract(wallet, contract);
    });

    it("FirstApp is deployed on signer address", async () => {
        expect(await FirstApp.signer.getAddress()).to.equal(wallet.address);
    });
    it("Count starts at zero'", async () => {
        expect(await FirstApp.get()).to.equal(0);
    });
    describe("inc", async () => {
        it("Increases count by one.", async () => {
            await FirstApp.inc();
            expect(await FirstApp.get()).to.equal(1);
        })
    });
    describe("dec", async () => {
        it("Decreases count by one", async () => {
            for (let i = 0; i < 5; i++) {
                await FirstApp.inc();
            }
            await FirstApp.dec();
            expect(await FirstApp.get()).to.equal(4);
        })
    })
});