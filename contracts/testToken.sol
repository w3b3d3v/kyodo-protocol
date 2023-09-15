// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract fakeStable is ERC20, AccessControl, Pausable {
    uint8 private _decimals;

    event NewAdminAdded(address indexed new_admin);
    event RemovedAdmin(address indexed removed_admin);
    
    constructor(uint256 initialSupply, uint8 decimals) ERC20("fakeStable", "TSTBL") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _mint(msg.sender, initialSupply);
        _decimals = decimals;
    }

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not an contract administrator");
        _;
    }

    function mint(address account, uint256 amount) external onlyAdmin() {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external onlyAdmin() {
        _burn(account, amount);
    }

    function addAdmin(address account) external onlyAdmin() {
        _setupRole(DEFAULT_ADMIN_ROLE, account);
        emit NewAdminAdded(account);
    } 

    function removeAdmin(address account) external onlyAdmin() {
    	_revokeRole(DEFAULT_ADMIN_ROLE, account);
        emit RemovedAdmin(account);
    }

    function pause() external onlyAdmin() whenNotPaused() {
        _pause();
    }
    
    function unpause() external onlyAdmin() whenPaused() {
        _unpause();
    }
    
    function decimals() public view override returns(uint8){
        return _decimals;
    }
}
