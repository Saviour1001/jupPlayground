import { Worker, isMainThread, workerData, parentPort } from "worker_threads";
import {
  Connection,
  Keypair,
  VersionedTransaction,
  clusterApiUrl,
} from "@solana/web3.js";

import workerDataReceived from 'worker_threads';
console.log("Secret Key" + JSON.stringify(workerDataReceived));
/* const swapUserKeypair = Keypair.fromSecretKey(new Uint8Array(workerDataReceived));
 console.log("Swap User : "+swapUserKeypair.publicKey.toBase58());

const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=13eff9dc-b9a2-4b0f-add6-c7a1ece4a7aa", "confirmed");
let val = "https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112\&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\&amount=100000000\&slippageBps=50";
try {
  const quoteResponse =await(await fetch(val)).json();
console.log("Quote" + JSON.stringify(quoteResponse));

} catch (e) {
  console.log("Error is " + e);
} */

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

// deserialize the transaction
const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
console.log("transaction:"+transaction+"Conn"+connection);

// sign the transaction
/* transaction.sign([swapUserKeypair._keypair]);

const rawTransaction = transaction.serialize();
const txid = await connection.sendRawTransaction(rawTransaction, {
  skipPreflight: true,
});
await connection.confirmTransaction(txid);
console.log(`https://solscan.io/tx/${txid}`);

 */