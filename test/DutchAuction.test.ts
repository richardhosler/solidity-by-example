import { expect, use } from 'chai';
import { Contract } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import DutchAuctionContract from '../build/DutchAuction.json';
import ERC721Contract from '../build/ERC721.json';


use(solidity);

describe("Dutch Auction", () => {
    const [owner, buyerOne, buyerTwo] = new MockProvider().getWallets();
    let DutchAuction: Contract;
    let ERC721: Contract;

    before(async () => {
        ERC721 = await deployContract(owner, ERC721Contract);
        await ERC721.connect(owner).mint(owner.address, 42n);
        DutchAuction = await deployContract
            (owner, DutchAuctionContract, [1500n, 50n, ERC721.address, 42n]);
        await ERC721.setApprovalForAll(DutchAuction.address, true);
    });

    it("Dutch Auction is deployed on signer address", async () => {
        expect(await DutchAuction.signer.getAddress()).to.equal(owner.address);
    });
    it("has token to sell", async () => {
        expect(await ERC721.ownerOf(42n)).to.equal(owner.address);
    })
    it("can get current price", async () => {
        expect(await DutchAuction.getPrice()).to.be.lessThan(1500n);
    })
});