const { ethers } = require("hardhat");

async function main() {
  const KyodoRegistryFactory = await ethers.getContractFactory(
    "KyodoRegistry"
  );
  const [admin] = await ethers.getSigners();
  const KyodoRegistry = await KyodoRegistryFactory.deploy(
    admin.address,
    "KyodoRegistry"
  );
  await KyodoRegistry.deployed();
  console.log("KyodoRegistry deployed to:", KyodoRegistry.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
