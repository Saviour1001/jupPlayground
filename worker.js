import { Worker, isMainThread, workerData, parentPort } from "worker_threads";
import {
  Connection,
  Keypair,
  VersionedTransaction,
  clusterApiUrl,
} from "@solana/web3.js";

import workerDataReceived from "worker_threads";

import {
  RPC_URLS,
  amount,
  inputToken,
  outputToken,
  slippage,
} from "./consts.js";
// console.log("Secret Key" + JSON.stringify(workerDataReceived.workerData));

let transactions = [];
// console.log("Data Received :" + JSON.stringify(workerDataReceived.workerData.t1))
transactions.push(
  workerDataReceived.workerData.t1,
  workerDataReceived.workerData.t2,
  workerDataReceived.workerData.t3
);

for (let i = 0; i < 3; i++) {
  console.log("Executing");

  const connection1 = new Connection(RPC_URLS[0], "confirmed");
  const connection2 = new Connection(RPC_URLS[1], "confirmed");
  const connection3 = new Connection(RPC_URLS[2], "confirmed");

  console.log("Sending via RPC url", RPC_URLS[0]);
  const txid1 = await connection1.sendRawTransaction(transactions[i], {
    skipPreflight: true,
  });

  console.log("Sending via RPC url", RPC_URLS[1]);
  const txid2 = await connection2.sendRawTransaction(transactions[i], {
    skipPreflight: true,
  });

  console.log("Sending via RPC url", RPC_URLS[2]);
  const txid3 = await connection3.sendRawTransaction(transactions[i], {
    skipPreflight: true,
  });

  console.log("txid is " + txid1);
}
