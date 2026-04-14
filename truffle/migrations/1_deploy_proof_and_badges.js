const RewardProof = artifacts.require("RewardProof");
const RewardAuthenticitySBT = artifacts.require("RewardAuthenticitySBT");
const BrandCommitmentProof = artifacts.require("BrandCommitmentProof");
const BrandVerificationBadge = artifacts.require("BrandVerificationBadge");

module.exports = async function (deployer, network, accounts) {
  const fallbackAccount = accounts && accounts.length > 0 ? accounts[0] : undefined;
  const admin = process.env.CONTRACT_ADMIN_ADDRESS || fallbackAccount;

  if (!admin) {
    throw new Error(
      "No deployer account detected. Set CONTRACT_ADMIN_ADDRESS or provide signer account through the selected network."
    );
  }

  const rewardRecorder = process.env.REWARD_PROOF_RECORDER || admin;
  const rewardMinter = process.env.REWARD_NFT_MINTER || admin;
  const campaignManager = process.env.CAMPAIGN_MANAGER || admin;
  const brandVerifier = process.env.BRAND_VERIFIER || admin;

  await deployer.deploy(RewardProof, admin, rewardRecorder);
  await deployer.deploy(RewardAuthenticitySBT, admin, rewardMinter);
  await deployer.deploy(BrandCommitmentProof, admin, campaignManager);
  await deployer.deploy(BrandVerificationBadge, admin, brandVerifier);

  console.log("Deployment summary");
  console.log("Network:", network);
  console.log("RewardProof:", RewardProof.address);
  console.log("RewardAuthenticitySBT:", RewardAuthenticitySBT.address);
  console.log("BrandCommitmentProof:", BrandCommitmentProof.address);
  console.log("BrandVerificationBadge:", BrandVerificationBadge.address);
};
