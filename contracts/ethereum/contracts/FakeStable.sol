// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract FakeStable is ERC20, AccessControl, Pausable {
    uint8 private _decimals;

    event NewAdminAdded(address indexed new_admin);
    event RemovedAdmin(address indexed removed_admin);
    
    constructor(address admin, uint256 initialSupply, uint8 __decimals) ERC20("fakeStable", "TSTBL") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _mint(admin, initialSupply);
        _decimals = __decimals;
    }

    function mint(address account, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _burn(account, amount);
    }

    function addAdmin(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(DEFAULT_ADMIN_ROLE, account);
        emit NewAdminAdded(account);
    } 

    function removeAdmin(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
    	_revokeRole(DEFAULT_ADMIN_ROLE, account);
        emit RemovedAdmin(account);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused() {
        _pause();
    }
    
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) whenPaused() {
        _unpause();
    }
    
    function decimals() public view override returns(uint8){
        return _decimals;
    }
}
