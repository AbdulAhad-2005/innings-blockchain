// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract RewardProof is AccessControl {
    bytes32 public constant RECORDER_ROLE = keccak256("RECORDER_ROLE");

    error Unauthorized(address caller);
    error InvalidString();
    error InvalidCredits();
    error InvalidProofHash();
    error ProofAlreadyExists(bytes32 proofHash);

    struct WinRecord {
        string userId;
        string matchId;
        string rewardId;
        uint256 credits;
        bytes32 proofHash;
        uint256 timestamp;
        address recordedBy;
    }

    uint256 public winCount;
    mapping(uint256 => WinRecord) public winRecords;
    mapping(bytes32 => bool) public proofExists;

    event WinRecorded(
        uint256 indexed winId,
        bytes32 indexed proofHash,
        string userId,
        string matchId,
        string rewardId,
        uint256 credits,
        uint256 timestamp,
        address indexed recordedBy
    );

    constructor(address admin, address recorder) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(RECORDER_ROLE, recorder == address(0) ? admin : recorder);
    }

    modifier onlyRecorder() {
        if (!hasRole(RECORDER_ROLE, msg.sender)) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    function recordWin(
        string calldata userId,
        string calldata matchId,
        string calldata rewardId,
        uint256 credits,
        bytes32 hash
    ) external onlyRecorder returns (uint256 winId) {
        if (bytes(userId).length == 0 || bytes(matchId).length == 0 || bytes(rewardId).length == 0) {
            revert InvalidString();
        }
        if (credits == 0) {
            revert InvalidCredits();
        }
        if (hash == bytes32(0)) {
            revert InvalidProofHash();
        }
        if (proofExists[hash]) {
            revert ProofAlreadyExists(hash);
        }

        winId = ++winCount;

        winRecords[winId] = WinRecord({
            userId: userId,
            matchId: matchId,
            rewardId: rewardId,
            credits: credits,
            proofHash: hash,
            timestamp: block.timestamp,
            recordedBy: msg.sender
        });

        proofExists[hash] = true;

        emit WinRecorded(
            winId,
            hash,
            userId,
            matchId,
            rewardId,
            credits,
            block.timestamp,
            msg.sender
        );
    }

    function computeProofHash(
        string calldata userId,
        string calldata matchId,
        string calldata rewardType,
        uint256 timestamp
    ) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(userId, matchId, rewardType, timestamp));
    }
}
