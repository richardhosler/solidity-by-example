import { expect, use } from 'chai';
import { Contract } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import ERC721Contract from '../build/ERC721.json';

use(solidity);

describe("ERC721", () => {
    const [owner, operator] = new MockProvider().getWallets();
    let ERC721: Contract;

    beforeEach(async () => {
        ERC721 = await deployContract(owner, ERC721Contract);
    });
    it("ERC721 is deployed on signer address", async () => {
        expect(await ERC721.signer.getAddress()).to.equal(owner.address);
    });
    it("supports ERC-165 interface", async () => {
        expect(await ERC721.supportsInterface(0x01ffc9a7)).to.equal(true);
    });
    it("can return balance of an address", async () => {
        expect(await ERC721.balanceOf(owner.address)).to.equal(0);
    });
    it("can check and set owner approval", async () => {
        expect(await ERC721.isApprovedForAll(owner.address, operator.address)).to.equal(false);
        expect(await ERC721.setApprovalForAll(operator.address, true)).to.emit(ERC721, "ApprovalForAll");
        expect(await ERC721.isApprovedForAll(owner.address, operator.address)).to.equal(true);
    });
    it("can mint a token", async () => {
        expect(await ERC721.mint(operator.address, 42)).to.emit(ERC721, "Transfer");
    });
    describe("token tests", async () => {
        beforeEach(async () => {
            await ERC721.mint(owner.address, 42n);
        })
        it("can return owner of a token", async () => {
            expect(await ERC721.ownerOf(42n)).to.equal(owner.address);
        });
        it("can set and get an approved address on a token", async () => {
            expect(await ERC721.approve(operator.address, 42n)).to.emit(ERC721, "Approval");
            expect(await ERC721.getApproved(42n)).to.equal(operator.address)
        });
        it("can transfer tokens", async () => {
            expect(await ERC721.transferFrom(owner.address, operator.address, 42)).to.emit(ERC721, "Transfer");
            expect(await ERC721.ownerOf(42)).to.equal(operator.address);
        });
        it("can 'safe' transfer tokens", async () => {
            expect(await ERC721['safeTransferFrom(address,address,uint256)'](owner.address, operator.address, 42n)).to.emit(ERC721, "Transfer");
        });
        it("can burn tokens", async () => {
            expect(await ERC721.burn(42n)).to.emit(ERC721, "Transfer");
            expect(ERC721.ownerOf(42n)).to.be.reverted;
        })
    })

});