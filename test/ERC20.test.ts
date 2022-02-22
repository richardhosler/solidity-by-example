import { expect, use } from 'chai';
import { Contract } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import ERC20Contract from '../build/ERC20.json';
import exp from 'constants';

use(solidity);

describe("ERC20", () => {
    const [walletOne, walletTwo] = new MockProvider().getWallets();
    let ERC20: Contract;

    beforeEach(async () => {
        ERC20 = await deployContract(walletOne, ERC20Contract);
    });

    it("ERC20 is deployed on signer address", async () => {
        expect(await ERC20.signer.getAddress()).to.equal(walletOne.address);
    });
    it("can mint tokens", async () => {
        expect(await ERC20.mint(200n * (10n ** 18n))).to.emit(ERC20, "Transfer");
        expect(await ERC20.totalSupply()).to.equal(200n * (10n ** 18n));
    });
    it("can set an allowance", async () => {
        expect(await ERC20.connect(walletOne).approve(walletTwo.address, 5000))
            .to.emit(ERC20, "Approval")
            .withArgs(walletOne.address, walletTwo.address, 5000);
    });
    it("can transfer tokens as holder", async () => {
        await ERC20.connect(walletOne).mint(200n * (10n ** 18n));
        expect(await ERC20.connect(walletOne).transfer(walletTwo.address, 5000))
            .to.emit(ERC20, "Transfer").withArgs(walletOne.address, walletTwo.address, 5000);
    });
    it("can transfer tokens from an allowance", async () => {
        await ERC20.connect(walletOne).mint(200n * (10n ** 18n));
        await ERC20.connect(walletOne).approve(walletTwo.address, 5000);
        expect(await ERC20.connect(walletTwo).transferFrom(walletOne.address, walletTwo.address, 500))
            .to.emit(ERC20, "Transfer").withArgs(walletOne.address, walletTwo.address, 500);
        expect(await ERC20.balanceOf(walletTwo.address)).to.equal(500);
    });
    it("can burn tokens", async () => {
        await ERC20.connect(walletOne).mint(200n * (10n ** 18n));
        expect(await ERC20.connect(walletOne).burn(2000)).to.emit(ERC20, "Transfer");
    })
});