# Innings WireFluid Contracts

This folder contains the on-chain modules for reward proofs, soulbound reward authenticity, brand campaign commitments, and brand verification badges.

## Contracts

1. RewardProof.sol
- Purpose: immutable winner proof ledger.
- Write method:
  - recordWin(string userId, string matchId, string rewardId, uint256 credits, bytes32 hash)
- Useful view methods:
  - proofExists(bytes32 hash)
  - winRecords(uint256 winId)
- Events:
  - WinRecorded

2. RewardAuthenticitySBT.sol
- Purpose: mint non-transferable reward NFTs for premium redemptions.
- Write method:
  - mintRewardNFT(address to, string metadataURI)
- Soulbound behavior:
  - transfer and approval methods revert.
- Events:
  - RewardNFTMinted

3. BrandCommitmentProof.sol
- Purpose: put brand reward promises on-chain.
- Write methods:
  - createCampaign(string brandId, uint256 rewardCount, bytes32 metadataHash)
  - completeCampaign(uint256 campaignId)
  - cancelCampaign(uint256 campaignId)
- Events:
  - CampaignCreated
  - CampaignCompleted
  - CampaignCancelled

4. BrandVerificationBadge.sol
- Purpose: issue and revoke admin verification badges for brands.
- Write methods:
  - issueBadge(address brandWallet, string brandId, string metadataURI)
  - revokeBadge(uint256 tokenId)
- View method:
  - isVerified(address brandWallet)
- Soulbound behavior:
  - transfer and approval methods revert.
- Events:
  - VerificationBadgeIssued
  - VerificationBadgeRevoked

## Role Model

All contracts use AccessControl.

Environment variables allow assigning backend/admin operators at deploy time:
- CONTRACT_ADMIN_ADDRESS
- REWARD_PROOF_RECORDER
- REWARD_NFT_MINTER
- CAMPAIGN_MANAGER
- BRAND_VERIFIER

If role-specific addresses are not set, deployer address is used.

## WireFluid Network

Configured in truffle-config.js:
- RPC: https://evm.wirefluid.com
- Chain ID: 92533

Verified via JSON-RPC call:
- eth_chainId returned 0x16975 (decimal 92533).

## Setup

1. Install dependencies
- npm install

2. Create env file
- copy .env.example to .env
- set WIREFLUID_PRIVATE_KEY (or WIREFLUID_PRIVATE_KEYS)

3. Compile
- npm run compile

4. Run tests
- npm test

All tests pass:
- 13 passing

5. Deploy to wireFluid
- npm run migrate:wirefluid:reset

## Backend Integration Examples (Ethers.js)

```ts
import { ethers } from "ethers";
import RewardProofArtifact from "../../truffle/build/contracts/RewardProof.json";
import RewardAuthenticitySBTArtifact from "../../truffle/build/contracts/RewardAuthenticitySBT.json";
import BrandCommitmentProofArtifact from "../../truffle/build/contracts/BrandCommitmentProof.json";
import BrandVerificationBadgeArtifact from "../../truffle/build/contracts/BrandVerificationBadge.json";

const provider = new ethers.JsonRpcProvider(process.env.WIREFLUID_RPC_URL);
const signer = new ethers.Wallet(process.env.BACKEND_SIGNER_PRIVATE_KEY!, provider);

const rewardProof = new ethers.Contract(
  process.env.REWARD_PROOF_ADDRESS!,
  RewardProofArtifact.abi,
  signer
);

const rewardSbt = new ethers.Contract(
  process.env.REWARD_SBT_ADDRESS!,
  RewardAuthenticitySBTArtifact.abi,
  signer
);

const commitmentProof = new ethers.Contract(
  process.env.BRAND_COMMITMENT_ADDRESS!,
  BrandCommitmentProofArtifact.abi,
  signer
);

const verificationBadge = new ethers.Contract(
  process.env.BRAND_VERIFICATION_BADGE_ADDRESS!,
  BrandVerificationBadgeArtifact.abi,
  signer
);
```

### 1) Reward Proof write

```ts
const timestamp = Math.floor(Date.now() / 1000);
const proofHash = ethers.keccak256(
  ethers.solidityPacked(
    ["string", "string", "string", "uint256"],
    [userId, matchId, rewardType, timestamp]
  )
);

await rewardProof.recordWin(userId, matchId, rewardId, credits, proofHash);
```

### 2) Reward Authenticity SBT mint

```ts
await rewardSbt.mintRewardNFT(userWallet, metadataURI);
```

### 3) Brand Commitment Proof write

```ts
await commitmentProof.createCampaign(brandId, rewardCount, metadataHash);
```

### 4) Brand Verification Badge issue

```ts
await verificationBadge.issueBadge(brandWallet, brandId, metadataURI);
```

## Notes

- Do not commit private keys.
- Store deployed contract addresses in backend env and persist in MongoDB as needed.
- Index contract events for audit views and explorer links.
