const { ethers } = require("hardhat");

async function getKyodoRegistry() {
    try {
        const KyodoRegistry = await ethers.getContractFactory("KyodoRegistry");
        const kyodoRegistry = await KyodoRegistry.attach(process.env.NEXT_PUBLIC_KYODO_REGISTRY);
        const address = await kyodoRegistry.getRegistry("AGREEMENT_CONTRACT_ADDRESS");
        console.log("address", address)


    } catch (error) {
        console.error("Failed to initialize KyodoRegistry contract: ", error);
        throw error;
    }
}

getKyodoRegistry()
      