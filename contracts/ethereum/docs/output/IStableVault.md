[Admin]: ../Admin.md#Admin
[Admin-CHANGE_PARAMETERS-bytes32]: ../Admin.md#Admin-CHANGE_PARAMETERS-bytes32
[Admin-constructor-address-]: ../Admin.md#Admin-constructor-address-
[Admin-addAdmin-address-]: ../Admin.md#Admin-addAdmin-address-
[Admin-removeAdmin-address-]: ../Admin.md#Admin-removeAdmin-address-
[Admin-pause--]: ../Admin.md#Admin-pause--
[Admin-unpause--]: ../Admin.md#Admin-unpause--
[Admin-addProfile-address-]: ../Admin.md#Admin-addProfile-address-
[Admin-NewAdminAdded-address-]: ../Admin.md#Admin-NewAdminAdded-address-
[Admin-RemovedAdmin-address-]: ../Admin.md#Admin-RemovedAdmin-address-
[Admin-NewProfileAdded-address-]: ../Admin.md#Admin-NewProfileAdded-address-
[AgreementContract]: ../AgreementContract.md#AgreementContract
[AgreementContract-nextAgreementId-uint256]: ../AgreementContract.md#AgreementContract-nextAgreementId-uint256
[AgreementContract-agreements-struct-IAgreementContract-Agreement--]: ../AgreementContract.md#AgreementContract-agreements-struct-IAgreementContract-Agreement--
[AgreementContract-contractorAgreements-mapping-address----uint256---]: ../AgreementContract.md#AgreementContract-contractorAgreements-mapping-address----uint256---
[AgreementContract-professionalAgreements-mapping-address----uint256---]: ../AgreementContract.md#AgreementContract-professionalAgreements-mapping-address----uint256---
[AgreementContract-acceptedPaymentTokens-mapping-address----bool-]: ../AgreementContract.md#AgreementContract-acceptedPaymentTokens-mapping-address----bool-
[AgreementContract-agreementSkills-mapping-uint256----struct-IAgreementContract-Skill---]: ../AgreementContract.md#AgreementContract-agreementSkills-mapping-uint256----struct-IAgreementContract-Skill---
[AgreementContract-tokenAddresses-address--]: ../AgreementContract.md#AgreementContract-tokenAddresses-address--
[AgreementContract-StableVault-contract-IStableVault]: ../AgreementContract.md#AgreementContract-StableVault-contract-IStableVault
[AgreementContract-kyodoTreasury-address]: ../AgreementContract.md#AgreementContract-kyodoTreasury-address
[AgreementContract-communityDAO-address]: ../AgreementContract.md#AgreementContract-communityDAO-address
[AgreementContract-feePercentage-uint256]: ../AgreementContract.md#AgreementContract-feePercentage-uint256
[AgreementContract-kyodoTreasuryFee-uint256]: ../AgreementContract.md#AgreementContract-kyodoTreasuryFee-uint256
[AgreementContract-communityDAOFee-uint256]: ../AgreementContract.md#AgreementContract-communityDAOFee-uint256
[AgreementContract-constructor-address-address-address-]: ../AgreementContract.md#AgreementContract-constructor-address-address-address-
[AgreementContract-addAcceptedPaymentToken-address-]: ../AgreementContract.md#AgreementContract-addAcceptedPaymentToken-address-
[AgreementContract-removePaymentToken-address-]: ../AgreementContract.md#AgreementContract-removePaymentToken-address-
[AgreementContract-getAcceptedPaymentTokens--]: ../AgreementContract.md#AgreementContract-getAcceptedPaymentTokens--
[AgreementContract-createAgreement-string-string-address-struct-IAgreementContract-Skill---uint256-]: ../AgreementContract.md#AgreementContract-createAgreement-string-string-address-struct-IAgreementContract-Skill---uint256-
[AgreementContract-getAgreementCount--]: ../AgreementContract.md#AgreementContract-getAgreementCount--
[AgreementContract-getAllAgreements--]: ../AgreementContract.md#AgreementContract-getAllAgreements--
[AgreementContract-getContractorAgreements-address-]: ../AgreementContract.md#AgreementContract-getContractorAgreements-address-
[AgreementContract-getProfessionalAgreements-address-]: ../AgreementContract.md#AgreementContract-getProfessionalAgreements-address-
[AgreementContract-getAgreementById-uint256-]: ../AgreementContract.md#AgreementContract-getAgreementById-uint256-
[AgreementContract-getSkillsByAgreementId-uint256-]: ../AgreementContract.md#AgreementContract-getSkillsByAgreementId-uint256-
[AgreementContract-makePayment-uint256-uint256-address-]: ../AgreementContract.md#AgreementContract-makePayment-uint256-uint256-address-
[AgreementContract-setFees-uint256-uint256-uint256-]: ../AgreementContract.md#AgreementContract-setFees-uint256-uint256-uint256-
[AgreementContract-setStableVaultAddress-address-]: ../AgreementContract.md#AgreementContract-setStableVaultAddress-address-
[KyodoRegistry]: ../KyodoRegistry.md#KyodoRegistry
[KyodoRegistry-constructor-address-]: ../KyodoRegistry.md#KyodoRegistry-constructor-address-
[KyodoRegistry-createRegistry-string-address-uint256-]: ../KyodoRegistry.md#KyodoRegistry-createRegistry-string-address-uint256-
[KyodoRegistry-updateRegistry-string-address-uint256-]: ../KyodoRegistry.md#KyodoRegistry-updateRegistry-string-address-uint256-
[KyodoRegistry-getRegistry-string-]: ../KyodoRegistry.md#KyodoRegistry-getRegistry-string-
[KyodoRegistry-getBlockDeployment-string-]: ../KyodoRegistry.md#KyodoRegistry-getBlockDeployment-string-
[StableVault]: ../StableVault.md#StableVault
[StableVault-userSetCompound-mapping-address----bool-]: ../StableVault.md#StableVault-userSetCompound-mapping-address----bool-
[StableVault-validNetworks-mapping-string----mapping-uint256----bool--]: ../StableVault.md#StableVault-validNetworks-mapping-string----mapping-uint256----bool--
[StableVault-constructor-address-string-string-]: ../StableVault.md#StableVault-constructor-address-string-string-
[StableVault-deposit-uint256-address-address-]: ../StableVault.md#StableVault-deposit-uint256-address-address-
[StableVault-_correctAmount-uint256-address-]: ../StableVault.md#StableVault-_correctAmount-uint256-address-
[StableVault-vaultBalance--]: ../StableVault.md#StableVault-vaultBalance--
[StableVault-withdraw-uint256-address-]: ../StableVault.md#StableVault-withdraw-uint256-address-
[StableVault-getAaveBalance-address-]: ../StableVault.md#StableVault-getAaveBalance-address-
[StableVault-setAaveSettings-address-address-address-]: ../StableVault.md#StableVault-setAaveSettings-address-address-address-
[StableVault-setUserCompoundPreference-bool-address-]: ../StableVault.md#StableVault-setUserCompoundPreference-bool-address-
[StableVault-getChainID--]: ../StableVault.md#StableVault-getChainID--
[StableVault-isValidNetworkForFunction-string-]: ../StableVault.md#StableVault-isValidNetworkForFunction-string-
[StableVault-updateValidNetworks-string-uint256---]: ../StableVault.md#StableVault-updateValidNetworks-string-uint256---
[IAaveIncentivesController]: IAaveIncentivesController.md#IAaveIncentivesController
[IAaveIncentivesController-claimRewards-address---uint256-address-]: IAaveIncentivesController.md#IAaveIncentivesController-claimRewards-address---uint256-address-
[IAgreementContract]: IAgreementContract.md#IAgreementContract
[IAgreementContract-addAcceptedPaymentToken-address-]: IAgreementContract.md#IAgreementContract-addAcceptedPaymentToken-address-
[IAgreementContract-createAgreement-string-string-address-struct-IAgreementContract-Skill---uint256-]: IAgreementContract.md#IAgreementContract-createAgreement-string-string-address-struct-IAgreementContract-Skill---uint256-
[IAgreementContract-getAgreementCount--]: IAgreementContract.md#IAgreementContract-getAgreementCount--
[IAgreementContract-getAllAgreements--]: IAgreementContract.md#IAgreementContract-getAllAgreements--
[IAgreementContract-getContractorAgreements-address-]: IAgreementContract.md#IAgreementContract-getContractorAgreements-address-
[IAgreementContract-getProfessionalAgreements-address-]: IAgreementContract.md#IAgreementContract-getProfessionalAgreements-address-
[IAgreementContract-getAgreementById-uint256-]: IAgreementContract.md#IAgreementContract-getAgreementById-uint256-
[IAgreementContract-getSkillsByAgreementId-uint256-]: IAgreementContract.md#IAgreementContract-getSkillsByAgreementId-uint256-
[IAgreementContract-makePayment-uint256-uint256-address-]: IAgreementContract.md#IAgreementContract-makePayment-uint256-uint256-address-
[IAgreementContract-setFees-uint256-uint256-uint256-]: IAgreementContract.md#IAgreementContract-setFees-uint256-uint256-uint256-
[IAgreementContract-setStableVaultAddress-address-]: IAgreementContract.md#IAgreementContract-setStableVaultAddress-address-
[IAgreementContract-AgreementCreated-address-address-uint256-uint256-]: IAgreementContract.md#IAgreementContract-AgreementCreated-address-address-uint256-uint256-
[IAgreementContract-PaymentMade-address-address-uint256-uint256-]: IAgreementContract.md#IAgreementContract-PaymentMade-address-address-uint256-uint256-
[IAgreementContract-Token]: IAgreementContract.md#IAgreementContract-Token
[IAgreementContract-Skill]: IAgreementContract.md#IAgreementContract-Skill
[IAgreementContract-Agreement]: IAgreementContract.md#IAgreementContract-Agreement
[IAgreementContract-AgreementStatus]: IAgreementContract.md#IAgreementContract-AgreementStatus
[IDataProvider]: IDataProvider.md#IDataProvider
[IDataProvider-getReserveTokensAddresses-address-]: IDataProvider.md#IDataProvider-getReserveTokensAddresses-address-
[IDataProvider-getUserReserveData-address-address-]: IDataProvider.md#IDataProvider-getUserReserveData-address-address-
[IDataProvider-getRewardsBalance-address---address-]: IDataProvider.md#IDataProvider-getRewardsBalance-address---address-
[IKyodoRegistry]: IKyodoRegistry.md#IKyodoRegistry
[IKyodoRegistry-createRegistry-string-address-uint256-]: IKyodoRegistry.md#IKyodoRegistry-createRegistry-string-address-uint256-
[IKyodoRegistry-updateRegistry-string-address-uint256-]: IKyodoRegistry.md#IKyodoRegistry-updateRegistry-string-address-uint256-
[IKyodoRegistry-getRegistry-string-]: IKyodoRegistry.md#IKyodoRegistry-getRegistry-string-
[IKyodoRegistry-getBlockDeployment-string-]: IKyodoRegistry.md#IKyodoRegistry-getBlockDeployment-string-
[IKyodoRegistry-RegistryCreated-bytes32-address-uint256-]: IKyodoRegistry.md#IKyodoRegistry-RegistryCreated-bytes32-address-uint256-
[IKyodoRegistry-RegistryUpdated-bytes32-address-uint256-]: IKyodoRegistry.md#IKyodoRegistry-RegistryUpdated-bytes32-address-uint256-
[ILendingPool]: ILendingPool.md#ILendingPool
[ILendingPool-deposit-address-uint256-address-uint16-]: ILendingPool.md#ILendingPool-deposit-address-uint256-address-uint16-
[ILendingPool-withdraw-address-uint256-address-]: ILendingPool.md#ILendingPool-withdraw-address-uint256-address-
[ILendingPool-borrow-address-uint256-uint256-uint16-address-]: ILendingPool.md#ILendingPool-borrow-address-uint256-uint256-uint16-address-
[ILendingPool-repay-address-uint256-uint256-address-]: ILendingPool.md#ILendingPool-repay-address-uint256-uint256-address-
[ILendingPool-getUserAccountData-address-]: ILendingPool.md#ILendingPool-getUserAccountData-address-
[ILendingPool-Deposit-address-address-address-uint256-uint16-]: ILendingPool.md#ILendingPool-Deposit-address-address-address-uint256-uint16-
[ILendingPool-Withdraw-address-address-address-uint256-]: ILendingPool.md#ILendingPool-Withdraw-address-address-address-uint256-
[IStableVault]: #IStableVault
[IStableVault-deposit-uint256-address-address-]: #IStableVault-deposit-uint256-address-address-
[IStableVault-withdraw-uint256-address-]: #IStableVault-withdraw-uint256-address-
[IStableVault-setAaveSettings-address-address-address-]: #IStableVault-setAaveSettings-address-address-address-
[IStableVault-setUserCompoundPreference-bool-address-]: #IStableVault-setUserCompoundPreference-bool-address-
[IStableVault-getChainID--]: #IStableVault-getChainID--
[IStableVault-isValidNetworkForFunction-string-]: #IStableVault-isValidNetworkForFunction-string-
[IStableVault-updateValidNetworks-string-uint256---]: #IStableVault-updateValidNetworks-string-uint256---
[IStableVault-vaultBalance--]: #IStableVault-vaultBalance--
[IStableVault-getAaveBalance-address-]: #IStableVault-getAaveBalance-address-
[IStableVault-BalanceUpdated-uint256-]: #IStableVault-BalanceUpdated-uint256-
[IStableVault-Withdrawal-address-uint256-address-]: #IStableVault-Withdrawal-address-uint256-address-
[IStableVault-DepositAave-address-address-uint256-]: #IStableVault-DepositAave-address-address-uint256-
[fakeStable]: ../fakeStable.md#fakeStable
[fakeStable-constructor-uint256-uint8-]: ../fakeStable.md#fakeStable-constructor-uint256-uint8-
[fakeStable-mint-address-uint256-]: ../fakeStable.md#fakeStable-mint-address-uint256-
[fakeStable-burn-address-uint256-]: ../fakeStable.md#fakeStable-burn-address-uint256-
[fakeStable-addAdmin-address-]: ../fakeStable.md#fakeStable-addAdmin-address-
[fakeStable-removeAdmin-address-]: ../fakeStable.md#fakeStable-removeAdmin-address-
[fakeStable-pause--]: ../fakeStable.md#fakeStable-pause--
[fakeStable-unpause--]: ../fakeStable.md#fakeStable-unpause--
[fakeStable-decimals--]: ../fakeStable.md#fakeStable-decimals--
[fakeStable-NewAdminAdded-address-]: ../fakeStable.md#fakeStable-NewAdminAdded-address-
[fakeStable-RemovedAdmin-address-]: ../fakeStable.md#fakeStable-RemovedAdmin-address-
# `IStableVault`



