// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

import {Test, console2} from "forge-std/Test.sol";
import "forge-std/console.sol";
import {KyodoRegistry} from "../../src/KyodoRegistry.sol";

contract KyodoRegistryTest is Test {
    KyodoRegistry public kyodoRegistry;
    address public admin;
    address public newAdmin;
    address public notAdmin;
    address public kyodoTreasureContract;
    address public kyodoNewTreasureContract;
    address public communityTreasureContract;
    address public communityNewTreasureContract;

    function setUp() public {
        admin = address(1);
        newAdmin = address(2);
        notAdmin = address(3);
        kyodoTreasureContract = address(4);
        kyodoNewTreasureContract = address(5);
        communityTreasureContract = address(6);
        communityNewTreasureContract = address(7);
        kyodoRegistry = new KyodoRegistry(admin);
    }

    function testAddAdmin() public {
        vm.prank(admin);
        kyodoRegistry.addAdmin(newAdmin);
    }

    function testShouldRevertIfNotAdminTryToAddAdmin() public {
        vm.prank(notAdmin);
        vm.expectRevert();
        kyodoRegistry.addAdmin(newAdmin);
    }

    function testSaveNewRegistry() public {
        vm.startPrank(admin);
        kyodoRegistry.createRegistry("KYODO_TREASURY_CONTRACT_ADDRESS", kyodoTreasureContract, 1000);
        kyodoRegistry.createRegistry("COMMUNITY_TREASURY_CONTRACT_ADDRESS", communityTreasureContract, 1000);
        assertEq(kyodoRegistry.getRegistry("KYODO_TREASURY_CONTRACT_ADDRESS"), kyodoTreasureContract);
        assertEq(kyodoRegistry.getRegistry("COMMUNITY_TREASURY_CONTRACT_ADDRESS"), communityTreasureContract);
    }

    function testUpdateARegistry() public {
        vm.startPrank(admin);
        kyodoRegistry.createRegistry("KYODO_TREASURY_CONTRACT_ADDRESS", kyodoTreasureContract, 1000);
        kyodoRegistry.updateRegistry("KYODO_TREASURY_CONTRACT_ADDRESS", kyodoNewTreasureContract, 1001);
        assertEq(kyodoRegistry.getRegistry("KYODO_TREASURY_CONTRACT_ADDRESS"), kyodoNewTreasureContract);
    }

    function testGetRegistry() public {
        vm.startPrank(admin);
        kyodoRegistry.createRegistry("KYODO_TREASURY_CONTRACT_ADDRESS", kyodoTreasureContract, 1000);
        assertEq(kyodoRegistry.getRegistry("KYODO_TREASURY_CONTRACT_ADDRESS"), kyodoTreasureContract);
    }

    function testTryToGetRegistryButThrowError() public {
        vm.expectRevert();
        kyodoRegistry.getRegistry("REGISTRY_NOT_EXISTS");
    }

    function testNotAdminTryToAddOrUpdateRegistryButFail() public {
        vm.startPrank(notAdmin);
        vm.expectRevert();
        kyodoRegistry.createRegistry("KYODO_TREASURY_CONTRACT_ADDRESS", kyodoTreasureContract, 1000);
    }

    function testTryingToUpdateNotExistingRegistryButFail() public {
        vm.startPrank(admin);
        vm.expectRevert();
        kyodoRegistry.updateRegistry("KYODO_TREASURY_CONTRACT_ADDRESS", kyodoNewTreasureContract, 1001);
    }

    function testUpdatingARegistryDoesnotAffectAnother() public {
        vm.startPrank(admin);
        kyodoRegistry.createRegistry("KYODO_TREASURY_CONTRACT_ADDRESS", kyodoTreasureContract, 1000);
        kyodoRegistry.createRegistry("COMMUNITY_TREASURY_CONTRACT_ADDRESS", communityTreasureContract, 1000);
        assertEq(kyodoRegistry.getRegistry("KYODO_TREASURY_CONTRACT_ADDRESS"), kyodoTreasureContract);
        assertEq(kyodoRegistry.getRegistry("COMMUNITY_TREASURY_CONTRACT_ADDRESS"), communityTreasureContract);
        kyodoRegistry.updateRegistry("KYODO_TREASURY_CONTRACT_ADDRESS", kyodoNewTreasureContract, 1000);
        kyodoRegistry.updateRegistry("COMMUNITY_TREASURY_CONTRACT_ADDRESS", communityNewTreasureContract, 1000);
        assertEq(kyodoRegistry.getRegistry("KYODO_TREASURY_CONTRACT_ADDRESS"), kyodoNewTreasureContract);
        assertEq(kyodoRegistry.getRegistry("COMMUNITY_TREASURY_CONTRACT_ADDRESS"), communityNewTreasureContract);
    }

    function testShouldSaveANewRegistryWithTheDeploymentBlockNumber() public {
        vm.startPrank(admin);
        kyodoRegistry.createRegistry("KYODO_TREASURY_CONTRACT_ADDRESS", kyodoTreasureContract, 1000);
        assertEq(kyodoRegistry.getBlockDeployment("KYODO_TREASURY_CONTRACT_ADDRESS"), 1000);
    }

    function testShouldUpdateARegistryWithANewDeploymentBlockNumber() public {
        vm.startPrank(admin);
        kyodoRegistry.createRegistry("KYODO_TREASURY_CONTRACT_ADDRESS", kyodoTreasureContract, 1000);
        kyodoRegistry.updateRegistry("KYODO_TREASURY_CONTRACT_ADDRESS", kyodoTreasureContract, 9999);
        assertEq(kyodoRegistry.getBlockDeployment("KYODO_TREASURY_CONTRACT_ADDRESS"), 9999);
    }

    function testShouldNotAllowCreationOfARegistryWithTheSameKey() public {
        vm.startPrank(admin);
        kyodoRegistry.createRegistry("KYODO_TREASURY_CONTRACT_ADDRESS", kyodoTreasureContract, 1000);
        vm.expectRevert();
        kyodoRegistry.createRegistry("KYODO_TREASURY_CONTRACT_ADDRESS", kyodoTreasureContract, 1002);
    }
}
