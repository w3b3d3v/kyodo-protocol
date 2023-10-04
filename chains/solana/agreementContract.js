import { PublicKey } from "@solana/web3.js";
import idl from "./agreement_program.json";
import {Connection } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

const opts ={
  preflightCommitment: "processed"
}

const getProvider =() => {
  console.log("window.solana", window.solana)
  const connection = new Connection("http://127.0.0.1:8899", opts.preflightCommitment);
  const provider = new anchor.AnchorProvider(
    connection,
    window.solana,
    anchor.AnchorProvider.defaultOptions()
  );
  anchor.setProvider(provider);
  return provider;
}

export function agreementContract() {
  if (!window.solana.isConnected) {
    window.solana.connect();
  }

  const provider = getProvider();
  const programAddress = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_AGREEMENT_CONTRACT_ADDRESS);
  const contract = new anchor.Program(idl, programAddress, provider);
  return contract;
}