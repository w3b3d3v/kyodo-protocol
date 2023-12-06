// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class AgreementCreated extends ethereum.Event {
  get params(): AgreementCreated__Params {
    return new AgreementCreated__Params(this);
  }
}

export class AgreementCreated__Params {
  _event: AgreementCreated;

  constructor(event: AgreementCreated) {
    this._event = event;
  }

  get company(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get professional(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get agreementId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class PaymentMade extends ethereum.Event {
  get params(): PaymentMade__Params {
    return new PaymentMade__Params(this);
  }
}

export class PaymentMade__Params {
  _event: PaymentMade;

  constructor(event: PaymentMade) {
    this._event = event;
  }

  get company(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get professional(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get agreementId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class AgreementContract__agreementsResultTokenIncentiveStruct extends ethereum.Tuple {
  get amount(): BigInt {
    return this[0].toBigInt();
  }

  get tokenAddress(): Address {
    return this[1].toAddress();
  }
}

export class AgreementContract__agreementsResultPaymentStruct extends ethereum.Tuple {
  get amount(): BigInt {
    return this[0].toBigInt();
  }

  get tokenAddress(): Address {
    return this[1].toAddress();
  }
}

export class AgreementContract__agreementsResult {
  value0: BigInt;
  value1: string;
  value2: string;
  value3: i32;
  value4: Address;
  value5: Address;
  value6: AgreementContract__agreementsResultTokenIncentiveStruct;
  value7: AgreementContract__agreementsResultPaymentStruct;
  value8: BigInt;

  constructor(
    value0: BigInt,
    value1: string,
    value2: string,
    value3: i32,
    value4: Address,
    value5: Address,
    value6: AgreementContract__agreementsResultTokenIncentiveStruct,
    value7: AgreementContract__agreementsResultPaymentStruct,
    value8: BigInt
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
    this.value6 = value6;
    this.value7 = value7;
    this.value8 = value8;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromString(this.value1));
    map.set("value2", ethereum.Value.fromString(this.value2));
    map.set(
      "value3",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value3))
    );
    map.set("value4", ethereum.Value.fromAddress(this.value4));
    map.set("value5", ethereum.Value.fromAddress(this.value5));
    map.set("value6", ethereum.Value.fromTuple(this.value6));
    map.set("value7", ethereum.Value.fromTuple(this.value7));
    map.set("value8", ethereum.Value.fromUnsignedBigInt(this.value8));
    return map;
  }

  getId(): BigInt {
    return this.value0;
  }

  getTitle(): string {
    return this.value1;
  }

  getDescription(): string {
    return this.value2;
  }

  getStatus(): i32 {
    return this.value3;
  }

  getCompany(): Address {
    return this.value4;
  }

  getProfessional(): Address {
    return this.value5;
  }

  getTokenIncentive(): AgreementContract__agreementsResultTokenIncentiveStruct {
    return this.value6;
  }

  getPayment(): AgreementContract__agreementsResultPaymentStruct {
    return this.value7;
  }

  getTotalPaid(): BigInt {
    return this.value8;
  }
}

export class AgreementContract__getAgreementByIdResultValue0Struct extends ethereum.Tuple {
  get id(): BigInt {
    return this[0].toBigInt();
  }

  get title(): string {
    return this[1].toString();
  }

  get description(): string {
    return this[2].toString();
  }

  get status(): i32 {
    return this[3].toI32();
  }

  get company(): Address {
    return this[4].toAddress();
  }

  get professional(): Address {
    return this[5].toAddress();
  }

  get skills(): Array<string> {
    return this[6].toStringArray();
  }

  get tokenIncentive(): AgreementContract__getAgreementByIdResultValue0TokenIncentiveStruct {
    return changetype<
      AgreementContract__getAgreementByIdResultValue0TokenIncentiveStruct
    >(this[7].toTuple());
  }

  get payment(): AgreementContract__getAgreementByIdResultValue0PaymentStruct {
    return changetype<
      AgreementContract__getAgreementByIdResultValue0PaymentStruct
    >(this[8].toTuple());
  }

  get totalPaid(): BigInt {
    return this[9].toBigInt();
  }
}

export class AgreementContract__getAgreementByIdResultValue0TokenIncentiveStruct extends ethereum.Tuple {
  get amount(): BigInt {
    return this[0].toBigInt();
  }

  get tokenAddress(): Address {
    return this[1].toAddress();
  }
}

export class AgreementContract__getAgreementByIdResultValue0PaymentStruct extends ethereum.Tuple {
  get amount(): BigInt {
    return this[0].toBigInt();
  }

  get tokenAddress(): Address {
    return this[1].toAddress();
  }
}

export class AgreementContract__getAllAgreementsResultValue0Struct extends ethereum.Tuple {
  get id(): BigInt {
    return this[0].toBigInt();
  }

  get title(): string {
    return this[1].toString();
  }

  get description(): string {
    return this[2].toString();
  }

  get status(): i32 {
    return this[3].toI32();
  }

  get company(): Address {
    return this[4].toAddress();
  }

  get professional(): Address {
    return this[5].toAddress();
  }

  get skills(): Array<string> {
    return this[6].toStringArray();
  }

  get tokenIncentive(): AgreementContract__getAllAgreementsResultValue0TokenIncentiveStruct {
    return changetype<
      AgreementContract__getAllAgreementsResultValue0TokenIncentiveStruct
    >(this[7].toTuple());
  }

  get payment(): AgreementContract__getAllAgreementsResultValue0PaymentStruct {
    return changetype<
      AgreementContract__getAllAgreementsResultValue0PaymentStruct
    >(this[8].toTuple());
  }

  get totalPaid(): BigInt {
    return this[9].toBigInt();
  }
}

export class AgreementContract__getAllAgreementsResultValue0TokenIncentiveStruct extends ethereum.Tuple {
  get amount(): BigInt {
    return this[0].toBigInt();
  }

  get tokenAddress(): Address {
    return this[1].toAddress();
  }
}

export class AgreementContract__getAllAgreementsResultValue0PaymentStruct extends ethereum.Tuple {
  get amount(): BigInt {
    return this[0].toBigInt();
  }

  get tokenAddress(): Address {
    return this[1].toAddress();
  }
}

export class AgreementContract__tokenIncentiveResult {
  value0: BigInt;
  value1: Address;

  constructor(value0: BigInt, value1: Address) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromAddress(this.value1));
    return map;
  }

  getAmount(): BigInt {
    return this.value0;
  }

  getTokenAddress(): Address {
    return this.value1;
  }
}

export class AgreementContract extends ethereum.SmartContract {
  static bind(address: Address): AgreementContract {
    return new AgreementContract("AgreementContract", address);
  }

