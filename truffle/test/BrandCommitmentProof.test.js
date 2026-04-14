const BrandCommitmentProof = artifacts.require("BrandCommitmentProof");
const expectRevert = require("./helpers/expectRevert");

contract("BrandCommitmentProof", (accounts) => {
  const [admin, manager, stranger] = accounts;
  let contractInstance;

  beforeEach(async () => {
    contractInstance = await BrandCommitmentProof.new(admin, manager, { from: admin });
  });

  it("creates an on-chain campaign commitment", async () => {
    const metadataHash = web3.utils.soliditySha3("brand-7", "jersey", "100");

    const tx = await contractInstance.createCampaign("brand-7", 100, metadataHash, {
      from: manager,
    });

    assert.equal(tx.logs[0].event, "CampaignCreated");

    const campaign = await contractInstance.campaigns(1);
    assert.equal(campaign.brandId, "brand-7");
    assert.equal(campaign.rewardCount.toString(), "100");
    assert.equal(campaign.metadataHash, metadataHash);
    assert.equal(campaign.status.toString(), "0");
  });

  it("blocks campaign creation from unauthorized accounts", async () => {
    await expectRevert(
      contractInstance.createCampaign("brand-8", 50, web3.utils.soliditySha3("brand-8", "50"), {
        from: stranger,
      }),
      "Unauthorized"
    );
  });

  it("allows manager to finalize campaign only once", async () => {
    const metadataHash = web3.utils.soliditySha3("brand-9", "bat", "25");

    await contractInstance.createCampaign("brand-9", 25, metadataHash, { from: manager });
    await contractInstance.completeCampaign(1, { from: manager });

    const campaign = await contractInstance.campaigns(1);
    assert.equal(campaign.status.toString(), "1");

    await expectRevert(contractInstance.cancelCampaign(1, { from: manager }), "CampaignAlreadyFinalized");
  });
});
