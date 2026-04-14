// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract BrandCommitmentProof is AccessControl {
    bytes32 public constant CAMPAIGN_MANAGER_ROLE = keccak256("CAMPAIGN_MANAGER_ROLE");

    error Unauthorized(address caller);
    error InvalidString();
    error InvalidRewardCount();
    error CampaignNotFound(uint256 campaignId);
    error CampaignAlreadyFinalized(uint256 campaignId);

    enum CampaignStatus {
        Active,
        Completed,
        Cancelled
    }

    struct Campaign {
        string brandId;
        uint256 rewardCount;
        bytes32 metadataHash;
        uint256 createdAt;
        address createdBy;
        CampaignStatus status;
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;

    event CampaignCreated(
        uint256 indexed campaignId,
        string brandId,
        uint256 rewardCount,
        bytes32 indexed metadataHash,
        uint256 timestamp,
        address indexed createdBy
    );
    event CampaignCompleted(uint256 indexed campaignId, uint256 timestamp, address indexed updatedBy);
    event CampaignCancelled(uint256 indexed campaignId, uint256 timestamp, address indexed updatedBy);

    constructor(address admin, address manager) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(CAMPAIGN_MANAGER_ROLE, manager == address(0) ? admin : manager);
    }

    modifier onlyCampaignManager() {
        if (!hasRole(CAMPAIGN_MANAGER_ROLE, msg.sender)) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    function createCampaign(
        string calldata brandId,
        uint256 rewardCount,
        bytes32 metadataHash
    ) external onlyCampaignManager returns (uint256 campaignId) {
        if (bytes(brandId).length == 0) {
            revert InvalidString();
        }
        if (rewardCount == 0) {
            revert InvalidRewardCount();
        }

        campaignId = ++campaignCount;

        campaigns[campaignId] = Campaign({
            brandId: brandId,
            rewardCount: rewardCount,
            metadataHash: metadataHash,
            createdAt: block.timestamp,
            createdBy: msg.sender,
            status: CampaignStatus.Active
        });

        emit CampaignCreated(campaignId, brandId, rewardCount, metadataHash, block.timestamp, msg.sender);
    }

    function completeCampaign(uint256 campaignId) external onlyCampaignManager {
        Campaign storage campaign = campaigns[campaignId];
        if (campaign.createdAt == 0) {
            revert CampaignNotFound(campaignId);
        }
        if (campaign.status != CampaignStatus.Active) {
            revert CampaignAlreadyFinalized(campaignId);
        }

        campaign.status = CampaignStatus.Completed;
        emit CampaignCompleted(campaignId, block.timestamp, msg.sender);
    }

    function cancelCampaign(uint256 campaignId) external onlyCampaignManager {
        Campaign storage campaign = campaigns[campaignId];
        if (campaign.createdAt == 0) {
            revert CampaignNotFound(campaignId);
        }
        if (campaign.status != CampaignStatus.Active) {
            revert CampaignAlreadyFinalized(campaignId);
        }

        campaign.status = CampaignStatus.Cancelled;
        emit CampaignCancelled(campaignId, block.timestamp, msg.sender);
    }
}
