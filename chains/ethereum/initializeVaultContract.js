import { ethers } from "ethers";
import VaultContract from '../../contexts/contracts/StableVault.json';

export function initializeVaultContract() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractABI = VaultContract.abi;
    const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_STABLE_VAULT_ADDRESS, 
        contractABI, 
        provider.getSigner()
    );
    return contract;
}