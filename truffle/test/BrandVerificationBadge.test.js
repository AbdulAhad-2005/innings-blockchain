const BrandVerificationBadge = artifacts.require("BrandVerificationBadge");
const expectRevert = require("./helpers/expectRevert");

contract("BrandVerificationBadge", (accounts) => {
  const [admin, verifier, brandWallet, anotherBrand, stranger] = accounts;
  let contractInstance;

  beforeEach(async () => {
    contractInstance = await BrandVerificationBadge.new(admin, verifier, { from: admin });
  });

  it("issues a verification badge and marks brand as verified", async () => {
    const metadataURI = "ipfs://verified-brand-1";

    const tx = await contractInstance.issueBadge(brandWallet, "brand-1", metadataURI, {
      from: verifier,
    });

    const issueEvent = tx.logs.find((log) => log.event === "VerificationBadgeIssued");
    assert(issueEvent, "VerificationBadgeIssued event was not emitted");

    const tokenId = issueEvent.args.tokenId.toString();
    const owner = await contractInstance.ownerOf(tokenId);
    const isVerified = await contractInstance.isVerified(brandWallet);
    const uri = await contractInstance.tokenURI(tokenId);

    assert.equal(owner, brandWallet);
    assert.equal(uri, metadataURI);
    assert.equal(isVerified, true);
  });

  it("prevents more than one active badge per brand", async () => {
    await contractInstance.issueBadge(brandWallet, "brand-2", "ipfs://verified-brand-2", {
      from: verifier,
    });

    await expectRevert(
      contractInstance.issueBadge(brandWallet, "brand-2", "ipfs://verified-brand-2b", {
        from: verifier,
      }),
      "AlreadyVerified"
    );

    const canIssueDifferentBrand = await contractInstance.issueBadge(
      anotherBrand,
      "brand-3",
      "ipfs://verified-brand-3",
      { from: verifier }
    );
    const secondIssueEvent = canIssueDifferentBrand.logs.find(
      (log) => log.event === "VerificationBadgeIssued"
    );
    assert(secondIssueEvent, "VerificationBadgeIssued event was not emitted");
  });

  it("allows verifier to revoke badge and remove active verification", async () => {
    const issueTx = await contractInstance.issueBadge(brandWallet, "brand-4", "ipfs://verified-brand-4", {
      from: verifier,
    });

    const issueEvent = issueTx.logs.find((log) => log.event === "VerificationBadgeIssued");
    assert(issueEvent, "VerificationBadgeIssued event was not emitted");
    const tokenId = issueEvent.args.tokenId.toString();

    const revokeTx = await contractInstance.revokeBadge(tokenId, { from: verifier });
    assert.equal(revokeTx.logs[0].event, "VerificationBadgeRevoked");

    const badge = await contractInstance.badges(tokenId);
    const isVerified = await contractInstance.isVerified(brandWallet);

    assert.equal(badge.revoked, true);
    assert.equal(isVerified, false);

    await expectRevert(contractInstance.revokeBadge(tokenId, { from: verifier }), "BadgeAlreadyRevoked");
  });

  it("enforces verifier role and soulbound behavior", async () => {
    await expectRevert(
      contractInstance.issueBadge(brandWallet, "brand-5", "ipfs://verified-brand-5", {
        from: stranger,
      }),
      "Unauthorized"
    );

    await contractInstance.issueBadge(brandWallet, "brand-5", "ipfs://verified-brand-5", {
      from: verifier,
    });

    await expectRevert(
      contractInstance.transferFrom(brandWallet, stranger, 1, { from: brandWallet }),
      "Soulbound"
    );
  });
});