---



## Functions

### `deposit()`
  Deposits an asset into the Vault and mints vault tokens for the beneficiary.


```solidity
  deposit(
    uint256 amount,
    address _asset,
    address _beneficiary
  ) external returns (bool)
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`amount` | uint256 | The amount of the asset to deposit.
|`_asset` | address | The address of the asset token being deposited.
|`_beneficiary` | address | The address that will receive the minted vault tokens.




#### Return values:
| Name                           | Type          | Description                                                                  |
| :----------------------------- | :------------ | :--------------------------------------------------------------------------- |
|`bool`| bool | Indicates if the deposit was successful.

### `withdraw()`
  Withdraws an asset from the Vault and burns the corresponding vault tokens.


```solidity
  withdraw(
    uint256 amount,
    address _asset
  ) external returns (bool)
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`amount` | uint256 | The amount of the asset to withdraw.
|`_asset` | address | The address of the asset token being withdrawn.




#### Return values:
| Name                           | Type          | Description                                                                  |
| :----------------------------- | :------------ | :--------------------------------------------------------------------------- |
|`bool`| bool | Indicates if the withdrawal was successful.

### `setAaveSettings()`
  Sets the addresses for the Aave ecosystem components.


```solidity
  setAaveSettings(
    address _AAVE_DATA_PROVIDER,
    address _AAVE_INCENTIVES_CONTROLLER,
    address _AAVE_LENDING_POOL
  ) external
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`_AAVE_DATA_PROVIDER` | address | Address of the Aave Data Provider.
|`_AAVE_INCENTIVES_CONTROLLER` | address | Address of the Aave Incentives Controller.
|`_AAVE_LENDING_POOL` | address | Address of the Aave Lending Pool.




### `setUserCompoundPreference()`
  Sets the user's preference for automatic compounding in the Aave Lending Pool.


```solidity
  setUserCompoundPreference(
    bool useCompound,
    address wallet
  ) external
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`useCompound` | bool | Boolean indicating whether to use compounding or not.
|`wallet` | address | The address of the user's wallet.




