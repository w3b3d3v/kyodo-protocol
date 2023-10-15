import { PublicKey } from "@solana/web3.js";
import idl from "./agreement_program.json";
import * as anchor from "@coral-xyz/anchor";

const opts ={
  preflightCommitment: "processed"
}

export function agreementContract(details) {
  const provider = new anchor.AnchorProvider(
    details.connection,
    details.wallet.adapter,
    anchor.AnchorProvider.defaultOptions()
  )
  anchor.setProvider(provider);
  
  const programAddress = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_AGREEMENT_CONTRACT_ADDRESS);
  const contract = new anchor.Program(idl, programAddress, provider);
  return contract;
}