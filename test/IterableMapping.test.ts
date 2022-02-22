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

    before(async () => {
        IterableMapping = await deployContract(wallet, IterableMappingContract);
        TestIterableMapping = await deployContract(wallet, TestIterableMappingContract);
    });
    it("Iterable Mapping is deployed on signer address", async () => {
        expect(await TestIterableMapping.signer.getAddress()).to.equal(wallet.address);
    });
    it("test contract should emit testPassed event", async () => {
        expect(await TestIterableMapping.testIterableMap()).to.emit(TestIterableMapping, "testsPassed");
    });
});