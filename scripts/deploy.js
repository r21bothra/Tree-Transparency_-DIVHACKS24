// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function deployLock() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = hre.ethers.utils.parseEther("0.001");
  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });
  await lock.deployed();
  console.log(
    `Lock with ${ethers.utils.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  );
}

async function deployTreeToken() {
  const TreeToken = await hre.ethers.getContractFactory("TreeToken");
  const treeToken = await TreeToken.deploy();

  await treeToken.deployed();

  console.log("Tree Token deployed to: ", treeToken.address);
}

async function deployTransact() {
  const TransactionData = await hre.ethers.getContractFactory(
    "TransactionData"
  );
  const transactionData = await TransactionData.deploy();

  await transactionData.deployed();

  console.log("Transaction Data deployed to: ", transactionData.address);
}

async function main() {
  // await deployLock();
  await deployTreeToken();
  await deployTransact();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
