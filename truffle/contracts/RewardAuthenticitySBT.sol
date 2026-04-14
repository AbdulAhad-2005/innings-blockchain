// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract RewardAuthenticitySBT is ERC721URIStorage, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    error Unauthorized(address caller);
    error ZeroAddress();
    error InvalidMetadataURI();
    error Soulbound();

    uint256 private _nextTokenId = 1;
    mapping(uint256 => uint256) public mintedAt;

    event RewardNFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string metadataURI,
        uint256 timestamp,
        address indexed mintedBy
    );

    constructor(address admin, address minter)
        ERC721("Innings Reward Authenticity", "WIRE-REWARD")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, minter == address(0) ? admin : minter);
    }

    modifier onlyMinter() {
        if (!hasRole(MINTER_ROLE, msg.sender)) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    function mintRewardNFT(address to, string calldata metadataURI)
        external
        onlyMinter
        returns (uint256 tokenId)
    {
        if (to == address(0)) {
            revert ZeroAddress();
        }
        if (bytes(metadataURI).length == 0) {
            revert InvalidMetadataURI();
        }

        tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
        mintedAt[tokenId] = block.timestamp;

        emit RewardNFTMinted(tokenId, to, metadataURI, block.timestamp, msg.sender);
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
