# Voter Frontend
- make sure to have MetaMask installed
- import private keys
  - voter 1 = `e8ee08a685d093206043f7274958f3a51944ce0b49393d20fd9fed2d0585077b`
  - voter 2 = `9cc4a8a0f14d4d0eed655f750c6f02804e3e84398c0bb62e2f65dd177688dda9`
  - voter 3 = `74fb7a6276448df88029eb3e84b758dab9f9a6812349f8cfc9ec5bd14c20b6d1`
  - when adding more voters, modify [Ganache start script](https://github.com/Kevin-Mok/provotum-v2/blob/db154f413ae08fe2abfab75d7a516e929eefc1f0/ganache-pv.sh#L4) to 
    have the private key

## Voting Authority
### Prebuilt Docker
- doesn't start frontend container

## Sealer
### Local
- can submit address to voting authority
- can't load blockchain config

### Local Docker
- can't find voting authority backend

## Prebuilt
- voting authority backend can't fetch peers (on local machine, works in VM)
  - /state 500 {"state":"PAIRING","msg":"Could not get the number of connected authorities (web3.eth.net.getPeerCount)."}
- tried removing all remote images
  - doesn't work

# VM
- created 2 VirtualBox images
  - 1 that runs prebuilt Docker
  - 1 that runs modified code (should still run prebuilt 
    Docker fine but haven't tested)
  - email kevin.mok@mail.utoronto.ca for access to these 
    images
  - [import instructions](https://docs.oracle.com/en/virtualization/virtualbox/6.0/user/ovf.html)
- still run into [open problems](https://github.com/Kevin-Mok/provotum-v2/blob/docs/open-problems.md#docker-prebuilt)
