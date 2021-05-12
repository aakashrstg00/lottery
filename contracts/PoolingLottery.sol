//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PoolingLottery is Ownable {
    struct Pool {
        address winner;
        uint256 pooledAmount;
        uint256 deadline;
        address token;
        string coin;
        mapping(address => uint256) distribution;
    }

    // address token = 0xf79F3Be48127A36e831e0A47090a1765B75BEfc8;
    Pool[] public pools;

    function createPool(address _token, uint256 _deadline) external onlyOwner {
        // Pool storage newpool;

        // pools.push(newpool);

        Pool storage newpool = pools.push();
        newpool.winner = address(0);
        newpool.pooledAmount = 0;
        newpool.deadline = _deadline;
        newpool.token = _token;
        newpool.coin = "COIN";

        // pools.push(newpool);
    }

    function viewPoolsLength() public view returns (uint256) {
        return pools.length;
    }

    function poolTokens(uint256 _amount, uint256 poolIndex) public {
        require(
            IERC20(pools[poolIndex].token).balanceOf(address(msg.sender)) > 0,
            "Insufficient funds!"
        );
        require(
            poolIndex > 0 && poolIndex < pools.length,
            "Invalid pool index"
        );
        require(_amount > 0, "Invalid amount!");
        require(
            pools[poolIndex].distribution[msg.sender] == 0,
            "Already deposited!"
        );

        IERC20(pools[poolIndex].token).transferFrom(
            msg.sender,
            address(this),
            _amount
        );

        pools[poolIndex].distribution[msg.sender] = _amount;
        pools[poolIndex].pooledAmount += _amount;
    }

    function claimRewards(uint256 poolIndex) public {
        require(
            block.timestamp > pools[poolIndex].deadline,
            "The pooling time is not over yet. Please try after deadline"
        );

        require(
            pools[poolIndex].distribution[msg.sender] != 0,
            "Not part of that pool"
        );

        require(
            pools[poolIndex].winner == address(0),
            "Pool has already been claimed by someone!"
        );

        IERC20(pools[poolIndex].token).transfer(
            msg.sender,
            pools[poolIndex].pooledAmount
        );
        pools[poolIndex].winner = msg.sender;
    }
}

// > all users transfer xyz tokens to PL contract (use transferFrom)
// > store the amount transferred by each user's address in a mapping (address => uint256)
// > public claim function - timed - after timeout once claimed, transfer all pool money into that user's address.
