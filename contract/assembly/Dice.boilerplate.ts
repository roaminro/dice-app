import { System, Protobuf, authority } from "@koinos/sdk-as";
import { dice } from "./proto/dice";

export class Dice {
  hello(args: dice.hello_arguments): dice.hello_result {
    // const name = args.name;

    // YOUR CODE HERE

    const res = new dice.hello_result();
    // res.value = ;

    return res;
  }
}
