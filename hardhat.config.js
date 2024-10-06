require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.18",
  // networks: {
  //   sepolia: {
  //     url: `https://sepolia.infura.io/v3/${process.env.PROJECT_ID}`,
  //     accounts: [process.env.MNEMONIC],
  //     chainId: 11155111,
  //     confirmations: 2,
  //     timeoutBlocks: 200,
  //     skipDryRun: true
  //   }
  // }
  
};