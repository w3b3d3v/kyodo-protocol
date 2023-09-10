import { ethers } from 'ethers';
import ERC20_ABI from './ERC20.json';

class ERC20Token {
  constructor(tokenAddress) {
    if (!tokenAddress) throw new Error("Token address is required");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = provider.getSigner();
    this.contract = new ethers.Contract(tokenAddress, ERC20_ABI.abi, this.signer);
  }

  async getBalance(userAddress) {
    const balance = await this.contract.balanceOf(userAddress);
    return ethers.utils.formatEther(balance);
  }

  async approve(spenderAddress, amount) {
    const amountWei = ethers.utils.parseEther(amount.toString());
    const txResponse = await this.contract.approve(spenderAddress, amountWei);
    return txResponse.wait();  // Aguarda a confirmação da transação
  }

  async getAllowance(userAddress, spenderAddress) {
    const allowance = await this.contract.allowance(userAddress, spenderAddress);
    return allowance;
  }
}

export default ERC20Token;