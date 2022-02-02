import { expect, use } from 'chai';
import { Contract } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import mappingContract from '../build/Mapping.json';
import nestedMappingContract from '../build/NestedMapping.json'
use(solidity);

describe("Mapping", () => {
    const [wallet] = new MockProvider().getWallets();
    let Mapping: Contract;

    beforeEach(async () => {
        Mapping = await deployContract(wallet, mappingContract);
    });

    it("Mapping is deployed on signer address", async () => {
        expect(await Mapping.signer.getAddress()).to.equal(wallet.address);
    });
    it("returns default value if none assigned", async () => {
        expect(await Mapping.get(wallet.address)).to.equal(0);
    });
    it("can set a value at mapped addreses", async () => {
        await Mapping.set(wallet.address, 42);
        expect(await Mapping.get(wallet.address)).to.equal(42);
    });
    it("can remove a mapping", async () => {
        await Mapping.remove(wallet.address);
        expect(await Mapping.get(wallet.address)).to.equal(0);
    })
    describe("Nested Mapping", async () => {
        let NestedMapping: Contract;
        beforeEach(async () => {
            NestedMapping = await deployContract(wallet, nestedMappingContract);
        });
        it("also returns default value if not assigned", async () => {
            expect(await NestedMapping.get(wallet.address, 1)).to.equal(false);
        });
        it("can set a value at mapped addreses", async () => {
            await NestedMapping.set(wallet.address, 42, true);
            expect(await NestedMapping.get(wallet.address, 42)).to.equal(true);
        });
        it("can remove a mapping", async () => {
            await NestedMapping.remove(wallet.address, 42);
            expect(await NestedMapping.get(wallet.address, 42)).to.equal(false);
        })
    })
});