import { System, Token, Base58, Space, authority, Crypto, u128, Protobuf, Base64 } from "@koinos/sdk-as";
import { dice } from "./proto/dice";

const KOIN_TOKEN_ADDR = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');
const CONTRACT_PUB_KEY = Base64.decode('AsUVdQkJaKITavUj5-IyoC0xMYejCu1lpzSr30YVLJrM');

const BETS_SPACE_ID = 0;
const HISTORY_SPACE_ID = 1;
const GLOBAL_HISTORY_KEY = new Uint8Array(0);

const USER_HISTORY_SIZE = 20;
const GLOBAL_HISTORY_SIZE = 50;

export class Dice {
  contractId: Uint8Array;
  betsSpace: Space.Space<Uint8Array, dice.bet_object>;
  historySpace: Space.Space<Uint8Array, dice.history_object>;

  constructor() {
    this.contractId = System.getContractId();

    this.betsSpace = new Space.Space<Uint8Array, dice.bet_object>(
      this.contractId,
      BETS_SPACE_ID,
      dice.bet_object.decode,
      dice.bet_object.encode
    );

    this.historySpace = new Space.Space<Uint8Array, dice.history_object>(
      this.contractId,
      HISTORY_SPACE_ID,
      dice.history_object.decode,
      dice.history_object.encode
    );
  }

  addBetToHistory(account: Uint8Array, txId: Uint8Array, max: i32): void {
    // only keep history of the last X bets for the user
    let history = this.historySpace.get(account);

    if (!history) {
      history = new dice.history_object();
    }

    const historySize = history.tx_ids.unshift(txId);

    if (historySize > max) {
      history.tx_ids.pop();
    }
  }

  bet(args: dice.bet_arguments): dice.bet_result {
    // check arguments
    System.require(args.account, 'account argument is missing');

    const account = args.account!;
    const amount = args.amount;
    const value = args.value;

    System.require(amount > 0, 'amount must be greater than 0');
    System.require(value > 0 && value < 6, 'value must be between 1 and 6');

    // tansfer the Koin tokens to the contract
    const token = new Token(KOIN_TOKEN_ADDR);
    System.require(token.transfer(account, this.contractId, amount), 'the Koin transfer failed');

    // get transaction id
    const txField = System.getTransactionField('id')!;
    const tx_id = txField.bytes_value!;

    // save bet
    const bet = new dice.bet_object(tx_id, account, dice.bet_status.not_rolled, amount, value);

    this.betsSpace.put(tx_id, bet);

    // add bet to user history
    this.addBetToHistory(account, tx_id, USER_HISTORY_SIZE);

    // add bet to global history
    this.addBetToHistory(GLOBAL_HISTORY_KEY, tx_id, GLOBAL_HISTORY_SIZE);

    // Emit an event
    const event = new dice.bet_placed_event(amount, value);
    System.event('dice.bet_placed', Protobuf.encode(event, dice.bet_placed_event.encode), [account]);

    return new dice.bet_result();
  }

  roll(args: dice.roll_arguments): dice.roll_result {
    // check arguments
    System.require(args.tx_id, 'tx_id argument is missing');
    System.require(args.vrf_proof, 'vrf_proof argument is missing');
    System.require(args.vrf_hash, 'vrf_hash argument is missing');

    const tx_id = args.tx_id!;
    const vrf_proof = args.vrf_proof!;
    const vrf_hash = args.vrf_hash!;

    // only this contract can roll the dice
    System.requireAuthority(authority.authorization_type.contract_call, this.contractId);

    // get the bet
    const bet = this.betsSpace.get(tx_id);

    System.require(bet != null, 'bet does not exist');
    System.require(bet!.status == dice.bet_status.not_rolled, 'dice has already been rolled for this bet');

    // check vrf proof
    System.require(System.verifyVRFProof(CONTRACT_PUB_KEY, vrf_proof, vrf_hash, tx_id), 'vrf proof is invalid');

    // roll the dice'0x' + 
    let mh = new Crypto.Multihash();
    mh.deserialize(vrf_hash);
    const random = u128.fromBytes(mh.digest, true);

    // @ts-ignore this calculation is valid
    const result: u128 = random % u128.from(6) + u128.from(1);

    const roll = result.toU32();
    bet!.roll = roll;

    // if the user won
    if (bet!.value == roll) {
      // tansfer the Koin tokens to the user, 2 * of the bet amount
      const token = new Token(KOIN_TOKEN_ADDR);
      System.require(token.transfer(this.contractId, bet!.account!, bet!.amount * 2), 'the Koin transfer failed');

      // update bet
      bet!.status = dice.bet_status.won;
    } else {
      // update bet
      bet!.status = dice.bet_status.lost;
    }

    bet!.vrf_proof = vrf_proof;
    bet!.vrf_hash = vrf_hash;

    this.betsSpace.put(tx_id, bet!);

    // Emit an event
    const event = new dice.dice_rolled_event(bet!.status, roll);
    System.event('dice.dice_rolled', Protobuf.encode(event, dice.dice_rolled_event.encode), [bet!.account!]);

    return new dice.roll_result();
  }

  get_bet(args: dice.get_bet_arguments): dice.get_bet_result {
    // check arguments
    System.require(args.tx_id, 'tx_id argument is missing');
  
    const tx_id = args.tx_id!;

    const res = new dice.get_bet_result();

    const bet = this.betsSpace.get(tx_id);

    if (bet) {
      res.bet = bet;
    }

    return res;
  }

  get_history(args: dice.get_history_arguments): dice.get_history_result {
    // check arguments
    System.require(args.account, 'account argument is missing');
  
    const account = args.account!;

    const res = new dice.get_history_result();

    const history = this.historySpace.get(account);

    if (history) {
      res.history = history;
    }

    return res;
  }
}
