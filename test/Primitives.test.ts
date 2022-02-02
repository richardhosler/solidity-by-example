import { expect, use } from 'chai';
import { BigNumber, Contract } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import primitivesContract from '../build/Primitives.json';

use(solidity);

describe("Primitive Types", () => {
    const [wallet] = new MockProvider().getWallets();
    let Primitives: Contract;

    beforeEach(async () => {
        Primitives = await deployContract(wallet, primitivesContract);
    });
    it("Primitives is deployed on signer address", async () => {
        expect(await Primitives.signer.getAddress()).to.equal(wallet.address);
    });
    describe("Calling auto-generated getters", async () => {
        it("is boo true", async () => {
            expect(await Primitives.boo()).to.equal(true);
        });
        it("is uint8 u8 == 1", async () => {
            expect(await Primitives.u8()).to.equal(1);
        });
        it("is uint u256 == 456", async () => {
            expect(await Primitives.u256()).to.equal(456);
        });
        it("is int i8 == -1", async () => {
            expect(await Primitives.i8()).to.equal(-1);
        });
        it("is int i256 == 456", async () => {
            expect(await Primitives.i256()).equal(456);
        });
        it("int's minimum value", async () => {
            expect(await Primitives.minInt()).to.equal(BigInt(-2) ** BigInt(255));
        });
        it("int's maximum value", async () => {
            expect(await Primitives.maxInt()).to.equal(BigInt(2) ** BigInt(255) - BigInt(1));
        })
        it("is addr a valid address", async () => {
            expect(await Primitives.addr()).to.be.properAddress;
        });
        it("is byte a == 10110101", async () => {
            expect(Number(await Primitives.a())).to.equal(0xb5);
        });
        it("is byte b == 01010110", async () => {
            expect(Number(await Primitives.b())).to.equal(0x56);
        });
    });
    describe("Uninitialised values", async () => {
        it("uninitialised values are as expected", async () => {
            expect(await Primitives.defaultBoo()).to.equal(false);
            expect(await Primitives.defaultUint()).to.equal(0);
            expect(await Primitives.defaultInt()).to.equal(0);
            expect(await Primitives.defaultAddr()).to.equal("0x0000000000000000000000000000000000000000");
        });
    });

});