import { ethers } from 'ethers';
import ERC20_ABI from '../abis/ERC20.json';

class ERC20Token {
  constructor(tokenAddress) {
    if (!tokenAddress) throw new Error("Token address is required");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI.abi, provider.getSigner());
    return contract;
  }
}

export default ERC20Token;