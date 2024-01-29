const {Keypair} = require("@solana/web3.js");
  const { writeFileSync, write } = require("fs");

let accounts = [];
let pk = [];



for(let i=0;i<1;i++){
  const keypair = Keypair.generate()
  console.log("keypair", keypair.publicKey.toBase58());

  const keyPairArray = Array.from(keypair.secretKey);
  console.log("keyPairArray", keyPairArray);
  accounts.push(keyPairArray);
  pk.push(keypair.publicKey.toBase58());
}

writeFileSync('output.json', JSON.stringify(accounts));
writeFileSync(`public.json`, JSON.stringify(pk));





