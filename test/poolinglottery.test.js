const {
    ethers
} = require("hardhat");
const {
    expect
} = require("chai");
const BigNumber = require('bignumber.js');
const {
    poll
} = require("@ethersproject/web");


describe("PoolingLottery", function () {

    let lottery, PRO;
    let tokenAddress;
    let owner, u1, u2, others;

    before("Should create impersonate accounts and deploy contracts", async function () {
        [owner, u1, u2, u3, u4, ...others] = await ethers.getSigners();

        let PoolingLottery = await ethers.getContractFactory("PoolingLottery");
        lottery = await PoolingLottery.deploy();

        await lottery.deployed();

        const Token = await ethers.getContractFactory("ProstogiTheCoin");
        PRO = await Token.deploy();

        await PRO.deployed();

        tokenAddress = PRO.address;

        PRO.transfer(await u1.address, ethers.utils.parseEther("3000"));
        PRO.transfer(await u2.address, ethers.utils.parseEther("3000"));
        PRO.transfer(await u3.address, ethers.utils.parseEther("3000"));
        PRO.transfer(await u4.address, ethers.utils.parseEther("3000"));
        // console.log("owner ",await PRO.balanceOf(owner.address));
        // console.log("u1 ",await PRO.balanceOf(u1.address));
        // console.log("u2 ",await PRO.balanceOf(u2.address));
    });

    it("Should be able to create pools", async function () {

        let l = new BigNumber((await lottery.viewPoolsLength())._hex);

        await lottery.createPool(tokenAddress, +new Date() + 1000, await PRO.symbol());

        expect((new BigNumber((await lottery.viewPoolsLength())._hex)).toNumber()).to.equals(l.plus(1).toNumber());
        expect((await lottery.pools(0)).symbol).to.equals(await PRO.symbol());
    });

    it("Should be able to pool tokens", async function () {
        await lottery.deployed();

        let poolIndex = 0;

        // console.log(lottery.address)
        await PRO.connect(u1).approve(lottery.address, ethers.utils.parseEther("100"));
        await PRO.connect(u2).approve(lottery.address, ethers.utils.parseEther("130"));
        await PRO.connect(u3).approve(lottery.address, ethers.utils.parseEther("180"));
        await PRO.connect(u4).approve(lottery.address, ethers.utils.parseEther("250"));
        
        await lottery.connect(u1).poolTokens(ethers.utils.parseEther("100"), poolIndex);
        await lottery.connect(u2).poolTokens(ethers.utils.parseEther("130"), poolIndex);
        await lottery.connect(u3).poolTokens(ethers.utils.parseEther("180"), poolIndex);
        await lottery.connect(u4).poolTokens(ethers.utils.parseEther("250"), poolIndex);

        // console.log(await lottery.viewDistributionMappingValue(poolIndex,u1.address));
        // console.log((new BigNumber((await lottery.viewDistributionMappingValue(poolIndex,u2.address))._hex)).toNumber());


        // expect((await lottery.pools(poolIndex)).pooledAmount).to.equals(ethers.utils.parseEther("250"));

        expect((new BigNumber((await lottery.pools(poolIndex)).pooledAmount._hex)).toNumber()).to.equals((new BigNumber(ethers.utils.parseEther("660")._hex)).toNumber());
    });

    it("Should mine next block", async function() {
        await ethers.provider.send('evm_increaseTime', [+new Date() + 1]); 
        await ethers.provider.send('evm_mine');
    })

    it("Should be able to claim rewards", async function () {
        await lottery.deployed();

        let poolIndex = 0;

        // deadline datetime
        // console.log(new Date((new BigNumber(((await lottery.pools(poolIndex)).deadline)._hex)).toNumber()))

        await lottery.connect(u2).claimRewards(poolIndex);
        expect((await lottery.pools(poolIndex)).winner).to.equals(u2.address);
        // console.log((await lottery.pools(poolIndex)).winner);
        // console.log(u2.address);
    });

});

// x
// (new BigNumber((await x)._hex)).toNumber()