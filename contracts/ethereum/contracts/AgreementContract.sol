// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "hardhat/console.sol";

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function decimals() external view returns (uint8);
}

interface IStableVault {
    function deposit(uint256 amount, address _asset, address _beneficiary) external;
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
        address professional;
        string[] skills;
        Token tokenIncentive;
        Token payment;
        uint256 totalPaid;
    }

    uint256 public nextAgreementId = 1;
    Agreement[] public agreements;
    mapping(address => uint256[]) public userAgreements; // Mapping from user address to agreement IDs
    mapping(address => bool) public acceptedPaymentTokens; // Mapping of accepted payment tokens

    Token public tokenIncentive;
    IStableVault public StableVault;
    address public owner;
    address public kyodoTreasury;
    address public communityDAO;

    uint256 public feePercentage; // Fee percentage in basis points (1 basis point = 0.01%)
    uint256 public kyodoTreasuryFee;
    uint256 public communityDAOFee;

    event AgreementCreated(
        address indexed company,
        address indexed professional, 
        uint256 agreementId, 
        uint256 amount
    );
    
    event PaymentMade(
        address indexed company,
        address indexed professional, 
        uint256 agreementId, 
        uint256 amount
    );

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
        address _professional,
        string[] memory _skills,
        uint256 _paymentAmount
    ) external {
        require(_professional != address(0), "Professional address cannot be zero");
        require(_skills.length > 0, "Skills must not be empty");
        require(_paymentAmount > 0, "Payment amount must be greater than zero");
        require(_professional != msg.sender, "Professional address cannot be the same as company");

        Token memory paymentToken = Token({
            amount: _paymentAmount,
            tokenAddress: address(0)
        });

        Agreement memory newAgreement = Agreement({
            id: nextAgreementId,
            title: _title,
            description: _description,
            status: AgreementStatus.Active,
            company: msg.sender,
            professional: _professional,
            skills: _skills,
            tokenIncentive: tokenIncentive, // Use fixed tokenIncentive
            payment: paymentToken,
            totalPaid: 0
        });

        agreements.push(newAgreement);
        userAgreements[msg.sender].push(nextAgreementId);
        emit AgreementCreated(msg.sender, _professional, nextAgreementId, _paymentAmount);
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

    function makePayment(uint256 _agreementId, uint256 _amountToPay, address _paymentAddress) external {
        require(_agreementId > 0 && _agreementId <= agreements.length, "Invalid agreement ID");
        require(acceptedPaymentTokens[_paymentAddress], "Invalid payment token");
        Agreement storage agreement = agreements[_agreementId - 1];

        uint256 totalFeeBasisPoints;
        uint256 totalFee;
        uint256 kyodoTreasuryShare;
        uint256 communityDAOShare;
        uint256 professionalPayment;

        IERC20 token = IERC20(_paymentAddress);

        unchecked {
            totalFeeBasisPoints = feePercentage * 1000;
            totalFee = (totalFeeBasisPoints * _amountToPay) / (10**6);
            kyodoTreasuryShare = (totalFee * kyodoTreasuryFee) / 1000;
            communityDAOShare = totalFee - kyodoTreasuryShare;
            professionalPayment = _amountToPay - totalFee;
        }

        require(
            token.transferFrom(msg.sender, address(this), _amountToPay),
            "User must approve the amount of the agreement"
        );

        token.transfer(kyodoTreasury, kyodoTreasuryShare);
        token.transfer(communityDAO, communityDAOShare);
        
        token.approve(address(StableVault), professionalPayment);
        StableVault.deposit(professionalPayment, address(token), agreement.professional);

        unchecked {
            agreement.totalPaid += _amountToPay;
        }
        
        emit PaymentMade(msg.sender, agreement.professional, _agreementId, _amountToPay);
    }

    function setFees(uint256 _feePercentage, uint256 _kyodoTreasuryFee, uint256 _communityDAOFee) external onlyOwner {
        require(_feePercentage >= 0 && _feePercentage <= 1000, "Invalid fee percentage");

        feePercentage = _feePercentage;
        kyodoTreasuryFee = _kyodoTreasuryFee;
        communityDAOFee = _communityDAOFee;
    }

    function setStableVaultAddress(address _StableVaultAddress) external onlyOwner {
        StableVault = IStableVault(_StableVaultAddress);
    }
}