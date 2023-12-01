// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

import {Test, console2} from "forge-std/Test.sol";
import {AgreementContract} from "../../src/AgreementContract.sol";
import "../../src/interfaces/IAgreementContract.sol";

contract AgreementTest is Test, IAgreementContract {

    AgreementContract public agreementContract;
    address public deployer;
    address public kyodoTreasure;
    address public communityTreasure;
    address public developer;
    address public addr1;
    Skill[] public skills;
    
    function setUp() public {
        deployer = address(1);
        kyodoTreasure = address(2);
        communityTreasure = address(3);
        developer = address(4);
        addr1 = address(5);
        agreementContract = new AgreementContract(kyodoTreasure, communityTreasure, deployer);
        skills.push(Skill("Programming", 50));
        skills.push(Skill("Design", 50));
    }

    function testShouldCreateANewAgreementWithAuthorizedTokens() public {
        vm.prank(developer);
        agreementContract.createAgreement("Test Agreement", "This is a test agreement", addr1, skills, 100);
    }

    function testShouldFailIfTheProfessionalIsTheSameAsCompany() public {
        vm.expectRevert(bytes("Professional address cannot be the same as company"));
        vm.prank(developer);
        agreementContract.createAgreement("Test Agreement", "This is a test agreement", developer, skills, 100);
    }

    // precisei recriar estas funções pois estou herdando a IAgreementContract
    // precisei herdar para poder utilizar as Structs
    function setFees(uint256 _feePercentage, uint256 _kyodoTreasuryFee, uint256 _communityDAOFee) external {
        
    }

    function setStableVaultAddress(address _StableVaultAddress) external {

    }

    function getSkillsByAgreementId(uint256 _agreementId) external view returns (Skill[] memory){

    }

    function getProfessionalAgreementIds(address _professional) external view returns (uint256[] memory){

    }

    function getContractorAgreementIds(address _contractor) external view returns (uint256[] memory){

    }

    function getAllAgreements() external view returns (Agreement[] memory){

    }

    function getAgreementCount() external view returns (uint256){

    }

    function getAgreementById(uint256 _id) external view returns (Agreement memory){

    }

    function addAcceptedPaymentToken(address _tokenAddress) external{

    }

    function makePayment(uint256 _agreementId, uint256 _amountToPay, address _paymentAddress) external{
    }
        function createAgreement(
        string memory _title,
        string memory _description,
        address _professional,
        Skill[] memory _skills,
        uint256 _paymentAmount
    ) external {

    }
}