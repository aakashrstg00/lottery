//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ProstogiTheCoin is ERC20 {
    constructor() ERC20("ProstogiTheCoin", "PRO") {
        _mint(msg.sender, 1000000 ether);
    }
}
