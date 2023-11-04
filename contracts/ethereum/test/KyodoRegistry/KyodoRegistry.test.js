// const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("KyodoRegistry", function () {
  let kyodoRegistry;
  let deployReceipt;

  beforeEach(async () => {
    const KyodoRegistryContract = await ethers.getContractFactory(
      "KyodoRegistry"
    );
    [admin, newAdmin, notAdmin, kyodoTreasureContract, communityTreasureContract] = await ethers.getSigners();
    kyodoRegistry = await KyodoRegistryContract.deploy(admin.address);

    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    const contract = await AgreementContract.deploy(
      kyodoTreasureContract.address,
      communityTreasureContract.address
      )
    await contract.deployed();
    deployReceipt = await contract.deployTransaction.wait()

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
    await kyodoRegistry.connect(admin).createRegistry('KYODO_TREASURY_CONTRACT_ADDRESS', kyodoTreasureContract.address, deployReceipt.blockNumber)
    await kyodoRegistry.connect(admin).createRegistry('COMMUNITY_TREASURY_CONTRACT_ADDRESS', communityTreasureContract.address, deployReceipt.blockNumber)
    const kyodoStoredAddr = await kyodoRegistry.getRegistry('KYODO_TREASURY_CONTRACT_ADDRESS')
    const communityStoredAddr = await kyodoRegistry.getRegistry('COMMUNITY_TREASURY_CONTRACT_ADDRESS')
    expect(kyodoStoredAddr).to.be.equal(kyodoTreasureContract.address)
    expect(communityStoredAddr).to.be.equal(communityTreasureContract.address)
  });

  it("Should update a registry", async function () {
    await kyodoRegistry.connect(admin).createRegistry('KYODO_TREASURY_CONTRACT_ADDRESS', kyodoTreasureContract.address, deployReceipt.blockNumber)
    await kyodoRegistry.connect(admin).updateRegistry('KYODO_TREASURY_CONTRACT_ADDRESS', communityTreasureContract.address, deployReceipt.blockNumber)
    const newAddr = await kyodoRegistry.getRegistry('KYODO_TREASURY_CONTRACT_ADDRESS')
    expect(newAddr).to.be.equal(communityTreasureContract.address)
  });

  it("Should not throw error if registry exists", async function () {
    await kyodoRegistry.connect(admin).createRegistry('KYODO_TREASURY_CONTRACT_ADDRESS', kyodoTreasureContract.address, deployReceipt.blockNumber)
    expect(await kyodoRegistry.getRegistry('KYODO_TREASURY_CONTRACT_ADDRESS')).to.be.equal(kyodoTreasureContract.address, deployReceipt.blockNumber);
  });

  it("Should throw error if registry does not exists", async function () {
    await expect(kyodoRegistry.getRegistry('REGISTRY_NOT_EXISTS')).to.be.revertedWith("Registry does not exists");
  });
  
  it("Should revert if not admin try do add or modify an variable", async function () {
    await expect(
      kyodoRegistry.connect(notAdmin).createRegistry('KYODO_TREASURY_CONTRACT_ADDRESS', kyodoTreasureContract.address, deployReceipt.blockNumber)
        ).to.be.revertedWith("Caller is not an Admin");
  });

  it("Should revert if trying to update a non-existent registry", async function () {
    const newAddress = ethers.Wallet.createRandom().address;
    await expect(
      kyodoRegistry.connect(admin).updateRegistry('NON_EXISTENT_REGISTRY', newAddress, deployReceipt.blockNumber)
    ).to.be.revertedWith("Registry does not exists");
  });

  it("Should allow multiple updates to an existing registry by an admin", async function () {
    await kyodoRegistry.connect(admin).createRegistry('KYODO_TREASURY_CONTRACT_ADDRESS', kyodoTreasureContract.address, deployReceipt.blockNumber);
    
    const newAddress1 = ethers.Wallet.createRandom().address;
    await kyodoRegistry.connect(admin).updateRegistry('KYODO_TREASURY_CONTRACT_ADDRESS', newAddress1, deployReceipt.blockNumber);
    expect(await kyodoRegistry.getRegistry('KYODO_TREASURY_CONTRACT_ADDRESS')).to.equal(newAddress1);
    
    const newAddress2 = ethers.Wallet.createRandom().address;
    await kyodoRegistry.connect(admin).updateRegistry('KYODO_TREASURY_CONTRACT_ADDRESS', newAddress2, deployReceipt.blockNumber);
    expect(await kyodoRegistry.getRegistry('KYODO_TREASURY_CONTRACT_ADDRESS')).to.equal(newAddress2);
  });

  it("Updating one registry does not affect another", async function () {
    const contractOne = ethers.Wallet.createRandom()
    const contractTwo = ethers.Wallet.createRandom()
    await kyodoRegistry.connect(admin).createRegistry('REGISTRY_ONE', contractOne.address, deployReceipt.blockNumber);
    await kyodoRegistry.connect(admin).createRegistry('REGISTRY_TWO', contractTwo.address, deployReceipt.blockNumber);
  
    // Update REGISTRY_ONE and check REGISTRY_TWO remains the same.
    const newAddressForOne = ethers.Wallet.createRandom().address;
    await kyodoRegistry.connect(admin).updateRegistry('REGISTRY_ONE', newAddressForOne, deployReceipt.blockNumber);
  
    expect(await kyodoRegistry.getRegistry('REGISTRY_TWO')).to.equal(contractTwo.address);
  }); 

  it("Should save a new registry with the deployment block number", async function () {
    const tx = await kyodoRegistry.connect(admin).createRegistry('KYODO_TREASURY_CONTRACT_ADDRESS', kyodoTreasureContract.address, 123456);
    await tx.wait();
    const blockNumber = await kyodoRegistry.getBlockDeployment('KYODO_TREASURY_CONTRACT_ADDRESS');
    expect(blockNumber).to.equal(123456);
  });

  it("Should update a registry with a new deployment block number", async function () {
    let tx = await kyodoRegistry.connect(admin).createRegistry('KYODO_TREASURY_CONTRACT_ADDRESS', kyodoTreasureContract.address, 123456);
    await tx.wait();
    tx = await kyodoRegistry.connect(admin).updateRegistry('KYODO_TREASURY_CONTRACT_ADDRESS', communityTreasureContract.address, 654321);
    await tx.wait();
    const blockNumber = await kyodoRegistry.getBlockDeployment('KYODO_TREASURY_CONTRACT_ADDRESS');
    expect(blockNumber).to.equal(654321);
  });

  it("Should not allow creation of a registry with the same key", async function () {
    const tx = await kyodoRegistry.connect(admin).createRegistry('KYODO_TREASURY_CONTRACT_ADDRESS', kyodoTreasureContract.address, 123456);
    await tx.wait();
    await expect(kyodoRegistry.connect(admin).createRegistry('KYODO_TREASURY_CONTRACT_ADDRESS', communityTreasureContract.address, 123457)).to.be.revertedWith("The registry already exists");
  });
});
