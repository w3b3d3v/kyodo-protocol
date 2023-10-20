// const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("VariableStorage", function () {
  let variableStorage;

  beforeEach(async () => {
    const VariableStorageContract = await ethers.getContractFactory(
      "VariableStorage"
    );
    [admin, newAdmin, notAdmin, kyodoTreasureContract, communityTreasureContract] = await ethers.getSigners();
    variableStorage = await VariableStorageContract.deploy(admin.address);
    await variableStorage.deployed();
  });

  it("Should add an admin", async function () {
    await expect(variableStorage.connect(admin).addAdmin(newAdmin.address)).not.to.be.reverted
  });

  it("Should revert if not admin try do add an admin", async function () {
    await expect(
      variableStorage.connect(notAdmin).addAdmin(notAdmin.address)
    ).to.be.revertedWith("Caller is not an Admin");
  });

  it("Should save a new variable", async function () {
    await variableStorage.connect(admin).setVariable('KYODO_TREASURY_CONTRACT_ADDRESS', kyodoTreasureContract.address)
    await variableStorage.connect(admin).setVariable('COMMUNITY_TREASURY_CONTRACT_ADDRESS', communityTreasureContract.address)
    const kyodoStoredAddr = await variableStorage.getVariable('KYODO_TREASURY_CONTRACT_ADDRESS')
    const communityStoredAddr = await variableStorage.getVariable('COMMUNITY_TREASURY_CONTRACT_ADDRESS')
    expect(kyodoStoredAddr).to.be.equal(kyodoTreasureContract.address)
    expect(communityStoredAddr).to.be.equal(communityTreasureContract.address)
  });
  
  it("Should revert if not admin try do add or modify an variable", async function () {
    await expect(
      variableStorage.connect(notAdmin).setVariable('KYODO_TREASURY_CONTRACT_ADDRESS', kyodoTreasureContract.address)
        ).to.be.revertedWith("Caller is not an Admin");
  });
});
