
?
assembly/proto/dice.protodicekoinos/options.proto"a
bet_arguments
account (B??Raccount
amount (B0Ramount
value (Rvalue"

bet_result"o
roll_arguments
tx_id (B??RtxId!
	vrf_proof (B??RvrfProof
vrf_hash (B??RvrfHash"
roll_result".
get_bet_arguments
tx_id (B??RtxId"4
get_bet_result"
bet (2.dice.bet_objectRbet"7
get_history_arguments
account (B??Raccount":
get_history_result$
bets (2.dice.bet_objectRbets"D
bet_placed_event
amount (B0Ramount
value (Rvalue"Q
dice_rolled_event(
status (2.dice.bet_statusRstatus
roll (Rroll"?

bet_object
tx_id (B??RtxId
account (B??Raccount(
status (2.dice.bet_statusRstatus
amount (B0Ramount
value (Rvalue
roll (Rroll!
	vrf_proof (B??RvrfProof
vrf_hash (B??RvrfHash"

roll_tx_id	 (B??RrollTxId 
	timestamp
 (B0R	timestamp"-
history_object
tx_ids (B??RtxIds*/

bet_status

not_rolled 
won
lostbproto3