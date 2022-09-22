import { System } from "@koinos/sdk-as";
import { dice } from "./proto/dice";

export class Dice {
  hello(args: dice.hello_arguments): dice.hello_result {
    const name = args.name!;

    const res = new dice.hello_result();
    res.value = `Hello, ${name}!`;

    System.log(res.value!);

    return res;
  }
}
