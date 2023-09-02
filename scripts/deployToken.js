const fs = require('fs');
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy do token com 1 milhão de supply
    const Token = await ethers.getContractFactory("testToken");
    const token = await Token.deploy(ethers.utils.parseEther("1000000")); // 1 milhão de tokens
    await token.deployed();

    console.log("Token deployed to:", token.address);

    // Carregar e ler o arquivo allowedTokens.json
    const allowedTokensPath = 'src/assets/allowedTokens.json';
    const allowedTokensData = fs.readFileSync(allowedTokensPath, 'utf8');
    const allowedTokens = JSON.parse(allowedTokensData);

    // Verificar se há pelo menos um token na lista
    if (allowedTokens.length > 0) {
        // Atualizar os valores do último token na lista
        const lastToken = allowedTokens[allowedTokens.length - 1];
        lastToken.address = token.address; // Atualizar o endereço do token
        lastToken.logo = "src/components/assets/your-token-logo.svg"; // Atualizar o caminho do logo
        lastToken.name = "fakeStable"; // Atualizar o nome do token
        lastToken.decimals = 18; // Atualizar o número de casas decimais conforme necessário

        // Escrever a lista atualizada de tokens de volta no arquivo allowedTokens.json
        const updatedAllowedTokensData = JSON.stringify(allowedTokens, null, 2);
        fs.writeFileSync(allowedTokensPath, updatedAllowedTokensData, 'utf8');

        console.log("Last token in allowedTokens.json updated");
    } else {
        console.log("No tokens found in allowedTokens.json");
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
});
