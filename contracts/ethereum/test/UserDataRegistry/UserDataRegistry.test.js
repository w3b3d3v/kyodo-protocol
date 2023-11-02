const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("UserDataRegistry", function () {
  let userDataRegistry;
  let admin, user1, user2;

  beforeEach(async () => {
    const UserDataRegistry = await ethers.getContractFactory("UserDataRegistry");
    [admin, user1, user2] = await ethers.getSigners();
    userDataRegistry = await UserDataRegistry.deploy();
    await userDataRegistry.deployed();
  });

  it("Should set and get a community", async function () {
    const name = "ETH Community";
    const logo = "https://ethereum.org/eth.png";
    const description = "Ethereum Community description";
    await userDataRegistry.connect(admin).setCommunity(name, logo, description);
    const community = await userDataRegistry.getCommunity(admin.address);
    expect(community.name).to.equal(name);
    expect(community.logo).to.equal(logo);
    expect(community.description).to.equal(description);
  });

  it("Should set and get a contractor", async function () {
    const name = "Contractor Name";
    const document = "123456789";
    const logo = "https://companysw.com/logo.png";
    const website = "https://companysw.com";
    const about = "We build web3 softwares";
    await userDataRegistry.connect(user1).setContractor(name, document, logo, website, about);
    const contractor = await userDataRegistry.getContractor(user1.address);
    expect(contractor.name).to.equal(name);
    expect(contractor.document).to.equal(document);
    expect(contractor.logo).to.equal(logo);
    expect(contractor.website).to.equal(website);
    expect(contractor.about).to.equal(about);
  });

  it("Should set and get a professional", async function () {
    const name = "Professional name";
    const bio = "Professional bio";
    const avatar = "https://professional.com/avatar.png";
    const website = "https://professional.com";
    const communityName = "Community name";
    const communityAddress = user1.address;
    await userDataRegistry.connect(user2).setProfessional(name, bio, avatar, website, communityName, communityAddress);
    const professional = await userDataRegistry.getProfessional(user2.address);
    expect(professional.name).to.equal(name);
    expect(professional.bio).to.equal(bio);
    expect(professional.avatar).to.equal(avatar);
    expect(professional.website).to.equal(website);
    expect(professional.communityName).to.equal(communityName);
    expect(professional.communityAddress).to.equal(communityAddress);
  });

  // community
  it("Should revert if community required field name is not provided", async function () {
    await expect(userDataRegistry.connect(user1).setCommunity("", "https://community.com/logo.png", "Description")).to.be.revertedWith("Name cannot be empty");
  });

  it("Should revert if community required field logo is not provided", async function () {
    await expect(userDataRegistry.connect(user1).setCommunity("Community name", "", "Description")).to.be.revertedWith("Logo URL cannot be empty");
  });

  it("Should revert if community required field description is not provided", async function () {
    await expect(userDataRegistry.connect(user1).setCommunity("Community name", "https://community.com/logo.png", "")).to.be.revertedWith("Description cannot be empty");
  });

  // professional
  it("Should revert if professional required field name is not provided", async function () {
    await expect(userDataRegistry.connect(user1).setProfessional("", "Bio", "https://professional.com/avatar.png", "https://professional.com", "Community name", user1.address)).to.be.revertedWith("Name cannot be empty");
  });

  it("Should revert if professional required field Bio is not provided", async function () {
    await expect(userDataRegistry.connect(user1).setProfessional("Professional name", "", "https://professional.com/avatar.png", "https://professional.com", "Community name", user1.address)).to.be.revertedWith("Bio cannot be empty");
  });

  it("Should revert if professional required field avatar is not provided", async function () {
    await expect(userDataRegistry.connect(user1).setProfessional("Professional name", "Bio", "", "https://professional.com", "Community name", user1.address)).to.be.revertedWith("Avatar URL cannot be empty");
  });

  it("Should revert if professional required field website is not provided", async function () {
    await expect(userDataRegistry.connect(user1).setProfessional("Professional name", "Bio", "https://professional.com/avatar.png", "", "Community name", user1.address)).to.be.revertedWith("Website cannot be empty");
  });

  it("Should revert if professional required field community name is not provided", async function () {
    await expect(userDataRegistry.connect(user1).setProfessional("Professional name", "Bio", "https://professional.com/avatar.png", "https://professional.com", "", user1.address)).to.be.revertedWith("Community name cannot be empty");
  });

  it("Should revert if professional required field community address is not valid", async function () {
    await expect(userDataRegistry.connect(user1).setProfessional("Professional name", "Bio", "https://professional.com/avatar.png", "https://professional.com", "Community name", '0x0000000000000000000000000000000000000000')).to.be.revertedWith("Invalid community address");
  });

  // contractor
  it("Should revert if contractor required field name is not provided", async function () {
    await expect(userDataRegistry.connect(user1).setContractor("", "document", "https://contractor.com/logo.png", "https://contractor.com", "Contractor about")).to.be.revertedWith("Name cannot be empty");
  });

  it("Should revert if contractor required field document is not provided", async function () {
    await expect(userDataRegistry.connect(user1).setContractor("Company", "", "https://contractor.com/logo.png", "https://contractor.com", "Contractor about")).to.be.revertedWith("Document cannot be empty");
  });

  it("Should revert if contractor required field logo url is not provided", async function () {
    await expect(userDataRegistry.connect(user1).setContractor("Company", "document", "", "https://contractor.com", "Contractor about")).to.be.revertedWith("Logo URL cannot be empty");
  });
  it("Should revert if contractor required field website is not provided", async function () {
    await expect(userDataRegistry.connect(user1).setContractor("Company", "document", "https://contractor.com/logo.png", "", "Contractor about")).to.be.revertedWith("Website cannot be empty");
  });
  it("Should revert if contractor required field about is not provided", async function () {
    await expect(userDataRegistry.connect(user1).setContractor("Company", "document", "https://contractor.com/logo.png", "https://contractor.com", "")).to.be.revertedWith("About cannot be empty");
  });
});
