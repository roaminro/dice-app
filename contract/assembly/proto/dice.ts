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
      const unique_name_tx_id = message.tx_id;
      if (unique_name_tx_id !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_tx_id);
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
            message.tx_id = reader.bytes();
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

    tx_id: Uint8Array | null;
    vrf_proof: Uint8Array | null;
    vrf_hash: Uint8Array | null;

    constructor(
      tx_id: Uint8Array | null = null,
      vrf_proof: Uint8Array | null = null,
      vrf_hash: Uint8Array | null = null
    ) {
      this.tx_id = tx_id;
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
      const unique_name_tx_id = message.tx_id;
      if (unique_name_tx_id !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_tx_id);
      }
    }

    static decode(reader: Reader, length: i32): get_bet_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_bet_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.tx_id = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    tx_id: Uint8Array | null;

    constructor(tx_id: Uint8Array | null = null) {
      this.tx_id = tx_id;
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

  export class get_history_arguments {
    static encode(message: get_history_arguments, writer: Writer): void {
      const unique_name_account = message.account;
      if (unique_name_account !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_account);
      }
    }

    static decode(reader: Reader, length: i32): get_history_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_history_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.account = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    account: Uint8Array | null;

    constructor(account: Uint8Array | null = null) {
      this.account = account;
    }
  }

  export class get_history_result {
    static encode(message: get_history_result, writer: Writer): void {
      const unique_name_history = message.history;
      if (unique_name_history !== null) {
        writer.uint32(10);
        writer.fork();
        history_object.encode(unique_name_history, writer);
        writer.ldelim();
      }
    }

    static decode(reader: Reader, length: i32): get_history_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_history_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.history = history_object.decode(reader, reader.uint32());
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    history: history_object | null;

    constructor(history: history_object | null = null) {
      this.history = history;
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

      if (message.roll != 0) {
        writer.uint32(16);
        writer.uint32(message.roll);
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

          case 2:
            message.roll = reader.uint32();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    status: bet_status;
    roll: u32;

    constructor(status: bet_status = 0, roll: u32 = 0) {
      this.status = status;
      this.roll = roll;
    }
  }

  export class bet_object {
    static encode(message: bet_object, writer: Writer): void {
      const unique_name_tx_id = message.tx_id;
      if (unique_name_tx_id !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_tx_id);
      }

      const unique_name_account = message.account;
      if (unique_name_account !== null) {
        writer.uint32(18);
        writer.bytes(unique_name_account);
      }

      if (message.status != 0) {
        writer.uint32(24);
        writer.int32(message.status);
      }

      if (message.amount != 0) {
        writer.uint32(32);
        writer.uint64(message.amount);
      }

      if (message.value != 0) {
        writer.uint32(40);
        writer.uint32(message.value);
      }

      if (message.roll != 0) {
        writer.uint32(48);
        writer.uint32(message.roll);
      }

      const unique_name_vrf_proof = message.vrf_proof;
      if (unique_name_vrf_proof !== null) {
        writer.uint32(58);
        writer.bytes(unique_name_vrf_proof);
      }

      const unique_name_vrf_hash = message.vrf_hash;
      if (unique_name_vrf_hash !== null) {
        writer.uint32(66);
        writer.bytes(unique_name_vrf_hash);
      }

      const unique_name_roll_tx_id = message.roll_tx_id;
      if (unique_name_roll_tx_id !== null) {
        writer.uint32(74);
        writer.bytes(unique_name_roll_tx_id);
      }

      if (message.timestamp != 0) {
        writer.uint32(80);
        writer.uint64(message.timestamp);
      }
    }

    static decode(reader: Reader, length: i32): bet_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new bet_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.tx_id = reader.bytes();
            break;

          case 2:
            message.account = reader.bytes();
            break;

          case 3:
            message.status = reader.int32();
            break;

          case 4:
            message.amount = reader.uint64();
            break;

          case 5:
            message.value = reader.uint32();
            break;

          case 6:
            message.roll = reader.uint32();
            break;

          case 7:
            message.vrf_proof = reader.bytes();
            break;

          case 8:
            message.vrf_hash = reader.bytes();
            break;

          case 9:
            message.roll_tx_id = reader.bytes();
            break;

          case 10:
            message.timestamp = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    tx_id: Uint8Array | null;
    account: Uint8Array | null;
    status: bet_status;
    amount: u64;
    value: u32;
    roll: u32;
    vrf_proof: Uint8Array | null;
    vrf_hash: Uint8Array | null;
    roll_tx_id: Uint8Array | null;
    timestamp: u64;

    constructor(
      tx_id: Uint8Array | null = null,
      account: Uint8Array | null = null,
      status: bet_status = 0,
      amount: u64 = 0,
      value: u32 = 0,
      roll: u32 = 0,
      vrf_proof: Uint8Array | null = null,
      vrf_hash: Uint8Array | null = null,
      roll_tx_id: Uint8Array | null = null,
      timestamp: u64 = 0
    ) {
      this.tx_id = tx_id;
      this.account = account;
      this.status = status;
      this.amount = amount;
      this.value = value;
      this.roll = roll;
      this.vrf_proof = vrf_proof;
      this.vrf_hash = vrf_hash;
      this.roll_tx_id = roll_tx_id;
      this.timestamp = timestamp;
    }
  }

  export class history_object {
    static encode(message: history_object, writer: Writer): void {
      const unique_name_tx_ids = message.tx_ids;
      if (unique_name_tx_ids.length !== 0) {
        for (let i = 0; i < unique_name_tx_ids.length; ++i) {
          writer.uint32(10);
          writer.bytes(unique_name_tx_ids[i]);
        }
      }
    }

    static decode(reader: Reader, length: i32): history_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new history_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.tx_ids.push(reader.bytes());
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    tx_ids: Array<Uint8Array>;

    constructor(tx_ids: Array<Uint8Array> = []) {
      this.tx_ids = tx_ids;
    }
  }

  export enum bet_status {
    not_rolled = 0,
    won = 1,
    lost = 2,
  }
}
