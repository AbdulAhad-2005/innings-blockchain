module.exports = async function expectRevert(promise, expectedReason) {
  try {
    await promise;
    assert.fail("Expected transaction to revert, but it succeeded.");
  } catch (error) {
    const message = error && error.message ? error.message : "";

    assert(
      message.toLowerCase().includes("revert"),
      `Expected transaction to revert. Received: '${message}'`
    );

    if (expectedReason) {
      const matched =
        message.includes(expectedReason) ||
        message.includes("Custom error (could not decode)") ||
        /transaction: revert\b/i.test(message);

      assert(
        matched,
        `Expected revert including '${expectedReason}', received '${message}'`
      );
    }
  }
};
