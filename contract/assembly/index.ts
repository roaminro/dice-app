import { System, Protobuf, authority } from "@koinos/sdk-as";
import { Dice as ContractClass } from "./Dice";
import { dice as ProtoNamespace } from "./proto/dice";

export function main(): i32 {
  const contractArgs = System.getArguments();
  let retbuf = new Uint8Array(1024);

  const c = new ContractClass();

  switch (contractArgs.entry_point) {
    case 0x2cf24dba: {
      const args = Protobuf.decode<ProtoNamespace.hello_arguments>(
        contractArgs.args,
        ProtoNamespace.hello_arguments.decode
      );
      const res = c.hello(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.hello_result.encode);
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
