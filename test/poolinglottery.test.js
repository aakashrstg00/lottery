const {
    network,
    ethers
} = require("hardhat");
const {
    expect
} = require("chai");
const BigNumber = require('bignumber.js');


describe("PoolingLottery", function () {

    let lottery;
    let owner;
    let u1;
    let u2;
    let others;

    before("Should create impersonate accounts", async function () {
        [owner, u1, u2, ...others] = await ethers.getSigners();
    });

    it("Should be able to create pools", async function () {
        let PoolingLottery = await ethers.getContractFactory("PoolingLottery");
        lottery = await PoolingLottery.deploy();

        await lottery.deployed();

        let l = new BigNumber((await lottery.viewPoolsLength())._hex);

        let tokenAddress = "0xf79F3Be48127A36e831e0A47090a1765B75BEfc8";

        await lottery.createPool(tokenAddress, 1620245778);

        // console.log(await lottery.pools(0));
        // console.log(l)

        expect((new BigNumber((await lottery.viewPoolsLength())._hex)).toNumber()).to.equals(l.plus(1).toNumber());

        // expect((await lottery.pools(0)).coin).to.equals('COIN');
    });

    it("Should be able to pool tokens",async function() {
        await lottery.deployed();
        // console.log(lottery.address)
        await lottery.poolTokens(0,0);
    });

    it("Should be able to claim rewards",async function() {
        await lottery.deployed();
        // console.log(lottery.address)
        await lottery.poolTokens(0,0);
    });

});