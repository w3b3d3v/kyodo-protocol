import { PublicKey } from "@solana/web3.js";
import idl from "./agreement_program.json";
import {Connection } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

const opts ={
  preflightCommitment: "processed"
}

export function agreementContract(wallet) {
  // const connection = new Connection("http://127.0.0.1:8899", opts.preflightCommitment);
  const provider = new anchor.AnchorProvider(
    new Connection("https://api.devnet.solana.com"),
    wallet.adapter,
    anchor.AnchorProvider.defaultOptions()
  )
  anchor.setProvider(provider);
  
  const programAddress = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_AGREEMENT_CONTRACT_ADDRESS);
  const contract = new anchor.Program(idl, programAddress, provider);
  return contract;
}