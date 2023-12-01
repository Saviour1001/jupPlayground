import {
  Connection,
  Keypair,
  VersionedTransaction,
  clusterApiUrl,
  PublicKey,
  AddressLookupTableAccount,
  TransactionMessage,
  TransactionInstruction,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

const swapUserKeypair = Keypair.generate();
