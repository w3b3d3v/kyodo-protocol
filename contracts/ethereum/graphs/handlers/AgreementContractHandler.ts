import {
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
} from "@graphprotocol/graph-ts";

export class AgreementCreated extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save AgreementCreated entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type AgreementCreated must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("AgreementCreated", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): AgreementCreated | null {
    return changetype<AgreementCreated | null>(
      store.get_in_block("AgreementCreated", id.toHexString())
    );
  }

  static load(id: Bytes): AgreementCreated | null {
    return changetype<AgreementCreated | null>(
      store.get("AgreementCreated", id.toHexString())
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

  get company(): Bytes {
    let value = this.get("company");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set company(value: Bytes) {
    this.set("company", Value.fromBytes(value));
  }

  get professional(): Bytes {
    let value = this.get("professional");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set professional(value: Bytes) {
    this.set("professional", Value.fromBytes(value));
  }

  get agreementId(): BigInt {
    let value = this.get("agreementId");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set agreementId(value: BigInt) {
    this.set("agreementId", Value.fromBigInt(value));
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

export class PaymentMade extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save PaymentMade entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type PaymentMade must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("PaymentMade", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): PaymentMade | null {
    return changetype<PaymentMade | null>(
      store.get_in_block("PaymentMade", id.toHexString())
    );
  }

  static load(id: Bytes): PaymentMade | null {
    return changetype<PaymentMade | null>(
      store.get("PaymentMade", id.toHexString())
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

  get company(): Bytes {
    let value = this.get("company");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set company(value: Bytes) {
    this.set("company", Value.fromBytes(value));
  }

  get professional(): Bytes {
    let value = this.get("professional");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set professional(value: Bytes) {
    this.set("professional", Value.fromBytes(value));
  }

  get agreementId(): BigInt {
    let value = this.get("agreementId");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set agreementId(value: BigInt) {
    this.set("agreementId", Value.fromBigInt(value));
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
