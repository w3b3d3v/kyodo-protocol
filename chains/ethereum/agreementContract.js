import { ethers } from "ethers";
import AgreementContract from '../../contexts/contracts/AgreementContract.json';

export function agreementContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contractABI = AgreementContract.abi
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_AGREEMENT_CONTRACT_ADDRESS,
    contractABI,
    provider.getSigner()
  )
  return contract
}