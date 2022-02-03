import { expect, use } from 'chai';
import { Contract } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import arrayContract from '../build/Array.json';

use(solidity);

describe("Array", () => {
    const [wallet] = new MockProvider().getWallets();
    let Array: Contract;

    beforeEach(async () => {
        Array = await deployContract(wallet, arrayContract);
    });

    it("Array is deployed on signer address", async () => {
        expect(await Array.signer.getAddress()).to.equal(wallet.address);
    });
    it("fixed arrays initialise to default values", async () => {
        expect(await Array.myFixedSizeArr(3)).to.equal(0);
    });
    it("reverts if you try to access an empty array", async () => {
        await expect(Array.arr(0)).to.be.reverted;
        await expect(Array.get(0)).to.be.reverted;
    });
    it("adds an element to the array with push", async () => {
        await Array.push(42);
        expect(await Array.get(0)).to.equal(42);
    });
    describe("testing multiple values", async () => {
        beforeEach(async () => {
            await Array.push(4);
            await Array.push(2);
            await Array.push(42);
        });
        it("can return the full array", async () => {
            const arr = await Array.getArr();
            expect(arr[0]).to.equal(4);
            expect(arr[1]).to.equal(2);
            expect(arr[2]).to.equal(42);
        });
        it("pop removes the last element", async () => {
            await Array.pop();
            expect(await Array.getLength()).to.equal(2);
            const arr = await Array.getArr();
            expect(arr[0]).to.equal(4);
            expect(arr[1]).to.equal(2);
        });
        it("length is returned correctly", async () => {
            expect(await Array.getLength()).to.equal(3);
        });
        it("can remove an element leaving default value", async () => {
            await Array.remove(1);
            const arr = await Array.getArr();
            expect(arr[0]).to.equal(4);
            expect(arr[1]).to.equal(0);
            expect(arr[2]).to.equal(42);
        });
    });

});