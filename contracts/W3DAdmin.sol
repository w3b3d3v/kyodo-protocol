// SPDX-License-Identifier: MIT

pragma solidity 0.8.1;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract W3DAdmin is AccessControl, Pausable {
    bytes32 public constant CONTRACT_AUTH = keccak256("ContractCallPermisson");

    event NewAdminAdded(address indexed new_admin);
    event NewAuthorizedContractAdded(address indexed new_authorized_contract);

    event RemovedAdmin(address indexed removed_admin);
    event RemovedAuthorizedContract(address indexed removed_authorized_contract);

    constructor(address admin) {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
    }

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not an Admin");
        _;
    }
    
    modifier onlyAuthorizedContract(){
        require(hasRole(CONTRACT_AUTH, msg.sender), "Contract caller aren't authorized to make calls");
        _;
    } 

    function addAdmin(address account) external onlyAdmin() whenNotPaused() {
        _setupRole(DEFAULT_ADMIN_ROLE, account);
        emit NewAdminAdded(account);
    } 

    function removeAdmin(address account) external onlyAdmin() whenNotPaused() {
    	_revokeRole(DEFAULT_ADMIN_ROLE, account);
        emit RemovedAdmin(account);
    }

    function pause() external onlyAdmin() whenNotPaused() {
        _pause();
    }
    
    function unpause() external onlyAdmin() whenPaused() {
        _unpause();
    }

    function addAuthorizedContract(address _contract) external onlyAdmin() whenNotPaused() {
        _grantRole(CONTRACT_AUTH, _contract);
        emit NewAuthorizedContractAdded(_contract);
    }

    function removeAuthorizedContract(address _contract) external onlyAdmin() whenNotPaused() {
        _revokeRole(CONTRACT_AUTH, _contract);
        emit RemovedAuthorizedContract(_contract);
    }
}