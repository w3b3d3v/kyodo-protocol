// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./interfaces/IStableVault.sol";
import "./interfaces/IAgreementContract.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "./Admin.sol";

contract AgreementContract is Admin, IAgreementContract {

    uint256 public nextAgreementId = 1;
    Agreement[] public agreements;
    mapping(address => uint256[]) public contractorAgreements; // Mapping from user address to agreement IDs
    mapping(address => uint256[]) professionalAgreements;
    mapping(address => bool) public acceptedPaymentTokens; // Mapping of accepted payment tokens
    mapping(uint => Skill[]) public agreementSkills;
    address[] public tokenAddresses;

    IStableVault public StableVault;
    address public kyodoTreasury;
    address public communityDAO;

    uint256 public feePercentage; // Fee percentage in basis points (1 basis point = 0.01%)
    uint256 public kyodoTreasuryFee;
    uint256 public communityDAOFee;

    constructor(address _kyodoTreasury, address _communityDAO, address admin) Admin(admin) {
        kyodoTreasury = _kyodoTreasury;
        communityDAO = _communityDAO;
    }

    function addAcceptedPaymentToken(address _tokenAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        acceptedPaymentTokens[_tokenAddress] = true;
        tokenAddresses.push(_tokenAddress);
    }

    function removePaymentToken(address token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        acceptedPaymentTokens[token] = false;
    }

    function getAcceptedPaymentTokens() public view returns (address) {
        return tokenAddresses[0];
    }

    function createAgreement(
        string memory _title,
        string memory _description,
        address _professional,
        Skill[] memory _skills,
        uint256 _paymentAmount
    ) external override {
        require(_professional != address(0), "Professional address cannot be zero");
        require(_skills.length > 0, "Skills must not be empty");
        require(_paymentAmount > 0, "Payment amount must be greater than zero");
        require(_professional != msg.sender, "Professional address cannot be the same as company");

        Agreement memory newAgreement = Agreement({
            id: nextAgreementId,
            title: _title,
            description: _description,
            status: AgreementStatus.Active,
            company: msg.sender,
            professional: _professional,
            paymentAmount: _paymentAmount,
            totalPaid: 0
        });

        for (uint256 i = 0; i < _skills.length; i++) {
            agreementSkills[nextAgreementId].push(Skill({
                name: _skills[i].name,
                level: _skills[i].level
            }));
        }

        agreements.push(newAgreement);
        contractorAgreements[msg.sender].push(nextAgreementId);
        professionalAgreements[_professional].push(nextAgreementId);
        emit AgreementCreated(msg.sender, _professional, nextAgreementId, _paymentAmount);
        nextAgreementId++;
    }

    function getAgreementCount() external override view returns (uint256) {
        return agreements.length;
    }

    function getAllAgreements() external override view returns (Agreement[] memory) {
        return agreements;
    }

    function getContractorAgreementIds(address _contractor) external override view returns (uint256[] memory) {
        return contractorAgreements[_contractor];
    }

    function getProfessionalAgreementIds(address _professional) external override view returns (uint256[] memory) {
        return professionalAgreements[_professional];
    }

    function getAgreementById(uint256 _id) external override view returns (Agreement memory) {
        require(_id > 0 && _id <= agreements.length, "Invalid agreement ID");
        return agreements[_id - 1];
    }

    function getSkillsByAgreementId(uint256 _agreementId) external override view returns (Skill[] memory) {
        return agreementSkills[_agreementId];
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
        
        token.approve(address(StableVault), _amountToPay);
        StableVault.deposit(professionalPayment, address(token), agreement.professional);
        StableVault.deposit(kyodoTreasuryShare, address(token), kyodoTreasury);
        StableVault.deposit(communityDAOShare, address(token), communityDAO);

        unchecked {
            agreement.totalPaid += _amountToPay;
        }
        
        emit PaymentMade(msg.sender, agreement.professional, _agreementId, _amountToPay);
    }

    function setFees(uint256 _feePercentage, uint256 _kyodoTreasuryFee, uint256 _communityDAOFee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_feePercentage >= 0 && _feePercentage <= 1000, "Invalid fee percentage");

        feePercentage = _feePercentage;
        kyodoTreasuryFee = _kyodoTreasuryFee;
        communityDAOFee = _communityDAOFee;
    }

    function setStableVaultAddress(address _StableVaultAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        StableVault = IStableVault(_StableVaultAddress);
    }
}