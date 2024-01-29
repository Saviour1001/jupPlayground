export const RPC_URLS=
  ["https://mainnet.helius-rpc.com/?api-key=13eff9dc-b9a2-4b0f-add6-c7a1ece4a7aa",
  "https://mainnet.helius-rpc.com/?api-key=13eff9dc-b9a2-4b0f-add6-c7a1ece4a7aa",
  "https://mainnet.helius-rpc.com/?api-key=13eff9dc-b9a2-4b0f-add6-c7a1ece4a7aa"
]


const tokens = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  Bonk: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
};

export const inputToken = tokens.USDC;
export const outputToken = tokens.SOL;
export const slippage = 50; // 0.5%
export const amount = 1000000; // in LAMPORTS
