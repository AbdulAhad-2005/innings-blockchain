const RewardProof = artifacts.require("RewardProof");
const expectRevert = require("./helpers/expectRevert");

contract("RewardProof", (accounts) => {
  const [admin, recorder, stranger] = accounts;
  let contractInstance;

  beforeEach(async () => {
    contractInstance = await RewardProof.new(admin, recorder, { from: admin });
  });

  it("records a win and stores immutable proof", async () => {
    const hash = web3.utils.soliditySha3("customer-1", "match-11", "jersey", "1713050000");

    const tx = await contractInstance.recordWin(
      "customer-1",
      "match-11",
      "reward-100",
      200,
      hash,
      { from: recorder }
    );

    assert.equal(tx.logs[0].event, "WinRecorded");

    const record = await contractInstance.winRecords(1);
    assert.equal(record.userId, "customer-1");
    assert.equal(record.matchId, "match-11");
    assert.equal(record.rewardId, "reward-100");
    assert.equal(record.credits.toString(), "200");
    assert.equal(record.proofHash, hash);

    const exists = await contractInstance.proofExists(hash);
    assert.equal(exists, true);
  });

  it("blocks duplicate proof hashes", async () => {
    const hash = web3.utils.soliditySha3("customer-2", "match-12", "bat", "1713050001");

    await contractInstance.recordWin("customer-2", "match-12", "reward-101", 50, hash, {
      from: recorder,
    });

    await expectRevert(
      contractInstance.recordWin("customer-2", "match-12", "reward-101", 50, hash, {
        from: recorder,
      }),
      "ProofAlreadyExists"
    );
  });

  it("allows only recorder role to write proofs", async () => {
    const hash = web3.utils.soliditySha3("customer-3", "match-13", "tickets", "1713050002");

    await expectRevert(
      contractInstance.recordWin("customer-3", "match-13", "reward-102", 90, hash, {
        from: stranger,
      }),
      "Unauthorized"
    );
  });
});
