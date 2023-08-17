# Docker Prebuilt
- can't login to voting page in voter frontend
  - details = https://github.com/alexscheitlin/master-project-evoting/issues/218
- can't replace voter frontend image with modified version 
  to try and fix above issue
  - details = https://stackoverflow.com/questions/76798983/docker-container-not-starting-after-rebuilding

# Modified Code
## Bypass `RESULT` Check
- https://github.com/Kevin-Mok/provotum-v2/blob/d43fad9a53aef99d7dee7c52a8b0dcaab08bccd6/contracts/contracts/FiniteField/Ballot.sol#L456
- tested that state actually changes to result by end of `combineDecryptedShares`
  * https://github.com/Kevin-Mok/provotum-v2/blob/d43fad9a53aef99d7dee7c52a8b0dcaab08bccd6/contracts/contracts/FiniteField/Ballot.sol#L258-L265
  * when check in voting authority backend right after `combineDecryptedShares`, 
    ballot status is not `RESULT` 
    * https://github.com/Kevin-Mok/provotum-v2/blob/d43fad9a53aef99d7dee7c52a8b0dcaab08bccd6/voting-authority/backend/src/utils/ballotManager/ballotManager.ts#L284

### Try
- run modified code in VM without commented out `getVoteResult` 
  check for RESULT state without 0 votes
  - need to recompile contract and distribute

## Yes Vote Counts as No 
- no vote counts as no
