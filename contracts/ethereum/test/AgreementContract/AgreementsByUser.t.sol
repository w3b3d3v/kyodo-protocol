// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

import {Test, console2} from "forge-std/Test.sol";
import {AgreementContract} from "../../src/AgreementContract.sol";
import "../../src/interfaces/IAgreementContract.sol";
import "forge-std/console.sol";

contract AgreementTest is Test, IAgreementContract {

    AgreementContract public agreementContract;
    address public owner;
    address public user1;
    address public user2;
    address public deployer;
    address public kyodoTreasure;
    address public communityTreasure;
    Skill[] public skills;
    
    function setUp() public {
        deployer = address(1);
        kyodoTreasure = address(2);
        communityTreasure = address(3);
        owner = address(4);
        user1 = address(5);
        user2 = address(6);
        agreementContract = new AgreementContract(kyodoTreasure, communityTreasure, deployer);
        skills.push(Skill("Programming", 50));
        skills.push(Skill("Design", 50));
    }

    function testShouldCreateAgreementsAndRetrieveUserSpecificAgreements() public {
        vm.prank(user1);
        agreementContract.createAgreement("Test Agreement 1", "This is a test agreement 1", user2, skills, 100);
        vm.prank(user2);
        agreementContract.createAgreement("Test Agreement 2", "This is a test agreement 2", user1, skills, 900);
        vm.prank(user1);
        uint256[] memory agreementIdsUser1 = agreementContract.getContractorAgreementIds(user1);
        require(agreementIdsUser1.length == 1, "No agreements found for the contractor");
        IAgreementContract.Agreement memory firstAgreementUser1 = agreementContract.getAgreementById(agreementIdsUser1[0]);
        vm.prank(user2);
        uint256[] memory agreementIdsUser2 = agreementContract.getContractorAgreementIds(user2);
        require(agreementIdsUser2.length == 1, "No agreements found for the contractor");
        IAgreementContract.Agreement memory firstAgreementUser2 = agreementContract.getAgreementById(agreementIdsUser2[0]);
        assertEq(firstAgreementUser1.professional, user2);
        assertEq(firstAgreementUser2.professional, user1);
    }

    function testShouldVerifySkillsAssociatedWithUser1Agreements() public {
        vm.prank(user2);
        agreementContract.createAgreement("Agreement 1", "Description 1", user1, skills, 100);
        uint256[] memory user1Agreements = agreementContract.getContractorAgreementIds(user2);
        IAgreementContract.Agreement memory firstAgreementUser1 = agreementContract.getAgreementById(user1Agreements[0]);
        Skill[] memory agreementSkills = agreementContract.getSkillsByAgreementId(firstAgreementUser1.id);
        for (uint256 i = 0; i < agreementSkills.length; i++) {
            require(keccak256(abi.encodePacked(agreementSkills[i].name)) == keccak256(abi.encodePacked(skills[i].name)), "Name mismatch");
            require(agreementSkills[i].level == skills[i].level, "Level mismatch");
        }
    }

    function testShouldNotCreateAgreementsWithTotalSkillLevelExceeding100() public {
        Skill[] memory wrongSkills = new Skill[](2);
        wrongSkills[0] = Skill("Programming", 60);
        wrongSkills[1] = Skill("Design", 50);
        vm.prank(user1);
        vm.expectRevert(bytes("Total skill level cannot exceed 100"));
        agreementContract.createAgreement("Agreement 1", "Description 1", user2, wrongSkills, 100);
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