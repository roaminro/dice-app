import { System, Protobuf, authority } from "@koinos/sdk-as";
import { dice } from "./proto/dice";

export class Dice {
  bet(args: dice.bet_arguments): dice.bet_result {
    // const account = args.account;
    // const amount = args.amount;
    // const value = args.value;

    // YOUR CODE HERE

    const res = new dice.bet_result();

    return res;
  }

  roll(args: dice.roll_arguments): dice.roll_result {
    // const tx_id = args.tx_id;
    // const vrf_proof = args.vrf_proof;
    // const vrf_hash = args.vrf_hash;

    // YOUR CODE HERE

    const res = new dice.roll_result();

    return res;
  }

  get_bet(args: dice.get_bet_arguments): dice.get_bet_result {
    // const tx_id = args.tx_id;

    // YOUR CODE HERE

    const res = new dice.get_bet_result();
    // res.bet = ;

    return res;
  }

  get_history(args: dice.get_history_arguments): dice.get_history_result {
    // const account = args.account;

    // YOUR CODE HERE

    const res = new dice.get_history_result();
    // res.history = ;

    return res;
  }
}
