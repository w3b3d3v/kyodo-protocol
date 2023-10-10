// tokenConfig.js

import tokens from "../../public/allowedTokens.json";

const ENV = process.env.NODE_ENV;
const FAKE_SOL = process.env.NEXT_PUBLIC_SOLANA_FAKE_STABLE_ADDRESS;
const FAKE_EVM = process.env.NEXT_PUBLIC_FAKE_STABLE_ADDRESS;

export const getTokens = (chain) => {
    if (ENV !== 'development') {
        return tokens;
    }

    if (chain === 'solana') {
        return [...tokens, { name: 'fakeSOL', address: FAKE_SOL, "decimals": 8}];
    }

    if (chain === 'evm') {
        return [...tokens, { name: 'fakeStable', address: FAKE_EVM, "decimals": 18}];
    }

    return tokens;
};
