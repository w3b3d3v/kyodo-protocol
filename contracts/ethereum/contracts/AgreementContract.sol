// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./interfaces/IAgreementContract.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "./Admin.sol";

import "hardhat/console.sol";

contract AgreementContract is Admin, IAgreementContract {

    uint256 public nextAgreementId = 1;
    Agreement[] public agreements;
    mapping(address => uint256[]) public contractorAgreements; // Mapping from user address to agreement IDs
    mapping(address => uint256[]) professionalAgreements;
    mapping(address => bool) public acceptedPaymentTokens; // Mapping of accepted payment tokens
    mapping(uint => Skill[]) public agreementSkills;
    address[] public tokenAddresses;

    address public kyodoTreasury;

    uint256 public feePercentage; // Fee percentage in basis points (1 basis point = 0.01%)
    uint256 public kyodoProtocolFee;

    constructor(address _kyodoTreasury, uint _kyodoProtocolFee, address admin) Admin(admin) {
        kyodoTreasury = _kyodoTreasury;
        kyodoProtocolFee = _kyodoProtocolFee;
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
      
        uint256 totalSkillLevel = 0;
        for (uint256 i = 0; i < _skills.length; i++) {
            totalSkillLevel += _skills[i].level;
        }

        require(totalSkillLevel <= 100, "Total skill level cannot exceed 100");

        Agreement memory newAgreement = Agreement({
            id: nextAgreementId,
            title: _title,
            description: _description,
            status: AgreementStatus.Active,
            company: msg.sender,
            professional: _professional,
            paymentAmount: _paymentAmount,
            totalPaid: 0,
            fee: getFee()
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

        uint256 kyodoTreasuryShare;
        uint256 totalAmountIncludingFee;

        IERC20 token = IERC20(_paymentAddress);

        unchecked {
            kyodoTreasuryShare = (_amountToPay * getFee()) / 1000;
            totalAmountIncludingFee = _amountToPay + kyodoTreasuryShare;
        }

        uint allowance_ = token.allowance(msg.sender, address(this));
        require(
            allowance_ >= totalAmountIncludingFee,
            "User must approve the amount of the agreement"
        );
        
        token.transferFrom(msg.sender, address(this), totalAmountIncludingFee);
        token.transfer(agreement.professional, _amountToPay);
        token.transfer(kyodoTreasury, kyodoTreasuryShare);

        unchecked {
            agreement.totalPaid += _amountToPay;
        }
        
        emit PaymentMade(msg.sender, agreement.professional, _agreementId, _amountToPay);
    }

    function updateFee(uint256 _kyodoProtocolFee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_kyodoProtocolFee >= 0 && _kyodoProtocolFee <= 1000, "Invalid kyodo treasury fee");
        kyodoProtocolFee = _kyodoProtocolFee;
    }

    function getFee() public view returns(uint256) {
        return kyodoProtocolFee;
    }
}