import { Worker, isMainThread, workerData, parentPort } from "worker_threads";
import {
  Connection,
  Keypair,
  VersionedTransaction,
  clusterApiUrl,
} from "@solana/web3.js";

import workerDataReceived from "worker_threads";
import { RPC_URL, amount, inputToken, outputToken, slippage } from "./consts";
// console.log("Secret Key" + JSON.stringify(workerDataReceived.workerData));
const swapUserKeypair = Keypair.fromSecretKey(
  new Uint8Array(workerDataReceived.workerData)
);
console.log("Swap User : " + swapUserKeypair.publicKey.toBase58());

const connection = new Connection(RPC_URL, "confirmed");
let val = `https://quote-api.jup.ag/v6/quote?inputMint=${inputToken}&outputMint=${outputToken}&amount=${amount}&slippageBps=${slippage}`;

let quoteResponse;
try {
  quoteResponse = await (await fetch(val)).json();
  console.log("found the quote");
  console.log("Quote" + JSON.stringify(quoteResponse));
} catch (e) {
  console.log("Error is " + e);
}

// get serialized transactions for the swap
const { swapTransaction } = await (
  await fetch("https://quote-api.jup.ag/v6/swap", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // quoteResponse from /quote api
      quoteResponse,
      // user public key to be used for the swap
      userPublicKey: swapUserKeypair.publicKey.toString(),
      // auto wrap and unwrap SOL. default is true
      wrapAndUnwrapSol: true,
      // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
      // feeAccount: "fee_account_public_key"
    }),
  })
).json();

// console.log("Swap Transaction" + swapTransaction);

// deserialize the transaction
const swapTransactionBuf = Buffer.from(swapTransaction, "base64");

var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

console.log("////////////////");
// console.log("Swap Transaction" + JSON.stringify(transaction));
// sign the transaction
transaction.sign([swapUserKeypair]);

const rawTransaction = transaction.serialize();

console.log("Raw Transaction" + rawTransaction);
const txid = await connection.sendRawTransaction(rawTransaction, {
  skipPreflight: true,
});
await connection.confirmTransaction(txid);
console.log(`https://solscan.io/tx/${txid}`);
