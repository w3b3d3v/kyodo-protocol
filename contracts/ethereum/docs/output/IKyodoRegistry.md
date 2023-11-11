[Admin]: ../Admin.md#Admin
[Admin-onlyAdmin--]: ../Admin.md#Admin-onlyAdmin--
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
[AgreementContract-tokenIncentive-struct-IAgreementContract-Token]: ../AgreementContract.md#AgreementContract-tokenIncentive-struct-IAgreementContract-Token
[AgreementContract-StableVault-contract-IStableVault]: ../AgreementContract.md#AgreementContract-StableVault-contract-IStableVault
[AgreementContract-kyodoTreasury-address]: ../AgreementContract.md#AgreementContract-kyodoTreasury-address
[AgreementContract-communityDAO-address]: ../AgreementContract.md#AgreementContract-communityDAO-address
[AgreementContract-feePercentage-uint256]: ../AgreementContract.md#AgreementContract-feePercentage-uint256
[AgreementContract-kyodoTreasuryFee-uint256]: ../AgreementContract.md#AgreementContract-kyodoTreasuryFee-uint256
[AgreementContract-communityDAOFee-uint256]: ../AgreementContract.md#AgreementContract-communityDAOFee-uint256
[AgreementContract-constructor-address-address-address-]: ../AgreementContract.md#AgreementContract-constructor-address-address-address-
[AgreementContract-addAcceptedPaymentToken-address-]: ../AgreementContract.md#AgreementContract-addAcceptedPaymentToken-address-
[AgreementContract-createAgreement-string-string-address-struct-IAgreementContract-Skill---uint256-]: ../AgreementContract.md#AgreementContract-createAgreement-string-string-address-struct-IAgreementContract-Skill---uint256-
[AgreementContract-getAgreementCount--]: ../AgreementContract.md#AgreementContract-getAgreementCount--
[AgreementContract-getAllAgreements--]: ../AgreementContract.md#AgreementContract-getAllAgreements--
[AgreementContract-getContractorAgreements-address-]: ../AgreementContract.md#AgreementContract-getContractorAgreements-address-
[AgreementContract-getProfessionalAgreements-address-]: ../AgreementContract.md#AgreementContract-getProfessionalAgreements-address-
[AgreementContract-getAgreementById-uint256-]: ../AgreementContract.md#AgreementContract-getAgreementById-uint256-
[AgreementContract-getSkillsByAgreementId-uint256-]: ../AgreementContract.md#AgreementContract-getSkillsByAgreementId-uint256-
[AgreementContract-updateTokenIncentive-address-uint256-]: ../AgreementContract.md#AgreementContract-updateTokenIncentive-address-uint256-
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
[IAgreementContract]: IAgreementContract.md#IAgreementContract
[IAgreementContract-addAcceptedPaymentToken-address-]: IAgreementContract.md#IAgreementContract-addAcceptedPaymentToken-address-
[IAgreementContract-createAgreement-string-string-address-struct-IAgreementContract-Skill---uint256-]: IAgreementContract.md#IAgreementContract-createAgreement-string-string-address-struct-IAgreementContract-Skill---uint256-
[IAgreementContract-getAgreementCount--]: IAgreementContract.md#IAgreementContract-getAgreementCount--
[IAgreementContract-getAllAgreements--]: IAgreementContract.md#IAgreementContract-getAllAgreements--
[IAgreementContract-getContractorAgreements-address-]: IAgreementContract.md#IAgreementContract-getContractorAgreements-address-
[IAgreementContract-getProfessionalAgreements-address-]: IAgreementContract.md#IAgreementContract-getProfessionalAgreements-address-
[IAgreementContract-getAgreementById-uint256-]: IAgreementContract.md#IAgreementContract-getAgreementById-uint256-
[IAgreementContract-getSkillsByAgreementId-uint256-]: IAgreementContract.md#IAgreementContract-getSkillsByAgreementId-uint256-
[IAgreementContract-updateTokenIncentive-address-uint256-]: IAgreementContract.md#IAgreementContract-updateTokenIncentive-address-uint256-
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
[IKyodoRegistry]: #IKyodoRegistry
[IKyodoRegistry-createRegistry-string-address-uint256-]: #IKyodoRegistry-createRegistry-string-address-uint256-
[IKyodoRegistry-updateRegistry-string-address-uint256-]: #IKyodoRegistry-updateRegistry-string-address-uint256-
[IKyodoRegistry-getRegistry-string-]: #IKyodoRegistry-getRegistry-string-
[IKyodoRegistry-getBlockDeployment-string-]: #IKyodoRegistry-getBlockDeployment-string-
[IKyodoRegistry-RegistryCreated-bytes32-address-uint256-]: #IKyodoRegistry-RegistryCreated-bytes32-address-uint256-
[IKyodoRegistry-RegistryUpdated-bytes32-address-uint256-]: #IKyodoRegistry-RegistryUpdated-bytes32-address-uint256-
[ILendingPool]: ILendingPool.md#ILendingPool
[ILendingPool-deposit-address-uint256-address-uint16-]: ILendingPool.md#ILendingPool-deposit-address-uint256-address-uint16-
[ILendingPool-withdraw-address-uint256-address-]: ILendingPool.md#ILendingPool-withdraw-address-uint256-address-
[ILendingPool-borrow-address-uint256-uint256-uint16-address-]: ILendingPool.md#ILendingPool-borrow-address-uint256-uint256-uint16-address-
[ILendingPool-repay-address-uint256-uint256-address-]: ILendingPool.md#ILendingPool-repay-address-uint256-uint256-address-
[ILendingPool-getUserAccountData-address-]: ILendingPool.md#ILendingPool-getUserAccountData-address-
[ILendingPool-Deposit-address-address-address-uint256-uint16-]: ILendingPool.md#ILendingPool-Deposit-address-address-address-uint256-uint16-
[ILendingPool-Withdraw-address-address-address-uint256-]: ILendingPool.md#ILendingPool-Withdraw-address-address-address-uint256-
[IStableVault]: IStableVault.md#IStableVault
[IStableVault-deposit-uint256-address-address-]: IStableVault.md#IStableVault-deposit-uint256-address-address-
[IStableVault-withdraw-uint256-address-]: IStableVault.md#IStableVault-withdraw-uint256-address-
[IStableVault-setAaveSettings-address-address-address-]: IStableVault.md#IStableVault-setAaveSettings-address-address-address-
[IStableVault-setUserCompoundPreference-bool-address-]: IStableVault.md#IStableVault-setUserCompoundPreference-bool-address-
[IStableVault-getChainID--]: IStableVault.md#IStableVault-getChainID--
[IStableVault-isValidNetworkForFunction-string-]: IStableVault.md#IStableVault-isValidNetworkForFunction-string-
[IStableVault-updateValidNetworks-string-uint256---]: IStableVault.md#IStableVault-updateValidNetworks-string-uint256---
[IStableVault-vaultBalance--]: IStableVault.md#IStableVault-vaultBalance--
[IStableVault-getAaveBalance-address-]: IStableVault.md#IStableVault-getAaveBalance-address-
[IStableVault-BalanceUpdated-uint256-]: IStableVault.md#IStableVault-BalanceUpdated-uint256-
[IStableVault-Withdrawal-address-uint256-address-]: IStableVault.md#IStableVault-Withdrawal-address-uint256-address-
[IStableVault-DepositAave-address-address-uint256-]: IStableVault.md#IStableVault-DepositAave-address-address-uint256-
[fakeStable]: ../fakeStable.md#fakeStable
[fakeStable-onlyAdmin--]: ../fakeStable.md#fakeStable-onlyAdmin--
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
# `IKyodoRegistry`



