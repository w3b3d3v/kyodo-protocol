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
[IAgreementContract]: #IAgreementContract
[IAgreementContract-addAcceptedPaymentToken-address-]: #IAgreementContract-addAcceptedPaymentToken-address-
[IAgreementContract-createAgreement-string-string-address-struct-IAgreementContract-Skill---uint256-]: #IAgreementContract-createAgreement-string-string-address-struct-IAgreementContract-Skill---uint256-
[IAgreementContract-getAgreementCount--]: #IAgreementContract-getAgreementCount--
[IAgreementContract-getAllAgreements--]: #IAgreementContract-getAllAgreements--
[IAgreementContract-getContractorAgreements-address-]: #IAgreementContract-getContractorAgreements-address-
[IAgreementContract-getProfessionalAgreements-address-]: #IAgreementContract-getProfessionalAgreements-address-
[IAgreementContract-getAgreementById-uint256-]: #IAgreementContract-getAgreementById-uint256-
[IAgreementContract-getSkillsByAgreementId-uint256-]: #IAgreementContract-getSkillsByAgreementId-uint256-
[IAgreementContract-updateTokenIncentive-address-uint256-]: #IAgreementContract-updateTokenIncentive-address-uint256-
[IAgreementContract-makePayment-uint256-uint256-address-]: #IAgreementContract-makePayment-uint256-uint256-address-
[IAgreementContract-setFees-uint256-uint256-uint256-]: #IAgreementContract-setFees-uint256-uint256-uint256-
[IAgreementContract-setStableVaultAddress-address-]: #IAgreementContract-setStableVaultAddress-address-
[IAgreementContract-AgreementCreated-address-address-uint256-uint256-]: #IAgreementContract-AgreementCreated-address-address-uint256-uint256-
[IAgreementContract-PaymentMade-address-address-uint256-uint256-]: #IAgreementContract-PaymentMade-address-address-uint256-uint256-
[IAgreementContract-Token]: #IAgreementContract-Token
[IAgreementContract-Skill]: #IAgreementContract-Skill
[IAgreementContract-Agreement]: #IAgreementContract-Agreement
[IAgreementContract-AgreementStatus]: #IAgreementContract-AgreementStatus
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
# `IAgreementContract`



---
## Structs

```solidity
  Token {
    uint256 amount
    address tokenAddress
  }
```
```solidity
  Skill {
    string name
    uint256 level
  }
```
```solidity
  Agreement {
    uint256 id
    string title
    string description
    enum IAgreementContract.AgreementStatus status
    address company
    address professional
    struct IAgreementContract.Token tokenIncentive
    struct IAgreementContract.Token payment
    uint256 totalPaid
  }
```

---

## Enumerators

### `AgreementStatus`
```solidity
  AgreementStatus {
      Active
      Completed
  }
```

---


## Functions

### `addAcceptedPaymentToken()`
  Adds an ERC20 token to the list of accepted payment tokens.


```solidity
  addAcceptedPaymentToken(
    address _tokenAddress
  ) external
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`_tokenAddress` | address | The address of the ERC20 token to be added.




### `createAgreement()`
  Creates a new agreement between a company and a professional.


```solidity
  createAgreement(
    string _title,
    string _description,
    address _professional,
    struct IAgreementContract.Skill[] _skills,
    uint256 _paymentAmount
  ) external
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`_title` | string | The title of the agreement.
|`_description` | string | A brief description of the agreement.
|`_professional` | address | The address of the professional involved in the agreement.
|`_skills` | struct IAgreementContract.Skill[] | An array of skills required for the agreement.
|`_paymentAmount` | uint256 | The payment amount for the agreement.




### `getAgreementCount()`
  Returns the total number of agreements created.


```solidity
  getAgreementCount() external returns (uint256)
```


#### Return values:
| Name                           | Type          | Description                                                                  |
| :----------------------------- | :------------ | :--------------------------------------------------------------------------- |
|`uint256`| uint256 | The total number of agreements.

