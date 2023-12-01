import {
  Connection,
  Keypair,
  VersionedTransaction,
  clusterApiUrl,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

const swapUserKeypair = Keypair.generate();

const quoteResponse = await (
  await fetch(
    "https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112\
&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\
&amount=100000000\
&slippageBps=50\
&platformFeeBps=20" // 0.2%
  )
).json();

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
console.log(transaction);

// sign the transaction
transaction.sign([swapUserKeypair]);

const rawTransaction = transaction.serialize();
const txid = await connection.sendRawTransaction(rawTransaction, {
  skipPreflight: true,
});
await connection.confirmTransaction(txid);
console.log(`https://solscan.io/tx/${txid}`);
