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
./dev.sh {1,2,3}

- contract
cd contracts
- ballot contract = contracts/contracts/FiniteField/Ballot.sol
- recompile/distribute = truffle compile && ./distribute-contracts.sh
