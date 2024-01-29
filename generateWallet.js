const { Keypair } = require("@solana/web3.js");
const { writeFileSync, write } = require("fs");

let pk = [];

let keyPairArray = [];

for (let i = 0; i < 1; i++) {
  const keypair = Keypair.generate();
  console.log("keypair", keypair.publicKey.toBase58());

  keyPairArray = Array.from(keypair.secretKey);

  pk.push(keypair.publicKey.toBase58());
}

writeFileSync("output.json", JSON.stringify(keyPairArray));
writeFileSync(`public.json`, JSON.stringify(pk));
