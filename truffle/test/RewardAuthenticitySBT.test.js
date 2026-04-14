const RewardAuthenticitySBT = artifacts.require("RewardAuthenticitySBT");
const expectRevert = require("./helpers/expectRevert");

contract("RewardAuthenticitySBT", (accounts) => {
  const [admin, minter, holder, stranger] = accounts;
  let contractInstance;

  beforeEach(async () => {
    contractInstance = await RewardAuthenticitySBT.new(admin, minter, { from: admin });
  });

  it("mints a reward SBT with metadata", async () => {
    const metadataURI = "ipfs://reward-jersey-1";

    const tx = await contractInstance.mintRewardNFT(holder, metadataURI, { from: minter });
    const mintEvent = tx.logs.find((log) => log.event === "RewardNFTMinted");
    assert(mintEvent, "RewardNFTMinted event was not emitted");

    const tokenId = mintEvent.args.tokenId.toString();
    const owner = await contractInstance.ownerOf(tokenId);
    const uri = await contractInstance.tokenURI(tokenId);

    assert.equal(owner, holder);
    assert.equal(uri, metadataURI);
  });

  it("blocks non-minters from minting", async () => {
    await expectRevert(
      contractInstance.mintRewardNFT(holder, "ipfs://reward-bat-1", { from: stranger }),
      "Unauthorized"
    );
  });

  it("blocks transfers and approvals to enforce soulbound ownership", async () => {
    await contractInstance.mintRewardNFT(holder, "ipfs://reward-ticket-1", { from: minter });

    await expectRevert(
      contractInstance.transferFrom(holder, stranger, 1, { from: holder }),
      "Soulbound"
    );

    await expectRevert(contractInstance.approve(stranger, 1, { from: holder }), "Soulbound");

    await expectRevert(
      contractInstance.setApprovalForAll(stranger, true, { from: holder }),
      "Soulbound"
    );
  });
});
