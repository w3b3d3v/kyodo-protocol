const { ethers } = require("hardhat");
require('dotenv').config({ path: '../../.env' });
const { mnemonicToSeedSync } = require("bip39");
const { HDNode } = require("@ethersproject/hdnode");
const networks = require("./networks.json");

const seed = mnemonicToSeedSync(process.env.MNEMONIC);
const masterNode = HDNode.fromSeed(seed);
const account = masterNode.derivePath("m/44'/60'/0'/0/0");  // The last /N defines the account index
const rpcList = networks.rpcList;

async function synchronizeNonces(privateKey) {
  const nonces = [];
  const wallets = [];

  for (const rpcUrl of rpcList) {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    wallets.push(wallet);
    const chainId = await wallet.getChainId();
    const balance = await wallet.getBalance();

    const nonce = await wallet.getTransactionCount();
    nonces.push(nonce);

    console.log(`\naccount: ${wallet.address}`);
    console.log(`Chain ID: ${chainId}`);
    console.log(`Nonce: ${nonce}`);
    console.log(`Nonce: ${balance}`);
  }

  const highestNonce = Math.max(...nonces);

  for (let i = 0; i < rpcList.length; i++) {
    const difference = highestNonce - nonces[i];
    for (let j = 0; j < difference; j++) {
      const tx = await wallets[i].sendTransaction({
        to: wallets[i].address,
        value: ethers.utils.parseEther('0')
      });
      const txReceipt = await tx.wait();

      const gasUsed = txReceipt.gasUsed;
      console.log(`\nGas used for transaction ${j + 1} on ${rpcList[i]}: ${gasUsed.toString()} gwei`);

      console.log(`Sent dummy transaction ${j + 1} to ${rpcList[i]}`);
    }
  }
}

const privateKey = account.privateKey
synchronizeNonces(privateKey);
