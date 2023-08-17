# Ganache 
- clear activity and nonce data (search in settings in 
  MetaMask) when restarting Ganache
```
./ganache-pv.sh
```

# Voting Authority
## Backend
- rename `voting-authority/backend/src/private-key-example.ts` to `private-key.ts`
- need to restart often when making changes
```
cd voting-authority/backend
npm run serve:localhost
```

## Frontend
```
cd voting-authority/frontend
npm run start:localhost
```
- runs on http://localhost:3001/

# Voter Frontend
```
cd voter-frontend
npm run start:localhost
```
- runs on http://localhost:3000/

# Access Provider
```
cd access-provider-backend 
npm run serve:localhost
```

# Sealers
- need different copies of repo (3) for each sealer
- `sealer/backend/src/private-key.ts` needs to be diff. for each sealer
  - rename `private-key-sealer-{1,2,3}.ts` to `private-key.ts` 
    in each sealer repo
```
cd sealer/backend
./dev.sh {1,2,3}
```

# Contract
```
cd contracts
```
- ballot contract (main) = `contracts/contracts/FiniteField/Ballot.sol`
- recompile/distribute = `truffle compile && ./distribute-contracts.sh`
