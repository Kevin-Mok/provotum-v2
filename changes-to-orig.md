# Election Process
- Registration phase
  - skip since using Ganache blockchain
- Pairing phase
  - skip signing up sealers as validators
- Key Generation phase
  - generate/submit public key shares from sealers automatically
  - generate voting authority public key automatically
- Voting phase
  - use MetaMask instead to login/vote in voter frontend instead of with credentials
- Tallying phase
  - submit decrypted shares from sealers automatically

# Code
- use [local Ganache blockchain](https://github.com/Kevin-Mok/provotum-v2/blob/docs/ganache-pv.sh)
  - loads deployment/voter wallets
- can also [run on Goerli](https://github.com/Kevin-Mok/provotum-v2/blob/2c7c042ce415b459de12046e2ac8836a7fa6b9f3/sealer/backend/src/services/ballotManager.ts#L184)
  - can verify contract on Etherscan using [hardhat-verify](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify)
- bypass `require(votingState == VotingState.RESULT` in `getVoteResult` 
  in contract (see [`open-problems.md`](https://github.com/Kevin-Mok/provotum-v2/blob/docs/open-problems.md#bypass-result-check))
- update sending all transactions to blockchain [using `@ethereumjs/tx`](https://github.com/Kevin-Mok/provotum-v2/blob/2c7c042ce415b459de12046e2ac8836a7fa6b9f3/voting-authority/backend/src/utils/ballotManager/ballotManager.ts#L198) vs. 
  authentication using account RPC (outdated method)
- don't [keep session storage](https://github.com/Kevin-Mok/provotum-v2/blob/2c7c042ce415b459de12046e2ac8836a7fa6b9f3/voter-frontend/src/AppManager.tsx#L36) in voting 
  frontend
  - keeps old contract address when restarting processes 
    while developing
- only use [1 sealer backend](https://github.com/Kevin-Mok/provotum-v2/blob/2c7c042ce415b459de12046e2ac8836a7fa6b9f3/voting-authority/backend/src/endpoints/sealers.ts#L3-L4)