---



## Functions

### `createRegistry()`
  Creates a new registry entry.


```solidity
  createRegistry(
    string registry,
    address value,
    uint256 blockNumber
  ) external
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`registry` | string | The name of the registry to create.
|`value` | address | The address to be associated with the registry.
|`blockNumber` | uint256 | The block number at which the registry is created.




### `updateRegistry()`
  Updates an existing registry entry.


```solidity
  updateRegistry(
    string registry,
    address value,
    uint256 blockNumber
  ) external
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`registry` | string | The name of the registry to update.
|`value` | address | The new address to be associated with the registry.
|`blockNumber` | uint256 | The block number at which the registry is updated.




### `getRegistry()`
  Retrieves the address associated with a registry.


```solidity
  getRegistry(
    string registry
  ) external returns (address)
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`registry` | string | The name of the registry to query.




#### Return values:
| Name                           | Type          | Description                                                                  |
| :----------------------------- | :------------ | :--------------------------------------------------------------------------- |
|`address`| address | The address associated with the given registry.

### `getBlockDeployment()`
  Retrieves the block number at which a registry was created or updated.


```solidity
  getBlockDeployment(
    string registry
  ) external returns (uint256)
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`registry` | string | The name of the registry to query.




#### Return values:
| Name                           | Type          | Description                                                                  |
| :----------------------------- | :------------ | :--------------------------------------------------------------------------- |
|`uint`| uint256 | The block number of the registry creation or update.


---

## Events




```solidity
  RegistryCreated(bytes32 key, address value, uint256 blockNumber)
```





```solidity
  RegistryUpdated(bytes32 key, address value, uint256 blockNumber)
```



