import { expect, use } from 'chai';
import { Contract } from 'ethers';
import { deployContract, MockContract, MockProvider, solidity } from 'ethereum-waffle';
import IterableMappingContract from '../build/IterableMapping.json';
import TestIterableMappingContract from '../build/TestIterableMap.json';

use(solidity);

describe("Iterable Mapping", () => {
    const [wallet] = new MockProvider().getWallets();
    let IterableMapping: Contract;
    let TestIterableMapping: Contract;

    beforeEach(async () => {
        IterableMapping = await deployContract(wallet, IterableMappingContract);
        TestIterableMapping = await deployContract(wallet, TestIterableMappingContract, [IterableMapping.address]);
    });
    it("Iterable Mapping is deployed on signer address", async () => {
        expect(await TestIterableMapping.signer.getAddress()).to.equal(wallet.address);
    });
    it.skip("run test", async () => {
        expect(await TestIterableMapping.testIterableMap()).to.emit(TestIterableMapping, "testsPassed");
    });
});