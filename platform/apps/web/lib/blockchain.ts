import { Contract, JsonRpcProvider, Wallet, ethers } from "ethers"

interface ContractsBundle {
  rewardProof: Contract
  rewardSbt: Contract
  brandCommitment: Contract
}

export interface RecordRewardWinInput {
  userId: string
  matchId: string
  rewardId: string
  credits: number
  rewardType: string
  timestamp?: number
}

export interface RecordRewardWinResult {
  txHash: string
  winId: string
  proofHash: string
  timestamp: number
  contractAddress: string
}

export interface CreateCampaignCommitmentInput {
  brandId: string
  rewardCount: number
  metadataHash: string
}

export interface CreateCampaignCommitmentResult {
  txHash: string
  campaignId: string
  contractAddress: string
}

export interface UpdateCampaignCommitmentResult {
  txHash: string
  contractAddress: string
}

export interface MintRewardNftInput {
  walletAddress: string
  metadataURI: string
}

export interface MintRewardNftResult {
  txHash: string
  tokenId: string
  contractAddress: string
}

const REWARD_PROOF_ABI = [
  "function recordWin(string userId,string matchId,string rewardId,uint256 credits,bytes32 hash) returns (uint256)",
]

const BRAND_COMMITMENT_ABI = [
  "function createCampaign(string brandId,uint256 rewardCount,bytes32 metadataHash) returns (uint256)",
  "function completeCampaign(uint256 campaignId)",
  "function cancelCampaign(uint256 campaignId)",
]

const REWARD_SBT_ABI = [
  "function mintRewardNFT(address to,string metadataURI) returns (uint256)",
]

let contractsCache: ContractsBundle | null = null

function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value || value.trim().length === 0) {
    throw new Error(`${name} environment variable is required for blockchain integration.`)
  }
  return value.trim()
}

function parseChainId(): number {
  const raw = process.env.WIREFLUID_CHAIN_ID || "92533"
  const parsed = Number(raw)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("WIREFLUID_CHAIN_ID must be a valid positive number.")
  }

  return parsed
}

function normalizePrivateKey(privateKey: string): string {
  return privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`
}

function getSignerPrivateKey(): string {
  const value =
    process.env.BACKEND_SIGNER_PRIVATE_KEY ||
    process.env.WIREFLUID_PRIVATE_KEY ||
    process.env.WIREFLUID_PRIVATE_KEYS?.split(",")[0]?.trim()

  if (!value) {
    throw new Error(
      "Missing BACKEND_SIGNER_PRIVATE_KEY or WIREFLUID_PRIVATE_KEY for blockchain signing."
    )
  }

  return normalizePrivateKey(value)
}

export function hasBlockchainSigningConfig(): boolean {
  return Boolean(
    (process.env.BACKEND_SIGNER_PRIVATE_KEY ||
      process.env.WIREFLUID_PRIVATE_KEY ||
      process.env.WIREFLUID_PRIVATE_KEYS) &&
      process.env.REWARD_PROOF_ADDRESS &&
      process.env.BRAND_COMMITMENT_ADDRESS
  )
}

async function getContracts(): Promise<ContractsBundle> {
  if (contractsCache) {
    return contractsCache
  }

  const rpcUrl = process.env.WIREFLUID_RPC_URL || "https://evm.wirefluid.com"
  const expectedChainId = parseChainId()
  const provider = new JsonRpcProvider(rpcUrl)
  const signer = new Wallet(getSignerPrivateKey(), provider)

  const network = await provider.getNetwork()
  if (Number(network.chainId) !== expectedChainId) {
    throw new Error(
      `RPC chain mismatch. Expected ${expectedChainId}, got ${network.chainId.toString()}.`
    )
  }

  contractsCache = {
    rewardProof: new Contract(requiredEnv("REWARD_PROOF_ADDRESS"), REWARD_PROOF_ABI, signer),
    rewardSbt: new Contract(requiredEnv("REWARD_SBT_ADDRESS"), REWARD_SBT_ABI, signer),
    brandCommitment: new Contract(
      requiredEnv("BRAND_COMMITMENT_ADDRESS"),
      BRAND_COMMITMENT_ABI,
      signer
    ),
  }

  return contractsCache
}

export function buildRewardProofHash(
  userId: string,
  matchId: string,
  rewardType: string,
  timestamp: number
): string {
  return ethers.keccak256(
    ethers.solidityPacked(["string", "string", "string", "uint256"], [userId, matchId, rewardType, timestamp])
  )
}

export function buildCampaignMetadataHash(serializedMetadata: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(serializedMetadata))
}

export async function recordRewardWinOnChain(
  input: RecordRewardWinInput
): Promise<RecordRewardWinResult> {
  const contracts = await getContracts()
  const timestamp = input.timestamp ?? Math.floor(Date.now() / 1000)
  const proofHash = buildRewardProofHash(input.userId, input.matchId, input.rewardType, timestamp)

  const winId = await contracts.rewardProof.recordWin.staticCall(
    input.userId,
    input.matchId,
    input.rewardId,
    BigInt(input.credits),
    proofHash
  )

  const tx = await contracts.rewardProof.recordWin(
    input.userId,
    input.matchId,
    input.rewardId,
    BigInt(input.credits),
    proofHash
  )

  await tx.wait()

  return {
    txHash: tx.hash,
    winId: winId.toString(),
    proofHash,
    timestamp,
    contractAddress: contracts.rewardProof.target.toString(),
  }
}

export async function createCampaignCommitmentOnChain(
  input: CreateCampaignCommitmentInput
): Promise<CreateCampaignCommitmentResult> {
  const contracts = await getContracts()

  const campaignId = await contracts.brandCommitment.createCampaign.staticCall(
    input.brandId,
    BigInt(input.rewardCount),
    input.metadataHash
  )

  const tx = await contracts.brandCommitment.createCampaign(
    input.brandId,
    BigInt(input.rewardCount),
    input.metadataHash
  )

  await tx.wait()

  return {
    txHash: tx.hash,
    campaignId: campaignId.toString(),
    contractAddress: contracts.brandCommitment.target.toString(),
  }
}

export async function completeCampaignCommitmentOnChain(
  campaignId: string
): Promise<UpdateCampaignCommitmentResult> {
  const contracts = await getContracts()
  const tx = await contracts.brandCommitment.completeCampaign(BigInt(campaignId))
  await tx.wait()

  return {
    txHash: tx.hash,
    contractAddress: contracts.brandCommitment.target.toString(),
  }
}

export async function cancelCampaignCommitmentOnChain(
  campaignId: string
): Promise<UpdateCampaignCommitmentResult> {
  const contracts = await getContracts()
  const tx = await contracts.brandCommitment.cancelCampaign(BigInt(campaignId))
  await tx.wait()

  return {
    txHash: tx.hash,
    contractAddress: contracts.brandCommitment.target.toString(),
  }
}

export async function mintRewardNftOnChain(
  input: MintRewardNftInput
): Promise<MintRewardNftResult> {
  const contracts = await getContracts()

  const tokenId = await contracts.rewardSbt.mintRewardNFT.staticCall(
    input.walletAddress,
    input.metadataURI
  )

  const tx = await contracts.rewardSbt.mintRewardNFT(input.walletAddress, input.metadataURI)
  await tx.wait()

  return {
    txHash: tx.hash,
    tokenId: tokenId.toString(),
    contractAddress: contracts.rewardSbt.target.toString(),
  }
}
