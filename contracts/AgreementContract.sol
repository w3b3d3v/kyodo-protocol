// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "hardhat/console.sol";

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function decimals() external view returns (uint8);
}

contract AgreementContract {
    enum AgreementStatus { Active, Completed }

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
        uint256 totalPaid;
    }

    uint256 public nextAgreementId = 1;
    Agreement[] public agreements;
    mapping(address => uint256[]) public userAgreements; // Mapping from user address to agreement IDs
    mapping(address => bool) public acceptedPaymentTokens; // Mapping of accepted payment tokens

    Token public tokenIncentive; // Fixed tokenIncentive
    address public owner;
    address public kyodoTreasury;
    address public communityDAO;

    uint256 public feePercentage; // Fee percentage in basis points (1 basis point = 0.01%)
    uint256 public kyodoTreasuryFee;
    uint256 public communityDAOFee;

    constructor(address _kyodoTreasury, address _communityDAO) {
        owner = msg.sender;
        kyodoTreasury = _kyodoTreasury;
        communityDAO = _communityDAO;
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
            status: AgreementStatus.Active,
            company: msg.sender,
            developer: _developer,
            skills: _skills,
            tokenIncentive: tokenIncentive, // Use fixed tokenIncentive
            payment: paymentToken,
            totalPaid: 0
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

    function makePayment(uint256 _agreementId, uint256 _amountToPay) external {
        require(_agreementId > 0 && _agreementId <= agreements.length, "Invalid agreement ID");
        Agreement storage agreement = agreements[_agreementId - 1];

        uint256 totalFeeBasisPoints;
        uint256 totalFee;
        uint256 kyodoTreasuryShare;
        uint256 communityDAOShare;
        uint256 developerPayment;

        require(agreement.status == AgreementStatus.Active, "Agreement is not active");

        Token storage paymentToken = agreement.payment;
        IERC20 token = IERC20(paymentToken.tokenAddress);

        uint256 remainingAmount = paymentToken.amount - agreement.totalPaid;
        require(_amountToPay > 0 && _amountToPay <= remainingAmount, "Invalid payment amount");

        unchecked {
            totalFeeBasisPoints = feePercentage * 1000;
            totalFee = (totalFeeBasisPoints * _amountToPay) / (10**6);
            kyodoTreasuryShare = (totalFee * kyodoTreasuryFee) / 1000;
            communityDAOShare = totalFee - kyodoTreasuryShare;
            developerPayment = _amountToPay - totalFee;
        }

        require(
            token.transferFrom(msg.sender, address(this), _amountToPay),
            "User must approve the amount of the agreement"
        );

        token.transfer(kyodoTreasury, kyodoTreasuryShare);
        token.transfer(communityDAO, communityDAOShare);
        token.transfer(agreement.developer, developerPayment);

        agreement.totalPaid += _amountToPay;

        if (agreement.totalPaid >= paymentToken.amount) {
            agreement.status = AgreementStatus.Completed;
        }
    }

    function setFees(uint256 _feePercentage, uint256 _kyodoTreasuryFee, uint256 _communityDAOFee) external onlyOwner {
        require(_feePercentage >= 0 && _feePercentage <= 10000, "Invalid fee percentage");

        feePercentage = _feePercentage;
        kyodoTreasuryFee = _kyodoTreasuryFee;
        communityDAOFee = _communityDAOFee;
    }
}
