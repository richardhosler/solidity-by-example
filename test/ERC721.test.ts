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
    })
    it("can return owner of a token", async () => {
        await ERC721.mint(owner.address, 42);
        expect(await ERC721.ownerOf(42)).equal(owner.address);

    });
});