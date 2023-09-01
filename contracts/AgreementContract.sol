// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract AgreementContract {
    enum AgreementStatus { Pending, Active, Completed }

    struct Token {
        uint256 amount;
        address tokenAddress;
    }

    struct Agreement {
        uint256 id;
        string title;
        string description;
        AgreementStatus status;
        address company;
        address developer;
        string[] skills;
        Token tokenIncentive;
        Token payment;
    }

    uint256 public nextAgreementId = 1;
    Agreement[] public agreements;
    mapping(address => uint256[]) public userAgreements; // Mapping from user address to agreement IDs
    mapping(address => bool) public acceptedPaymentTokens; // Mapping of accepted payment tokens

    Token public tokenIncentive; // Fixed tokenIncentive
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function addAcceptedPaymentToken(address _tokenAddress) external onlyOwner {
        acceptedPaymentTokens[_tokenAddress] = true;
    }

    function createAgreement(
        string memory _title,
        string memory _description,
        address _developer,
        string[] memory _skills,
        uint256 _paymentAmount,
        address _paymentAddress
    ) external {
        require(_developer != address(0), "Developer address cannot be zero");
        require(_skills.length > 0, "Skills must not be empty");
        require(_paymentAmount > 0, "Payment amount must be greater than zero");
        require(acceptedPaymentTokens[_paymentAddress], "Invalid payment token");

        Token memory paymentToken = Token({
            amount: _paymentAmount,
            tokenAddress: _paymentAddress
        });

        Agreement memory newAgreement = Agreement({
            id: nextAgreementId,
            title: _title,
            description: _description,
            status: AgreementStatus.Pending,
            company: msg.sender,
            developer: _developer,
            skills: _skills,
            tokenIncentive: tokenIncentive, // Use fixed tokenIncentive
            payment: paymentToken
        });

        agreements.push(newAgreement);
        userAgreements[msg.sender].push(nextAgreementId);
        nextAgreementId++;
    }

    function getAgreementCount() external view returns (uint256) {
        return agreements.length;
    }

    function getAllAgreements() external view returns (Agreement[] memory) {
        return agreements;
    }

    function getUserAgreements(address _user) external view returns (uint256[] memory) {
        return userAgreements[_user];
    }

    function getAgreementById(uint256 _id) external view returns (Agreement memory) {
        require(_id > 0 && _id <= agreements.length, "Invalid agreement ID");
        return agreements[_id - 1];
    }

    function updateTokenIncentive(address _newTokenAddress, uint256 _newAmount) external onlyOwner {
        tokenIncentive = Token({
            amount: _newAmount,
            tokenAddress: _newTokenAddress
        });
    }
}
