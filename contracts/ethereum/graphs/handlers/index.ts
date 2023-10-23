import {
  AgreementCreated as AgreementCreatedEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  BalanceUpdated as BalanceUpdatedEvent,
  NewAdminAdded as NewAdminAddedEvent,
  RemovedAdmin as RemovedAdminEvent,
  PaymentMade as PaymentMadeEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  Withdrawal as WithdrawalEvent,
  Transfer as TransferEvent,
  Approval as ApprovalEvent,
  Unpaused as UnpausedEvent,
  Paused as PausedEvent,
} from "../contracts";

import * as AgreementContractHandler from "./AgreementContractHandler";
import * as StableVaultContractHandler from "./StableVaultContractHandler";

export function handleApproval(event: ApprovalEvent): void {
  let entity = new StableVaultContractHandler.Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.owner = event.params.owner;
  entity.spender = event.params.spender;
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleBalanceUpdated(event: BalanceUpdatedEvent): void {
  let entity = new StableVaultContractHandler.BalanceUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity._vaultBalance = event.params._vaultBalance;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleNewAdminAdded(event: NewAdminAddedEvent): void {
  let entity = new StableVaultContractHandler.NewAdminAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.new_admin = event.params.new_admin;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePaused(event: PausedEvent): void {
  let entity = new StableVaultContractHandler.Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.account = event.params.account;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRemovedAdmin(event: RemovedAdminEvent): void {
  let entity = new StableVaultContractHandler.RemovedAdmin(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.removed_admin = event.params.removed_admin;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new StableVaultContractHandler.RoleAdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.role = event.params.role;
  entity.previousAdminRole = event.params.previousAdminRole;
  entity.newAdminRole = event.params.newAdminRole;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new StableVaultContractHandler.RoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.role = event.params.role;
  entity.account = event.params.account;
  entity.sender = event.params.sender;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new StableVaultContractHandler.RoleRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.role = event.params.role;
  entity.account = event.params.account;
  entity.sender = event.params.sender;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new StableVaultContractHandler.Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new StableVaultContractHandler.Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.account = event.params.account;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleWithdrawal(event: WithdrawalEvent): void {
  let entity = new StableVaultContractHandler.Withdrawal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.asset = event.params.asset;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleAgreementCreated(event: AgreementCreatedEvent): void {
  let entity = new AgreementContractHandler.AgreementCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.company = event.params.company;
  entity.professional = event.params.professional;
  entity.agreementId = event.params.agreementId;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePaymentMade(event: PaymentMadeEvent): void {
  let entity = new AgreementContractHandler.PaymentMade(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.company = event.params.company;
  entity.professional = event.params.professional;
  entity.agreementId = event.params.agreementId;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
