// const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("KyodoRegistry", function () {
  let kyodoRegistry;

  beforeEach(async () => {
    const KyodoRegistryContract = await ethers.getContractFactory(
      "KyodoRegistry"
    );
    [admin, newAdmin, notAdmin, kyodoTreasureContract, communityTreasureContract] = await ethers.getSigners();
    kyodoRegistry = await KyodoRegistryContract.deploy(admin.address);
    await kyodoRegistry.deployed();
  });

  it("Should add an admin", async function () {
    await expect(kyodoRegistry.connect(admin).addAdmin(newAdmin.address)).not.to.be.reverted
  });

  it("Should revert if not admin try do add an admin", async function () {
    await expect(
      kyodoRegistry.connect(notAdmin).addAdmin(notAdmin.address)
    ).to.be.revertedWith("Caller is not an Admin");
  });

  it("Should save a new registry", async function () {
    await kyodoRegistry.connect(admin).setRegistry('KYODO_TREASURY_CONTRACT_ADDRESS', kyodoTreasureContract.address)
    await kyodoRegistry.connect(admin).setRegistry('COMMUNITY_TREASURY_CONTRACT_ADDRESS', communityTreasureContract.address)
    const kyodoStoredAddr = await kyodoRegistry.getRegistry('KYODO_TREASURY_CONTRACT_ADDRESS')
    const communityStoredAddr = await kyodoRegistry.getRegistry('COMMUNITY_TREASURY_CONTRACT_ADDRESS')
    expect(kyodoStoredAddr).to.be.equal(kyodoTreasureContract.address)
    expect(communityStoredAddr).to.be.equal(communityTreasureContract.address)
  });

  it("Should update a registry", async function () {
    await kyodoRegistry.connect(admin).setRegistry('KYODO_TREASURY_CONTRACT_ADDRESS', kyodoTreasureContract.address)
    await kyodoRegistry.connect(admin).updateRegistry('KYODO_TREASURY_CONTRACT_ADDRESS', communityTreasureContract.address)
    const newAddr = await kyodoRegistry.getRegistry('KYODO_TREASURY_CONTRACT_ADDRESS')
    expect(newAddr).to.be.equal(communityTreasureContract.address)
  });

  it("Should not throw error if registry exists", async function () {
    await kyodoRegistry.connect(admin).setRegistry('KYODO_TREASURY_CONTRACT_ADDRESS', kyodoTreasureContract.address)
    expect(await kyodoRegistry.getRegistry('KYODO_TREASURY_CONTRACT_ADDRESS')).to.be.equal(kyodoTreasureContract.address);
  });

  it("Should throw error if registry does not exists", async function () {
    await expect(kyodoRegistry.getRegistry('REGISTRY_NOT_EXISTS')).to.be.revertedWith("Registry does not exists");
  });
  
  it("Should revert if not admin try do add or modify an variable", async function () {
    await expect(
      kyodoRegistry.connect(notAdmin).setRegistry('KYODO_TREASURY_CONTRACT_ADDRESS', kyodoTreasureContract.address)
        ).to.be.revertedWith("Caller is not an Admin");
  });
});
