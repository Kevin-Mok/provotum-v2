- Ganache 
./ganache-pv.sh
- clear activity and nonce data (MM)

- VA
BE
cd voting-authority/backend
- rename private-key-example.ts to private-key.ts
npm run serve:localhost
- need to restart often when making changes

FE 
cd voting-authority/frontend
npm run start:localhost
http://localhost:3001/

- VF
cd voter-frontend
npm run start:localhost
http://localhost:3000/

- AP
cd access-provider-backend 
npm run serve:localhost

- sealers
- need different copies of repo for each sealer
cd sealer/backend
- src/private-key.ts needs to be diff. for each sealer
  - 1 = 0x299da34f69a69c7d8132d4d2ec47caa1b8f8a677eec5d196a6dfec3383d52f16
  - 2 = 0x69c34779419063d33496991aedd3fb4303cf0058acd74c69476ddde263763dbd
  - 3 = 0x26fa8b10a86b98b621454f1f857c1d0d2ad27d08c5c8793ee38f98793c3bfd1e
./dev.sh {1,2,3}

- contract
cd contracts
- ballot contract = contracts/contracts/FiniteField/Ballot.sol
- recompile/distribute = truffle compile && ./distribute-contracts.sh
