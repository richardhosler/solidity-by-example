import { expect, use } from 'chai';
import { Contract } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import EnglishAuctionContract from '../build/EnglishAuction.json';
import ERC721Contract from '../build/ERC721.json';


use(solidity);

describe("English Auction", () => {
    const [owner, buyerOne, buyerTwo] = new MockProvider().getWallets();
    let EnglishAuction: Contract;
    let ERC721: Contract;

    before(async () => {
        ERC721 = await deployContract(owner, ERC721Contract);
        await ERC721.connect(owner).mint(owner.address, 42);
        EnglishAuction = await deployContract
            (owner, EnglishAuctionContract, [ERC721.address, 42n, 500n]);
        await ERC721.setApprovalForAll(EnglishAuction.address, true);
    });

    it("English Auction is deployed on signer address", async () => {
        expect(await EnglishAuction.signer.getAddress()).to.equal(owner.address);
    });
    it("has token to sell", async () => {
        expect(await ERC721.ownerOf(42n)).to.equal(owner.address);
    })
    it("can start auction", async () => {
        expect(await EnglishAuction.connect(owner).start())
            .to.emit(EnglishAuction, "Start");
    });
    it("can bid on auction", async () => {
        expect(await EnglishAuction.connect(buyerOne).bid(
            { from: buyerOne.address, value: 600 })).to.emit(EnglishAuction, "Bid");
        expect(await EnglishAuction.connect(buyerTwo).bid(
            { from: buyerTwo.address, value: 650 })).to.emit(EnglishAuction, "Bid");
        expect(await EnglishAuction.connect(buyerOne).bid(
            { from: buyerOne.address, value: 700 })).to.emit(EnglishAuction, "Bid");
    });
    it("can withdraw a bid", async () => {
        expect(await EnglishAuction.connect(buyerTwo).withdraw()).to.emit(EnglishAuction, "Withdraw");
    });
    it("can end an auction", async () => {
        expect(await EnglishAuction.connect(buyerOne).end()).to.emit(EnglishAuction, "End");
    })
});