import { Worker, isMainThread, workerData, parentPort } from "worker_threads";
import {
  Connection,
  Keypair,
  VersionedTransaction,
  clusterApiUrl,
} from "@solana/web3.js";

import workerDataReceived from "worker_threads";

import { RPC_URLS, amount, inputToken, outputToken, slippage } from "./consts.js";
// console.log("Secret Key" + JSON.stringify(workerDataReceived.workerData));

let transactions = [];
// console.log("Data Received :" + JSON.stringify(workerDataReceived.workerData.t1))
transactions.push(workerDataReceived.workerData.t1,workerDataReceived.workerData.t2,workerDataReceived.workerData.t3)
  let counter = 0;
  for (let i = 0; i < 3; i++) {
    console.log("Executing");
    try {
      console.log("//////sending the txn with RPC 1//////////");
      const connection = new Connection(RPC_URLS[counter], "confirmed");
      const txid = await connection.sendRawTransaction(transactions[i], {
        skipPreflight: true,
      });
      console.log("//////confirming the txn//////////");
      await connection.confirmTransaction(txid);

      console.log(`https://solana.fm/tx/${txid}`);
      counter++;
      if (counter == 4) {
        counter = 0;
      }
    } catch (e) {
      console.log("//////sending the txn with RPC 1//////////");
      const connection = new Connection(RPC_URLS[counter + 1], "confirmed");
      const txid = await connection.sendRawTransaction(transactions[i], {
        skipPreflight: true,
      });
      console.log("//////confirming the txn//////////");
      await connection.confirmTransaction(txid);

      console.log(`https://solana.fm/tx/${txid}`);
      console.log("Error is " + e);
    }
  }





