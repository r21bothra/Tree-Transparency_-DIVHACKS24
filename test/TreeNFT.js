const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Tree NFT", function () {
  it("Should mint and transfer a Tree to someone", async function () {
    const TreeToken = await ethers.getContractFactory("TreeToken");
    const treeToken = await TreeToken.deploy();

    await treeToken.deployed();

    const recipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    const metadataURI = "cide/test.png";

    let balance = await treeToken.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await treeToken.mint(recipient, metadataURI);

    await newlyMintedToken.wait();

    balance = await treeToken.balanceOf(recipient);

    expect(await treeToken.isContentOwned(metadataURI)).to.equal(true);
  });
});
