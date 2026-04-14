const path = require("path");
const dotenv = require("dotenv");
const HDWalletProvider = require("@truffle/hdwallet-provider");

dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const WIREFLUID_RPC_URL = process.env.WIREFLUID_RPC_URL || "https://evm.wirefluid.com";
const WIREFLUID_CHAIN_ID = Number(process.env.WIREFLUID_CHAIN_ID || "92533");

function getPrivateKeys() {
  const fromSingle = process.env.WIREFLUID_PRIVATE_KEY
    ? [process.env.WIREFLUID_PRIVATE_KEY]
    : [];
  const fromList = process.env.WIREFLUID_PRIVATE_KEYS
    ? process.env.WIREFLUID_PRIVATE_KEYS.split(",")
    : [];

  return [...fromSingle, ...fromList]
    .map((key) => key.trim())
    .filter(Boolean)
    .map((key) => (key.startsWith("0x") ? key.slice(2) : key));
}

function buildWirefluidProvider() {
  const privateKeys = getPrivateKeys();

  if (privateKeys.length === 0) {
    throw new Error(
      "Missing WIREFLUID_PRIVATE_KEY or WIREFLUID_PRIVATE_KEYS. Set one of these env variables before deploying."
    );
  }

  return new HDWalletProvider({
    privateKeys,
    providerOrUrl: WIREFLUID_RPC_URL,
    chainId: WIREFLUID_CHAIN_ID,
  });
}

module.exports = {
  networks: {
    wirefluid: {
      provider: () => buildWirefluidProvider(),
      network_id: WIREFLUID_CHAIN_ID,
      confirmations: 1,
      timeoutBlocks: 400,
      skipDryRun: true,
      networkCheckTimeout: 120000,
    },
  },

  mocha: {
    timeout: 100000,
  },

  compilers: {
    solc: {
      version: "0.8.21",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
