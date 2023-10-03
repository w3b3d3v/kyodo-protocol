import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "./agreement_program.json";

export function agreementContract() {
  const programAddress = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_AGREEMENT_CONTRACT_ADDRESS);
  const contract = new Program(idl, programAddress, window.solana);
  console.log("contract",contract)

  return contract;
}