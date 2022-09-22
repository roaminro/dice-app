import { Writer, Reader } from "as-proto";

export namespace dice {
  export class hello_arguments {
    static encode(message: hello_arguments, writer: Writer): void {
      const unique_name_name = message.name;
      if (unique_name_name !== null) {
        writer.uint32(10);
        writer.string(unique_name_name);
      }
    }

    static decode(reader: Reader, length: i32): hello_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new hello_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.name = reader.string();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    name: string | null;

    constructor(name: string | null = null) {
      this.name = name;
    }
  }

  export class hello_result {
    static encode(message: hello_result, writer: Writer): void {
      const unique_name_value = message.value;
      if (unique_name_value !== null) {
        writer.uint32(10);
        writer.string(unique_name_value);
      }
    }

    static decode(reader: Reader, length: i32): hello_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new hello_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value = reader.string();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: string | null;

    constructor(value: string | null = null) {
      this.value = value;
    }
  }
}
