import { System, Token, Base58, Space, authority, Arrays, Crypto, u128, Protobuf } from "@koinos/sdk-as";
import { dice } from "./proto/dice";

const KOIN_TOKEN_ADDR = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');
const BETS_SPACE_ID = 0x00;
const CONTRACT_PUB_KEY = Arrays.fromHexString('032c8c31fc9f990c6b55e3865a184a4ce50e09481f2eaeb3e60ec1cea13a6ae645');

export class Dice {
  contractId: Uint8Array;
  bets: Space.Space<Uint8Array, dice.bet_object>;

  constructor() {
    this.contractId = System.getContractId();

    this.bets = new Space.Space<Uint8Array, dice.bet_object>(
      this.contractId,
      BETS_SPACE_ID,
      dice.bet_object.decode,
      dice.bet_object.encode
    );
  }

  bet(args: dice.bet_arguments): dice.bet_result {
    const account = args.account!;
    const amount = args.amount;
    const value = args.value;

    // check arguments
    System.require(amount > 0, 'amount must be greater than 0');
    System.require(value > 0 && value < 6, 'value must be between 1 and 6');

    // tansfer the Koin tokens to the contract
    const token = new Token(KOIN_TOKEN_ADDR);
    System.require(token.transfer(account, this.contractId, amount), 'the Koin transfer failed');

    // get transaction id
    const txField = System.getTransactionField('id')!;
    const txId = txField.bytes_value!;

    // save bet
    const bet = new dice.bet_object(account, dice.bet_status.not_rolled, amount, value);

    this.bets.put(txId, bet);

    // Emit an event
    const event = new dice.bet_placed_event(amount, value);
    System.event('dice.bet_placed', Protobuf.encode(event, dice.bet_placed_event.encode), [account]);

    return new dice.bet_result();
  }

  roll(args: dice.roll_arguments): dice.roll_result {
    const txId = args.txId!;
    const vrf_proof = args.vrf_proof!;
    const vrf_hash = args.vrf_hash!;

    // only this contract can roll the dice
    System.requireAuthority(authority.authorization_type.contract_call, this.contractId);

    // get the bet
    const bet = this.bets.get(txId);

    System.require(bet != null, 'bet does not exist');
    System.require(bet!.status != dice.bet_status.not_rolled, 'dice has already been rolled for this bet');

    // check vrf proof
    System.require(System.verifyVRFProof(CONTRACT_PUB_KEY, vrf_proof, vrf_hash, txId), 'vrf proof is invalid');

    // roll the dice
    let mh = new Crypto.Multihash();
    mh.deserialize(vrf_hash);
    const random = u128.fromBytes(mh.digest, true);

    // @ts-ignore this calculation is valid
    const result: u128 = random % u128.from(6) + u128.from(1);

    // if the user won
    if (bet!.value == result.toU32()) {
      // tansfer the Koin tokens to the user
      const token = new Token(KOIN_TOKEN_ADDR);
      System.require(token.transfer(this.contractId, bet!.account!, bet!.amount * 2), 'the Koin transfer failed');
      
      // update bet
      bet!.status = dice.bet_status.won;
    } else {
      // update bet
      bet!.status = dice.bet_status.lost;
    }

    this.bets.put(txId, bet!);

    // Emit an event
    const event = new dice.dice_rolled_event(bet!.status);
    System.event('dice.dice_rolled', Protobuf.encode(event, dice.dice_rolled_event.encode), [bet!.account!]);

    return new dice.roll_result();
  }

  get_bet(args: dice.get_bet_arguments): dice.get_bet_result {
    const txId = args.txId!;

    const res = new dice.get_bet_result();

    const bet = this.bets.get(txId);

    if (!bet) {
      res.bet = bet;
    }

    return res;
  }
}
