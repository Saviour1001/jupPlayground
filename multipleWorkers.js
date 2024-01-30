import { Worker, isMainThread, workerData, parentPort } from "worker_threads";
import keys from "./output.json" assert { type: "json" };
import {
  Connection,
  Keypair,
  VersionedTransaction,
  clusterApiUrl,
} from "@solana/web3.js";

import {
  RPC_URLS,
  amount,
  inputToken,
  outputToken,
  slippage,
} from "./consts.js";

/* const totalWorkers = require('os').cpus().length - 2;
console.log(`Running with ${totalWorkers} worker(s).`); */
let transactions = [];
async function buildTransaction() {
  for (let i = 0.1; i < 1.9; i = i + 0.1) {
    try {
      buildBody(i, keys);
    } catch (e) {
      buildBody(i, keys);
    }
  }
}

buildTransaction();
async function buildBody(slippage, key) {
  //  console.log(key);
  const swapUserKeypair = Keypair.fromSecretKey(new Uint8Array(key));
  let val = `https://quote-api.jup.ag/v6/quote?inputMint=${inputToken}&outputMint=${outputToken}&amount=${amount}&slippageBps=${(
    slippage * 100
  ).toFixed(0)}`;
  //console.log("vall : "+val);
  let quoteResponse = await (await fetch(val)).json();
  //  console.log("found the quote : " + quoteResponse);

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
        userPublicKey: swapUserKeypair.publicKey.toBase58(),
        // auto wrap and unwrap SOL. default i~s true
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: "auto",

        // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
        // feeAccount: "fee_account_public_key"
      }),
    })
  ).json();

  //  console.log("Swap Transaction" + swapTransaction);

  // deserialize the transaction
  const swapTransactionBuf = await Buffer.from(swapTransaction, "base64");

  var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

  console.log("//////signing the txn//////////");
  // console.log("Swap Transaction" + JSON.stringify(transaction));
  // sign the transaction
  transaction.sign([swapUserKeypair]);

  const rawTransaction = transaction.serialize();
  transactions.push(rawTransaction);
  if (transactions.length == 18) {
    startWorker();
  }
}

function startWorker() {
  //6 workers -> Each Worker = 3 Transactions , total 18 traansactions
  let localCounter = 1;
  for (let i = 0; i < 5; i++) {
    const worker = new Worker("./worker.js", {
      workerData: {
        t1: transactions[localCounter],
        t2: transactions[localCounter + 1],
        t3: transactions[localCounter + 2],
      },
    });
    localCounter = localCounter + 3;
    worker.on("message", async (result) => {
      console.log(result);
    });

    worker.on("error", (error) => {
      console.error("Worker error:", error);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
    });
  }
}
