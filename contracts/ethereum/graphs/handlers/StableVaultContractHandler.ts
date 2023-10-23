import {
    Entity,
    Value,
    ValueKind,
    store,
    Bytes,
    BigInt,
  } from "@graphprotocol/graph-ts";
  
  export class Approval extends Entity {
    constructor(id: Bytes) {
      super();
      this.set("id", Value.fromBytes(id));
    }
  
    save(): void {
      let id = this.get("id");
      assert(id != null, "Cannot save Approval entity without an ID");
      if (id) {
        assert(
          id.kind == ValueKind.BYTES,
          `Entities of type Approval must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
        );
        store.set("Approval", id.toBytes().toHexString(), this);
      }
    }
  
    static loadInBlock(id: Bytes): Approval | null {
      return changetype<Approval | null>(
        store.get_in_block("Approval", id.toHexString())
      );
    }
  
    static load(id: Bytes): Approval | null {
      return changetype<Approval | null>(store.get("Approval", id.toHexString()));
    }
  
    get id(): Bytes {
      let value = this.get("id");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set id(value: Bytes) {
      this.set("id", Value.fromBytes(value));
    }
  
    get owner(): Bytes {
      let value = this.get("owner");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set owner(value: Bytes) {
      this.set("owner", Value.fromBytes(value));
    }
  
    get spender(): Bytes {
      let value = this.get("spender");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set spender(value: Bytes) {
      this.set("spender", Value.fromBytes(value));
    }
  
    get value(): BigInt {
      let value = this.get("value");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set value(value: BigInt) {
      this.set("value", Value.fromBigInt(value));
    }
  
    get blockNumber(): BigInt {
      let value = this.get("blockNumber");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockNumber(value: BigInt) {
      this.set("blockNumber", Value.fromBigInt(value));
    }
  
    get blockTimestamp(): BigInt {
      let value = this.get("blockTimestamp");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockTimestamp(value: BigInt) {
      this.set("blockTimestamp", Value.fromBigInt(value));
    }
  
    get transactionHash(): Bytes {
      let value = this.get("transactionHash");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set transactionHash(value: Bytes) {
      this.set("transactionHash", Value.fromBytes(value));
    }
  }
  
  export class BalanceUpdated extends Entity {
    constructor(id: Bytes) {
      super();
      this.set("id", Value.fromBytes(id));
    }
  
    save(): void {
      let id = this.get("id");
      assert(id != null, "Cannot save BalanceUpdated entity without an ID");
      if (id) {
        assert(
          id.kind == ValueKind.BYTES,
          `Entities of type BalanceUpdated must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
        );
        store.set("BalanceUpdated", id.toBytes().toHexString(), this);
      }
    }
  
    static loadInBlock(id: Bytes): BalanceUpdated | null {
      return changetype<BalanceUpdated | null>(
        store.get_in_block("BalanceUpdated", id.toHexString())
      );
    }
  
    static load(id: Bytes): BalanceUpdated | null {
      return changetype<BalanceUpdated | null>(
        store.get("BalanceUpdated", id.toHexString())
      );
    }
  
    get id(): Bytes {
      let value = this.get("id");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set id(value: Bytes) {
      this.set("id", Value.fromBytes(value));
    }
  
    get _vaultBalance(): BigInt {
      let value = this.get("_vaultBalance");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set _vaultBalance(value: BigInt) {
      this.set("_vaultBalance", Value.fromBigInt(value));
    }
  
    get blockNumber(): BigInt {
      let value = this.get("blockNumber");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockNumber(value: BigInt) {
      this.set("blockNumber", Value.fromBigInt(value));
    }
  
    get blockTimestamp(): BigInt {
      let value = this.get("blockTimestamp");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockTimestamp(value: BigInt) {
      this.set("blockTimestamp", Value.fromBigInt(value));
    }
  
    get transactionHash(): Bytes {
      let value = this.get("transactionHash");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set transactionHash(value: Bytes) {
      this.set("transactionHash", Value.fromBytes(value));
    }
  }
  
  export class NewAdminAdded extends Entity {
    constructor(id: Bytes) {
      super();
      this.set("id", Value.fromBytes(id));
    }
  
    save(): void {
      let id = this.get("id");
      assert(id != null, "Cannot save NewAdminAdded entity without an ID");
      if (id) {
        assert(
          id.kind == ValueKind.BYTES,
          `Entities of type NewAdminAdded must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
        );
        store.set("NewAdminAdded", id.toBytes().toHexString(), this);
      }
    }
  
    static loadInBlock(id: Bytes): NewAdminAdded | null {
      return changetype<NewAdminAdded | null>(
        store.get_in_block("NewAdminAdded", id.toHexString())
      );
    }
  
    static load(id: Bytes): NewAdminAdded | null {
      return changetype<NewAdminAdded | null>(
        store.get("NewAdminAdded", id.toHexString())
      );
    }
  
    get id(): Bytes {
      let value = this.get("id");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set id(value: Bytes) {
      this.set("id", Value.fromBytes(value));
    }
  
    get new_admin(): Bytes {
      let value = this.get("new_admin");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set new_admin(value: Bytes) {
      this.set("new_admin", Value.fromBytes(value));
    }
  
    get blockNumber(): BigInt {
      let value = this.get("blockNumber");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockNumber(value: BigInt) {
      this.set("blockNumber", Value.fromBigInt(value));
    }
  
    get blockTimestamp(): BigInt {
      let value = this.get("blockTimestamp");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockTimestamp(value: BigInt) {
      this.set("blockTimestamp", Value.fromBigInt(value));
    }
  
    get transactionHash(): Bytes {
      let value = this.get("transactionHash");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set transactionHash(value: Bytes) {
      this.set("transactionHash", Value.fromBytes(value));
    }
  }
  
  export class Paused extends Entity {
    constructor(id: Bytes) {
      super();
      this.set("id", Value.fromBytes(id));
    }
  
    save(): void {
      let id = this.get("id");
      assert(id != null, "Cannot save Paused entity without an ID");
      if (id) {
        assert(
          id.kind == ValueKind.BYTES,
          `Entities of type Paused must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
        );
        store.set("Paused", id.toBytes().toHexString(), this);
      }
    }
  
    static loadInBlock(id: Bytes): Paused | null {
      return changetype<Paused | null>(
        store.get_in_block("Paused", id.toHexString())
      );
    }
  
    static load(id: Bytes): Paused | null {
      return changetype<Paused | null>(store.get("Paused", id.toHexString()));
    }
  
    get id(): Bytes {
      let value = this.get("id");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set id(value: Bytes) {
      this.set("id", Value.fromBytes(value));
    }
  
    get account(): Bytes {
      let value = this.get("account");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set account(value: Bytes) {
      this.set("account", Value.fromBytes(value));
    }
  
    get blockNumber(): BigInt {
      let value = this.get("blockNumber");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockNumber(value: BigInt) {
      this.set("blockNumber", Value.fromBigInt(value));
    }
  
    get blockTimestamp(): BigInt {
      let value = this.get("blockTimestamp");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockTimestamp(value: BigInt) {
      this.set("blockTimestamp", Value.fromBigInt(value));
    }
  
    get transactionHash(): Bytes {
      let value = this.get("transactionHash");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set transactionHash(value: Bytes) {
      this.set("transactionHash", Value.fromBytes(value));
    }
  }
  
  export class RemovedAdmin extends Entity {
    constructor(id: Bytes) {
      super();
      this.set("id", Value.fromBytes(id));
    }
  
    save(): void {
      let id = this.get("id");
      assert(id != null, "Cannot save RemovedAdmin entity without an ID");
      if (id) {
        assert(
          id.kind == ValueKind.BYTES,
          `Entities of type RemovedAdmin must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
        );
        store.set("RemovedAdmin", id.toBytes().toHexString(), this);
      }
    }
  
    static loadInBlock(id: Bytes): RemovedAdmin | null {
      return changetype<RemovedAdmin | null>(
        store.get_in_block("RemovedAdmin", id.toHexString())
      );
    }
  
    static load(id: Bytes): RemovedAdmin | null {
      return changetype<RemovedAdmin | null>(
        store.get("RemovedAdmin", id.toHexString())
      );
    }
  
    get id(): Bytes {
      let value = this.get("id");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set id(value: Bytes) {
      this.set("id", Value.fromBytes(value));
    }
  
    get removed_admin(): Bytes {
      let value = this.get("removed_admin");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set removed_admin(value: Bytes) {
      this.set("removed_admin", Value.fromBytes(value));
    }
  
    get blockNumber(): BigInt {
      let value = this.get("blockNumber");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockNumber(value: BigInt) {
      this.set("blockNumber", Value.fromBigInt(value));
    }
  
    get blockTimestamp(): BigInt {
      let value = this.get("blockTimestamp");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockTimestamp(value: BigInt) {
      this.set("blockTimestamp", Value.fromBigInt(value));
    }
  
    get transactionHash(): Bytes {
      let value = this.get("transactionHash");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set transactionHash(value: Bytes) {
      this.set("transactionHash", Value.fromBytes(value));
    }
  }
  
  export class RoleAdminChanged extends Entity {
    constructor(id: Bytes) {
      super();
      this.set("id", Value.fromBytes(id));
    }
  
    save(): void {
      let id = this.get("id");
      assert(id != null, "Cannot save RoleAdminChanged entity without an ID");
      if (id) {
        assert(
          id.kind == ValueKind.BYTES,
          `Entities of type RoleAdminChanged must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
        );
        store.set("RoleAdminChanged", id.toBytes().toHexString(), this);
      }
    }
  
    static loadInBlock(id: Bytes): RoleAdminChanged | null {
      return changetype<RoleAdminChanged | null>(
        store.get_in_block("RoleAdminChanged", id.toHexString())
      );
    }
  
    static load(id: Bytes): RoleAdminChanged | null {
      return changetype<RoleAdminChanged | null>(
        store.get("RoleAdminChanged", id.toHexString())
      );
    }
  
    get id(): Bytes {
      let value = this.get("id");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set id(value: Bytes) {
      this.set("id", Value.fromBytes(value));
    }
  
    get role(): Bytes {
      let value = this.get("role");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set role(value: Bytes) {
      this.set("role", Value.fromBytes(value));
    }
  
    get previousAdminRole(): Bytes {
      let value = this.get("previousAdminRole");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set previousAdminRole(value: Bytes) {
      this.set("previousAdminRole", Value.fromBytes(value));
    }
  
    get newAdminRole(): Bytes {
      let value = this.get("newAdminRole");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set newAdminRole(value: Bytes) {
      this.set("newAdminRole", Value.fromBytes(value));
    }
  
    get blockNumber(): BigInt {
      let value = this.get("blockNumber");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockNumber(value: BigInt) {
      this.set("blockNumber", Value.fromBigInt(value));
    }
  
    get blockTimestamp(): BigInt {
      let value = this.get("blockTimestamp");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockTimestamp(value: BigInt) {
      this.set("blockTimestamp", Value.fromBigInt(value));
    }
  
    get transactionHash(): Bytes {
      let value = this.get("transactionHash");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set transactionHash(value: Bytes) {
      this.set("transactionHash", Value.fromBytes(value));
    }
  }
  
  export class RoleGranted extends Entity {
    constructor(id: Bytes) {
      super();
      this.set("id", Value.fromBytes(id));
    }
  
    save(): void {
      let id = this.get("id");
      assert(id != null, "Cannot save RoleGranted entity without an ID");
      if (id) {
        assert(
          id.kind == ValueKind.BYTES,
          `Entities of type RoleGranted must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
        );
        store.set("RoleGranted", id.toBytes().toHexString(), this);
      }
    }
  
    static loadInBlock(id: Bytes): RoleGranted | null {
      return changetype<RoleGranted | null>(
        store.get_in_block("RoleGranted", id.toHexString())
      );
    }
  
    static load(id: Bytes): RoleGranted | null {
      return changetype<RoleGranted | null>(
        store.get("RoleGranted", id.toHexString())
      );
    }
  
    get id(): Bytes {
      let value = this.get("id");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set id(value: Bytes) {
      this.set("id", Value.fromBytes(value));
    }
  
    get role(): Bytes {
      let value = this.get("role");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set role(value: Bytes) {
      this.set("role", Value.fromBytes(value));
    }
  
    get account(): Bytes {
      let value = this.get("account");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set account(value: Bytes) {
      this.set("account", Value.fromBytes(value));
    }
  
    get sender(): Bytes {
      let value = this.get("sender");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set sender(value: Bytes) {
      this.set("sender", Value.fromBytes(value));
    }
  
    get blockNumber(): BigInt {
      let value = this.get("blockNumber");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockNumber(value: BigInt) {
      this.set("blockNumber", Value.fromBigInt(value));
    }
  
    get blockTimestamp(): BigInt {
      let value = this.get("blockTimestamp");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockTimestamp(value: BigInt) {
      this.set("blockTimestamp", Value.fromBigInt(value));
    }
  
    get transactionHash(): Bytes {
      let value = this.get("transactionHash");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set transactionHash(value: Bytes) {
      this.set("transactionHash", Value.fromBytes(value));
    }
  }
  
  export class RoleRevoked extends Entity {
    constructor(id: Bytes) {
      super();
      this.set("id", Value.fromBytes(id));
    }
  
    save(): void {
      let id = this.get("id");
      assert(id != null, "Cannot save RoleRevoked entity without an ID");
      if (id) {
        assert(
          id.kind == ValueKind.BYTES,
          `Entities of type RoleRevoked must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
        );
        store.set("RoleRevoked", id.toBytes().toHexString(), this);
      }
    }
  
    static loadInBlock(id: Bytes): RoleRevoked | null {
      return changetype<RoleRevoked | null>(
        store.get_in_block("RoleRevoked", id.toHexString())
      );
    }
  
    static load(id: Bytes): RoleRevoked | null {
      return changetype<RoleRevoked | null>(
        store.get("RoleRevoked", id.toHexString())
      );
    }
  
    get id(): Bytes {
      let value = this.get("id");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set id(value: Bytes) {
      this.set("id", Value.fromBytes(value));
    }
  
    get role(): Bytes {
      let value = this.get("role");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set role(value: Bytes) {
      this.set("role", Value.fromBytes(value));
    }
  
    get account(): Bytes {
      let value = this.get("account");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set account(value: Bytes) {
      this.set("account", Value.fromBytes(value));
    }
  
    get sender(): Bytes {
      let value = this.get("sender");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set sender(value: Bytes) {
      this.set("sender", Value.fromBytes(value));
    }
  
    get blockNumber(): BigInt {
      let value = this.get("blockNumber");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockNumber(value: BigInt) {
      this.set("blockNumber", Value.fromBigInt(value));
    }
  
    get blockTimestamp(): BigInt {
      let value = this.get("blockTimestamp");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockTimestamp(value: BigInt) {
      this.set("blockTimestamp", Value.fromBigInt(value));
    }
  
    get transactionHash(): Bytes {
      let value = this.get("transactionHash");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set transactionHash(value: Bytes) {
      this.set("transactionHash", Value.fromBytes(value));
    }
  }
  
  export class Transfer extends Entity {
    constructor(id: Bytes) {
      super();
      this.set("id", Value.fromBytes(id));
    }
  
    save(): void {
      let id = this.get("id");
      assert(id != null, "Cannot save Transfer entity without an ID");
      if (id) {
        assert(
          id.kind == ValueKind.BYTES,
          `Entities of type Transfer must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
        );
        store.set("Transfer", id.toBytes().toHexString(), this);
      }
    }
  
    static loadInBlock(id: Bytes): Transfer | null {
      return changetype<Transfer | null>(
        store.get_in_block("Transfer", id.toHexString())
      );
    }
  
    static load(id: Bytes): Transfer | null {
      return changetype<Transfer | null>(store.get("Transfer", id.toHexString()));
    }
  
    get id(): Bytes {
      let value = this.get("id");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set id(value: Bytes) {
      this.set("id", Value.fromBytes(value));
    }
  
    get from(): Bytes {
      let value = this.get("from");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set from(value: Bytes) {
      this.set("from", Value.fromBytes(value));
    }
  
    get to(): Bytes {
      let value = this.get("to");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set to(value: Bytes) {
      this.set("to", Value.fromBytes(value));
    }
  
    get value(): BigInt {
      let value = this.get("value");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set value(value: BigInt) {
      this.set("value", Value.fromBigInt(value));
    }
  
    get blockNumber(): BigInt {
      let value = this.get("blockNumber");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockNumber(value: BigInt) {
      this.set("blockNumber", Value.fromBigInt(value));
    }
  
    get blockTimestamp(): BigInt {
      let value = this.get("blockTimestamp");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockTimestamp(value: BigInt) {
      this.set("blockTimestamp", Value.fromBigInt(value));
    }
  
    get transactionHash(): Bytes {
      let value = this.get("transactionHash");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set transactionHash(value: Bytes) {
      this.set("transactionHash", Value.fromBytes(value));
    }
  }
  
  export class Unpaused extends Entity {
    constructor(id: Bytes) {
      super();
      this.set("id", Value.fromBytes(id));
    }
  
    save(): void {
      let id = this.get("id");
      assert(id != null, "Cannot save Unpaused entity without an ID");
      if (id) {
        assert(
          id.kind == ValueKind.BYTES,
          `Entities of type Unpaused must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
        );
        store.set("Unpaused", id.toBytes().toHexString(), this);
      }
    }
  
    static loadInBlock(id: Bytes): Unpaused | null {
      return changetype<Unpaused | null>(
        store.get_in_block("Unpaused", id.toHexString())
      );
    }
  
    static load(id: Bytes): Unpaused | null {
      return changetype<Unpaused | null>(store.get("Unpaused", id.toHexString()));
    }
  
    get id(): Bytes {
      let value = this.get("id");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set id(value: Bytes) {
      this.set("id", Value.fromBytes(value));
    }
  
    get account(): Bytes {
      let value = this.get("account");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set account(value: Bytes) {
      this.set("account", Value.fromBytes(value));
    }
  
    get blockNumber(): BigInt {
      let value = this.get("blockNumber");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockNumber(value: BigInt) {
      this.set("blockNumber", Value.fromBigInt(value));
    }
  
    get blockTimestamp(): BigInt {
      let value = this.get("blockTimestamp");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockTimestamp(value: BigInt) {
      this.set("blockTimestamp", Value.fromBigInt(value));
    }
  
    get transactionHash(): Bytes {
      let value = this.get("transactionHash");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set transactionHash(value: Bytes) {
      this.set("transactionHash", Value.fromBytes(value));
    }
  }
  
  export class Withdrawal extends Entity {
    constructor(id: Bytes) {
      super();
      this.set("id", Value.fromBytes(id));
    }
  
    save(): void {
      let id = this.get("id");
      assert(id != null, "Cannot save Withdrawal entity without an ID");
      if (id) {
        assert(
          id.kind == ValueKind.BYTES,
          `Entities of type Withdrawal must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
        );
        store.set("Withdrawal", id.toBytes().toHexString(), this);
      }
    }
  
    static loadInBlock(id: Bytes): Withdrawal | null {
      return changetype<Withdrawal | null>(
        store.get_in_block("Withdrawal", id.toHexString())
      );
    }
  
    static load(id: Bytes): Withdrawal | null {
      return changetype<Withdrawal | null>(
        store.get("Withdrawal", id.toHexString())
      );
    }
  
    get id(): Bytes {
      let value = this.get("id");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set id(value: Bytes) {
      this.set("id", Value.fromBytes(value));
    }
  
    get user(): Bytes {
      let value = this.get("user");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set user(value: Bytes) {
      this.set("user", Value.fromBytes(value));
    }
  
    get amount(): BigInt {
      let value = this.get("amount");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set amount(value: BigInt) {
      this.set("amount", Value.fromBigInt(value));
    }
  
    get asset(): Bytes {
      let value = this.get("asset");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set asset(value: Bytes) {
      this.set("asset", Value.fromBytes(value));
    }
  
    get blockNumber(): BigInt {
      let value = this.get("blockNumber");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockNumber(value: BigInt) {
      this.set("blockNumber", Value.fromBigInt(value));
    }
  
    get blockTimestamp(): BigInt {
      let value = this.get("blockTimestamp");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBigInt();
      }
    }
  
    set blockTimestamp(value: BigInt) {
      this.set("blockTimestamp", Value.fromBigInt(value));
    }
  
    get transactionHash(): Bytes {
      let value = this.get("transactionHash");
      if (!value || value.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
      } else {
        return value.toBytes();
      }
    }
  
    set transactionHash(value: Bytes) {
      this.set("transactionHash", Value.fromBytes(value));
    }
  }