### `getChainID()`
  Retrieves the current chain ID.


```solidity
  getChainID() external returns (uint256)
```


#### Return values:
| Name                           | Type          | Description                                                                  |
| :----------------------------- | :------------ | :--------------------------------------------------------------------------- |
|`uint256`| uint256 | The current chain ID.

### `isValidNetworkForFunction()`
  Checks if a given function is valid for the current network.


```solidity
  isValidNetworkForFunction(
    string functionName
  ) external returns (bool)
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`functionName` | string | The name of the function to check.




#### Return values:
| Name                           | Type          | Description                                                                  |
| :----------------------------- | :------------ | :--------------------------------------------------------------------------- |
|`bool`| bool | Indicates if the network is valid for the given function.

### `updateValidNetworks()`
  Updates the valid networks for a specific function.


```solidity
  updateValidNetworks(
    string functionName,
    uint256[] chainIDs
  ) external
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`functionName` | string | The function name to update.
|`chainIDs` | uint256[] | An array of chain IDs that are valid for the function.




### `vaultBalance()`
  Returns the current balance of the vault.


```solidity
  vaultBalance() external returns (uint256)
```


#### Return values:
| Name                           | Type          | Description                                                                  |
| :----------------------------- | :------------ | :--------------------------------------------------------------------------- |
|`uint256`| uint256 | The current vault balance.

