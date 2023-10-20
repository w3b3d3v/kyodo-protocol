const { ethers } = require("hardhat");

async function main() {
  const VariableStorageFactory = await ethers.getContractFactory(
    "VariableStorage"
  );
  const [admin] = await ethers.getSigners();
  const VariableStorage = await VariableStorageFactory.deploy(
    admin.address,
    "VariableStorage"
  );
  await VariableStorage.deployed();
  console.log("VariableStorage deployed to:", VariableStorage.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
