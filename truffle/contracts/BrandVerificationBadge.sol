// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract BrandVerificationBadge is ERC721URIStorage, AccessControl {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    error Unauthorized(address caller);
    error ZeroAddress();
    error InvalidString();
    error AlreadyVerified(address brandWallet);
    error BadgeAlreadyRevoked(uint256 tokenId);
    error Soulbound();

    struct Badge {
        string brandId;
        uint256 issuedAt;
        address issuedBy;
        bool revoked;
        uint256 revokedAt;
        address revokedBy;
    }

    uint256 private _nextTokenId = 1;
    mapping(uint256 => Badge) public badges;
    mapping(address => uint256) public activeBadgeByBrand;

    event VerificationBadgeIssued(
        uint256 indexed tokenId,
        address indexed brandWallet,
        string brandId,
        string metadataURI,
        uint256 timestamp,
        address indexed issuedBy
    );

    event VerificationBadgeRevoked(
        uint256 indexed tokenId,
        address indexed brandWallet,
        uint256 timestamp,
        address indexed revokedBy
    );

    constructor(address admin, address verifier)
        ERC721("Innings Brand Verification Badge", "WIRE-BADGE")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(VERIFIER_ROLE, verifier == address(0) ? admin : verifier);
    }

    modifier onlyVerifier() {
        if (!hasRole(VERIFIER_ROLE, msg.sender)) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    function issueBadge(
        address brandWallet,
        string calldata brandId,
        string calldata metadataURI
    ) external onlyVerifier returns (uint256 tokenId) {
        if (brandWallet == address(0)) {
            revert ZeroAddress();
        }
        if (bytes(brandId).length == 0 || bytes(metadataURI).length == 0) {
            revert InvalidString();
        }
        if (activeBadgeByBrand[brandWallet] != 0) {
            revert AlreadyVerified(brandWallet);
        }

        tokenId = _nextTokenId++;

        _safeMint(brandWallet, tokenId);
        _setTokenURI(tokenId, metadataURI);

        badges[tokenId] = Badge({
            brandId: brandId,
            issuedAt: block.timestamp,
            issuedBy: msg.sender,
            revoked: false,
            revokedAt: 0,
            revokedBy: address(0)
        });

        activeBadgeByBrand[brandWallet] = tokenId;

        emit VerificationBadgeIssued(
            tokenId,
            brandWallet,
            brandId,
            metadataURI,
            block.timestamp,
            msg.sender
        );
    }

    function revokeBadge(uint256 tokenId) external onlyVerifier {
        address brandWallet = ownerOf(tokenId);
        Badge storage badge = badges[tokenId];

        if (badge.revoked) {
            revert BadgeAlreadyRevoked(tokenId);
        }

        badge.revoked = true;
        badge.revokedAt = block.timestamp;
        badge.revokedBy = msg.sender;

        if (activeBadgeByBrand[brandWallet] == tokenId) {
            activeBadgeByBrand[brandWallet] = 0;
        }

        emit VerificationBadgeRevoked(tokenId, brandWallet, block.timestamp, msg.sender);
    }

    function isVerified(address brandWallet) external view returns (bool) {
        uint256 tokenId = activeBadgeByBrand[brandWallet];
        return tokenId != 0 && !badges[tokenId].revoked;
    }

    function approve(address, uint256) public pure override(ERC721, IERC721) {
        revert Soulbound();
    }

    function setApprovalForAll(address, bool) public pure override(ERC721, IERC721) {
        revert Soulbound();
    }

    function transferFrom(address, address, uint256) public pure override(ERC721, IERC721) {
        revert Soulbound();
    }

    function safeTransferFrom(address, address, uint256) public pure override(ERC721, IERC721) {
        revert Soulbound();
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override(ERC721, IERC721) {
        revert Soulbound();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