### `getAaveBalance()`
  Retrieves the balance of Aave tokens for a given asset.


```solidity
  getAaveBalance(
    address _asset
  ) external returns (uint256)
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`_asset` | address | The address of the asset token.




#### Return values:
| Name                           | Type          | Description                                                                  |
| :----------------------------- | :------------ | :--------------------------------------------------------------------------- |
|`uint`| uint256 | The balance of Aave tokens for the specified asset.


---

## Events


Emitted when the vault's balance is updated.


```solidity
  BalanceUpdated(uint256 _vaultBalance)
```
#### Parameters:
| Name                           | Type          | Description                                    |
| :----------------------------- | :------------ | :--------------------------------------------- |
|`_vaultBalance`| uint256 | The new balance of the vault.


Emitted when a user withdraws assets from the vault.


```solidity
  Withdrawal(address user, uint256 amount, address asset)
```
#### Parameters:
| Name                           | Type          | Description                                    |
| :----------------------------- | :------------ | :--------------------------------------------- |
|`user`| address | The address of the user who made the withdrawal.
|`amount`| uint256 | The amount of the asset withdrawn.
|`asset`| address | The address of the asset that was withdrawn.


Emitted when a deposit is made to the Aave Lending Pool.


```solidity
  DepositAave(address user, address asset, uint256 amount)
```
#### Parameters:
| Name                           | Type          | Description                                    |
| :----------------------------- | :------------ | :--------------------------------------------- |
|`user`| address | The user who made the deposit.
|`asset`| address | The address of the asset deposited.
|`amount`| uint256 | The amount of the asset deposited.


