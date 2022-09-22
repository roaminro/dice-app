import { Writer, Reader } from "as-proto";

export namespace dice {
  export class bet_arguments {
    static encode(message: bet_arguments, writer: Writer): void {
      const unique_name_account = message.account;
      if (unique_name_account !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_account);
      }

      if (message.amount != 0) {
        writer.uint32(16);
        writer.uint64(message.amount);
      }

      if (message.value != 0) {
        writer.uint32(24);
        writer.uint32(message.value);
      }
    }

    static decode(reader: Reader, length: i32): bet_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new bet_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.account = reader.bytes();
            break;

          case 2:
            message.amount = reader.uint64();
            break;

          case 3:
            message.value = reader.uint32();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    account: Uint8Array | null;
    amount: u64;
    value: u32;

    constructor(
      account: Uint8Array | null = null,
      amount: u64 = 0,
      value: u32 = 0
    ) {
      this.account = account;
      this.amount = amount;
      this.value = value;
    }
  }

  @unmanaged
  export class bet_result {
    static encode(message: bet_result, writer: Writer): void {}

    static decode(reader: Reader, length: i32): bet_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new bet_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    constructor() {}
  }

  export class roll_arguments {
    static encode(message: roll_arguments, writer: Writer): void {
      const unique_name_txId = message.txId;
      if (unique_name_txId !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_txId);
      }

      const unique_name_vrf_proof = message.vrf_proof;
      if (unique_name_vrf_proof !== null) {
        writer.uint32(18);
        writer.bytes(unique_name_vrf_proof);
      }

      const unique_name_vrf_hash = message.vrf_hash;
      if (unique_name_vrf_hash !== null) {
        writer.uint32(26);
        writer.bytes(unique_name_vrf_hash);
      }
    }

    static decode(reader: Reader, length: i32): roll_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new roll_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.txId = reader.bytes();
            break;

          case 2:
            message.vrf_proof = reader.bytes();
            break;

          case 3:
            message.vrf_hash = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    txId: Uint8Array | null;
    vrf_proof: Uint8Array | null;
    vrf_hash: Uint8Array | null;

    constructor(
      txId: Uint8Array | null = null,
      vrf_proof: Uint8Array | null = null,
      vrf_hash: Uint8Array | null = null
    ) {
      this.txId = txId;
      this.vrf_proof = vrf_proof;
      this.vrf_hash = vrf_hash;
    }
  }

  @unmanaged
  export class roll_result {
    static encode(message: roll_result, writer: Writer): void {}

    static decode(reader: Reader, length: i32): roll_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new roll_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    constructor() {}
  }

  export class get_bet_arguments {
    static encode(message: get_bet_arguments, writer: Writer): void {
      const unique_name_txId = message.txId;
      if (unique_name_txId !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_txId);
      }
    }

    static decode(reader: Reader, length: i32): get_bet_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_bet_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.txId = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    txId: Uint8Array | null;

    constructor(txId: Uint8Array | null = null) {
      this.txId = txId;
    }
  }

  export class get_bet_result {
    static encode(message: get_bet_result, writer: Writer): void {
      const unique_name_bet = message.bet;
      if (unique_name_bet !== null) {
        writer.uint32(10);
        writer.fork();
        bet_object.encode(unique_name_bet, writer);
        writer.ldelim();
      }
    }

    static decode(reader: Reader, length: i32): get_bet_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_bet_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.bet = bet_object.decode(reader, reader.uint32());
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    bet: bet_object | null;

    constructor(bet: bet_object | null = null) {
      this.bet = bet;
    }
  }

  @unmanaged
  export class bet_placed_event {
    static encode(message: bet_placed_event, writer: Writer): void {
      if (message.amount != 0) {
        writer.uint32(8);
        writer.uint64(message.amount);
      }

      if (message.value != 0) {
        writer.uint32(16);
        writer.uint32(message.value);
      }
    }

    static decode(reader: Reader, length: i32): bet_placed_event {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new bet_placed_event();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.amount = reader.uint64();
            break;

          case 2:
            message.value = reader.uint32();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    amount: u64;
    value: u32;

    constructor(amount: u64 = 0, value: u32 = 0) {
      this.amount = amount;
      this.value = value;
    }
  }

  @unmanaged
  export class dice_rolled_event {
    static encode(message: dice_rolled_event, writer: Writer): void {
      if (message.status != 0) {
        writer.uint32(8);
        writer.int32(message.status);
      }
    }

    static decode(reader: Reader, length: i32): dice_rolled_event {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new dice_rolled_event();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.status = reader.int32();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    status: bet_status;

    constructor(status: bet_status = 0) {
      this.status = status;
    }
  }

  export class bet_object {
    static encode(message: bet_object, writer: Writer): void {
      const unique_name_account = message.account;
      if (unique_name_account !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_account);
      }

      if (message.status != 0) {
        writer.uint32(16);
        writer.int32(message.status);
      }

      if (message.amount != 0) {
        writer.uint32(24);
        writer.uint64(message.amount);
      }

      if (message.value != 0) {
        writer.uint32(32);
        writer.uint32(message.value);
      }
    }

    static decode(reader: Reader, length: i32): bet_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new bet_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.account = reader.bytes();
            break;

          case 2:
            message.status = reader.int32();
            break;

          case 3:
            message.amount = reader.uint64();
            break;

          case 4:
            message.value = reader.uint32();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    account: Uint8Array | null;
    status: bet_status;
    amount: u64;
    value: u32;

    constructor(
      account: Uint8Array | null = null,
      status: bet_status = 0,
      amount: u64 = 0,
      value: u32 = 0
    ) {
      this.account = account;
      this.status = status;
      this.amount = amount;
      this.value = value;
    }
  }

  export enum bet_status {
    not_rolled = 0,
    won = 1,
    lost = 2,
  }
}