### `getAllAgreements()`
  Returns all agreements.


```solidity
  getAllAgreements() external returns (struct IAgreementContract.Agreement[])
```


#### Return values:
| Name                           | Type          | Description                                                                  |
| :----------------------------- | :------------ | :--------------------------------------------------------------------------- |
|`An`| struct IAgreementContract.Agreement[] | array of all agreements.

### `getContractorAgreements()`
  Returns a list of agreement IDs associated with a contractor.


```solidity
  getContractorAgreements(
    address _contractor
  ) external returns (uint256[])
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`_contractor` | address | The address of the contractor.




#### Return values:
| Name                           | Type          | Description                                                                  |
| :----------------------------- | :------------ | :--------------------------------------------------------------------------- |
|`An`| uint256[] | array of agreement IDs.

### `getProfessionalAgreements()`
  Returns a list of agreement IDs associated with a professional.


```solidity
  getProfessionalAgreements(
    address _professional
  ) external returns (uint256[])
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`_professional` | address | The address of the professional.




#### Return values:
| Name                           | Type          | Description                                                                  |
| :----------------------------- | :------------ | :--------------------------------------------------------------------------- |
|`An`| uint256[] | array of agreement IDs.

### `getAgreementById()`
  Retrieves an agreement by its ID.


```solidity
  getAgreementById(
    uint256 _id
  ) external returns (struct IAgreementContract.Agreement)
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`_id` | uint256 | The ID of the agreement.




#### Return values:
| Name                           | Type          | Description                                                                  |
| :----------------------------- | :------------ | :--------------------------------------------------------------------------- |
|`Agreement`| struct IAgreementContract.Agreement | The agreement associated with the given ID.

### `getSkillsByAgreementId()`
  Retrieves the skills associated with a specific agreement ID.


```solidity
  getSkillsByAgreementId(
    uint256 _agreementId
  ) external returns (struct IAgreementContract.Skill[])
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`_agreementId` | uint256 | The ID of the agreement.




#### Return values:
| Name                           | Type          | Description                                                                  |
| :----------------------------- | :------------ | :--------------------------------------------------------------------------- |
|`An`| struct IAgreementContract.Skill[] | array of skills associated with the agreement.

### `updateTokenIncentive()`
  Updates the token incentive for agreements.


```solidity
  updateTokenIncentive(
    address _newTokenAddress,
    uint256 _newAmount
  ) external
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`_newTokenAddress` | address | The address of the new token to be set as an incentive.
|`_newAmount` | uint256 | The amount of the new incentive token.




### `makePayment()`
  Makes a payment for a specific agreement.


```solidity
  makePayment(
    uint256 _agreementId,
    uint256 _amountToPay,
    address _paymentAddress
  ) external
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`_agreementId` | uint256 | The ID of the agreement for which the payment is being made.
|`_amountToPay` | uint256 | The amount of the payment.
|`_paymentAddress` | address | The address of the token in which payment is made.




### `setFees()`
  Sets the fee structure for the agreement transactions.


```solidity
  setFees(
    uint256 _feePercentage,
    uint256 _kyodoTreasuryFee,
    uint256 _communityDAOFee
  ) external
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`_feePercentage` | uint256 | The percentage of the transaction amount to be taken as a fee.
|`_kyodoTreasuryFee` | uint256 | The portion of the fee allocated to the Kyodo Treasury.
|`_communityDAOFee` | uint256 | The portion of the fee allocated to the Community DAO.




### `setStableVaultAddress()`
  Sets the address of the StableVault contract.


```solidity
  setStableVaultAddress(
    address _StableVaultAddress
  ) external
```
#### Parameters list:

| Name | Type | Description                                                          |
| :--- | :--- | :------------------------------------------------------------------- |
|`_StableVaultAddress` | address | The address of the StableVault contract.





---

## Events




```solidity
  AgreementCreated(address company, address professional, uint256 agreementId, uint256 amount)
```





```solidity
  PaymentMade(address company, address professional, uint256 agreementId, uint256 amount)
```