  StableVault(): Address {
    let result = super.call("StableVault", "StableVault():(address)", []);

    return result[0].toAddress();
  }

  try_StableVault(): ethereum.CallResult<Address> {
    let result = super.tryCall("StableVault", "StableVault():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  acceptedPaymentTokens(param0: Address): boolean {
    let result = super.call(
      "acceptedPaymentTokens",
      "acceptedPaymentTokens(address):(bool)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toBoolean();
  }

  try_acceptedPaymentTokens(param0: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "acceptedPaymentTokens",
      "acceptedPaymentTokens(address):(bool)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  agreements(param0: BigInt): AgreementContract__agreementsResult {
    let result = super.call(
      "agreements",
      "agreements(uint256):(uint256,string,string,uint8,address,address,(uint256,address),(uint256,address),uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new AgreementContract__agreementsResult(
      result[0].toBigInt(),
      result[1].toString(),
      result[2].toString(),
      result[3].toI32(),
      result[4].toAddress(),
      result[5].toAddress(),
      changetype<AgreementContract__agreementsResultTokenIncentiveStruct>(
        result[6].toTuple()
      ),
      changetype<AgreementContract__agreementsResultPaymentStruct>(
        result[7].toTuple()
      ),
      result[8].toBigInt()
    );
  }

  try_agreements(
    param0: BigInt
  ): ethereum.CallResult<AgreementContract__agreementsResult> {
    let result = super.tryCall(
      "agreements",
      "agreements(uint256):(uint256,string,string,uint8,address,address,(uint256,address),(uint256,address),uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new AgreementContract__agreementsResult(
        value[0].toBigInt(),
        value[1].toString(),
        value[2].toString(),
        value[3].toI32(),
        value[4].toAddress(),
        value[5].toAddress(),
        changetype<AgreementContract__agreementsResultTokenIncentiveStruct>(
          value[6].toTuple()
        ),
        changetype<AgreementContract__agreementsResultPaymentStruct>(
          value[7].toTuple()
        ),
        value[8].toBigInt()
      )
    );
  }

  communityDAO(): Address {
    let result = super.call("communityDAO", "communityDAO():(address)", []);

    return result[0].toAddress();
  }

  try_communityDAO(): ethereum.CallResult<Address> {
    let result = super.tryCall("communityDAO", "communityDAO():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  communityDAOFee(): BigInt {
    let result = super.call(
      "communityDAOFee",
      "communityDAOFee():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_communityDAOFee(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "communityDAOFee",
      "communityDAOFee():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  feePercentage(): BigInt {
    let result = super.call("feePercentage", "feePercentage():(uint256)", []);

    return result[0].toBigInt();
  }

  try_feePercentage(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "feePercentage",
      "feePercentage():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getAgreementById(
    _id: BigInt
  ): AgreementContract__getAgreementByIdResultValue0Struct {
    let result = super.call(
      "getAgreementById",
      "getAgreementById(uint256):((uint256,string,string,uint8,address,address,string[],(uint256,address),(uint256,address),uint256))",
      [ethereum.Value.fromUnsignedBigInt(_id)]
    );

    return changetype<AgreementContract__getAgreementByIdResultValue0Struct>(
      result[0].toTuple()
    );
  }

  try_getAgreementById(
    _id: BigInt
  ): ethereum.CallResult<
    AgreementContract__getAgreementByIdResultValue0Struct
  > {
    let result = super.tryCall(
      "getAgreementById",
      "getAgreementById(uint256):((uint256,string,string,uint8,address,address,string[],(uint256,address),(uint256,address),uint256))",
      [ethereum.Value.fromUnsignedBigInt(_id)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<AgreementContract__getAgreementByIdResultValue0Struct>(
        value[0].toTuple()
      )
    );
  }

  getAgreementCount(): BigInt {
    let result = super.call(
      "getAgreementCount",
      "getAgreementCount():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_getAgreementCount(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getAgreementCount",
      "getAgreementCount():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getAllAgreements(): Array<
    AgreementContract__getAllAgreementsResultValue0Struct
  > {
    let result = super.call(
      "getAllAgreements",
      "getAllAgreements():((uint256,string,string,uint8,address,address,string[],(uint256,address),(uint256,address),uint256)[])",
      []
    );

    return result[0].toTupleArray<
      AgreementContract__getAllAgreementsResultValue0Struct
    >();
  }

  try_getAllAgreements(): ethereum.CallResult<
    Array<AgreementContract__getAllAgreementsResultValue0Struct>
  > {
    let result = super.tryCall(
      "getAllAgreements",
      "getAllAgreements():((uint256,string,string,uint8,address,address,string[],(uint256,address),(uint256,address),uint256)[])",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      value[0].toTupleArray<
        AgreementContract__getAllAgreementsResultValue0Struct
      >()
    );
  }

  getUserAgreements(_user: Address): Array<BigInt> {
    let result = super.call(
      "getUserAgreements",
      "getUserAgreements(address):(uint256[])",
      [ethereum.Value.fromAddress(_user)]
    );

    return result[0].toBigIntArray();
  }

  try_getUserAgreements(_user: Address): ethereum.CallResult<Array<BigInt>> {
    let result = super.tryCall(
      "getUserAgreements",
      "getUserAgreements(address):(uint256[])",
      [ethereum.Value.fromAddress(_user)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigIntArray());
  }

  kyodoTreasury(): Address {
    let result = super.call("kyodoTreasury", "kyodoTreasury():(address)", []);

    return result[0].toAddress();
  }

  try_kyodoTreasury(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "kyodoTreasury",
      "kyodoTreasury():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  kyodoTreasuryFee(): BigInt {
    let result = super.call(
      "kyodoTreasuryFee",
      "kyodoTreasuryFee():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_kyodoTreasuryFee(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "kyodoTreasuryFee",
      "kyodoTreasuryFee():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  nextAgreementId(): BigInt {
    let result = super.call(
      "nextAgreementId",
      "nextAgreementId():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_nextAgreementId(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "nextAgreementId",
      "nextAgreementId():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  tokenIncentive(): AgreementContract__tokenIncentiveResult {
    let result = super.call(
      "tokenIncentive",
      "tokenIncentive():(uint256,address)",
      []
    );

    return new AgreementContract__tokenIncentiveResult(
      result[0].toBigInt(),
      result[1].toAddress()
    );
  }

  try_tokenIncentive(): ethereum.CallResult<
    AgreementContract__tokenIncentiveResult
  > {
    let result = super.tryCall(
      "tokenIncentive",
      "tokenIncentive():(uint256,address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new AgreementContract__tokenIncentiveResult(
        value[0].toBigInt(),
        value[1].toAddress()
      )
    );
  }

  userAgreements(param0: Address, param1: BigInt): BigInt {
    let result = super.call(
      "userAgreements",
      "userAgreements(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return result[0].toBigInt();
  }

  try_userAgreements(
    param0: Address,
    param1: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "userAgreements",
      "userAgreements(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _kyodoTreasury(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _communityDAO(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class AddAcceptedPaymentTokenCall extends ethereum.Call {
  get inputs(): AddAcceptedPaymentTokenCall__Inputs {
    return new AddAcceptedPaymentTokenCall__Inputs(this);
  }

  get outputs(): AddAcceptedPaymentTokenCall__Outputs {
    return new AddAcceptedPaymentTokenCall__Outputs(this);
  }
}

export class AddAcceptedPaymentTokenCall__Inputs {
  _call: AddAcceptedPaymentTokenCall;

  constructor(call: AddAcceptedPaymentTokenCall) {
    this._call = call;
  }

  get _tokenAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class AddAcceptedPaymentTokenCall__Outputs {
  _call: AddAcceptedPaymentTokenCall;

  constructor(call: AddAcceptedPaymentTokenCall) {
    this._call = call;
  }
}

export class CreateAgreementCall extends ethereum.Call {
  get inputs(): CreateAgreementCall__Inputs {
    return new CreateAgreementCall__Inputs(this);
  }

  get outputs(): CreateAgreementCall__Outputs {
    return new CreateAgreementCall__Outputs(this);
  }
}

export class CreateAgreementCall__Inputs {
  _call: CreateAgreementCall;

  constructor(call: CreateAgreementCall) {
    this._call = call;
  }

  get _title(): string {
    return this._call.inputValues[0].value.toString();
  }

  get _description(): string {
    return this._call.inputValues[1].value.toString();
  }

  get _professional(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _skills(): Array<string> {
    return this._call.inputValues[3].value.toStringArray();
  }

  get _paymentAmount(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }
}

export class CreateAgreementCall__Outputs {
  _call: CreateAgreementCall;

  constructor(call: CreateAgreementCall) {
    this._call = call;
  }
}

export class MakePaymentCall extends ethereum.Call {
  get inputs(): MakePaymentCall__Inputs {
    return new MakePaymentCall__Inputs(this);
  }

  get outputs(): MakePaymentCall__Outputs {
    return new MakePaymentCall__Outputs(this);
  }
}

export class MakePaymentCall__Inputs {
  _call: MakePaymentCall;

  constructor(call: MakePaymentCall) {
    this._call = call;
  }

  get _agreementId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _amountToPay(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _paymentAddress(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class MakePaymentCall__Outputs {
  _call: MakePaymentCall;

  constructor(call: MakePaymentCall) {
    this._call = call;
  }
}

export class SetFeesCall extends ethereum.Call {
  get inputs(): SetFeesCall__Inputs {
    return new SetFeesCall__Inputs(this);
  }

  get outputs(): SetFeesCall__Outputs {
    return new SetFeesCall__Outputs(this);
  }
}

export class SetFeesCall__Inputs {
  _call: SetFeesCall;

  constructor(call: SetFeesCall) {
    this._call = call;
  }

  get _feePercentage(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _kyodoTreasuryFee(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _communityDAOFee(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class SetFeesCall__Outputs {
  _call: SetFeesCall;

  constructor(call: SetFeesCall) {
    this._call = call;
  }
}

export class SetStableVaultAddressCall extends ethereum.Call {
  get inputs(): SetStableVaultAddressCall__Inputs {
    return new SetStableVaultAddressCall__Inputs(this);
  }

  get outputs(): SetStableVaultAddressCall__Outputs {
    return new SetStableVaultAddressCall__Outputs(this);
  }
}

export class SetStableVaultAddressCall__Inputs {
  _call: SetStableVaultAddressCall;

  constructor(call: SetStableVaultAddressCall) {
    this._call = call;
  }

  get _StableVaultAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetStableVaultAddressCall__Outputs {
  _call: SetStableVaultAddressCall;

  constructor(call: SetStableVaultAddressCall) {
    this._call = call;
  }
}

export class UpdateTokenIncentiveCall extends ethereum.Call {
  get inputs(): UpdateTokenIncentiveCall__Inputs {
    return new UpdateTokenIncentiveCall__Inputs(this);
  }

  get outputs(): UpdateTokenIncentiveCall__Outputs {
    return new UpdateTokenIncentiveCall__Outputs(this);
  }
}

export class UpdateTokenIncentiveCall__Inputs {
  _call: UpdateTokenIncentiveCall;

  constructor(call: UpdateTokenIncentiveCall) {
    this._call = call;
  }

  get _newTokenAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _newAmount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class UpdateTokenIncentiveCall__Outputs {
  _call: UpdateTokenIncentiveCall;

  constructor(call: UpdateTokenIncentiveCall) {
    this._call = call;
  }
}