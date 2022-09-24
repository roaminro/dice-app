import { System, Protobuf, authority } from "@koinos/sdk-as";
import { Dice as ContractClass } from "./Dice";
import { dice as ProtoNamespace } from "./proto/dice";

export function main(): i32 {
  const contractArgs = System.getArguments();
  let retbuf = new Uint8Array(1024);

  const c = new ContractClass();

  switch (contractArgs.entry_point) {
    case 0x0ae467cc: {
      const args = Protobuf.decode<ProtoNamespace.bet_arguments>(
        contractArgs.args,
        ProtoNamespace.bet_arguments.decode
      );
      const res = c.bet(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.bet_result.encode);
      break;
    }

    case 0xacfe1fec: {
      const args = Protobuf.decode<ProtoNamespace.roll_arguments>(
        contractArgs.args,
        ProtoNamespace.roll_arguments.decode
      );
      const res = c.roll(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.roll_result.encode);
      break;
    }

    case 0x26004391: {
      const args = Protobuf.decode<ProtoNamespace.get_bet_arguments>(
        contractArgs.args,
        ProtoNamespace.get_bet_arguments.decode
      );
      const res = c.get_bet(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.get_bet_result.encode);
      break;
    }

    case 0x0154a749: {
      const args = Protobuf.decode<ProtoNamespace.get_history_arguments>(
        contractArgs.args,
        ProtoNamespace.get_history_arguments.decode
      );
      const res = c.get_history(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.get_history_result.encode);
      break;
    }

    default:
      System.exit(1);
      break;
  }

  System.exit(0, retbuf);
  return 0;
}

main();
