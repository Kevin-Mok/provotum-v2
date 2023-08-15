#!/bin/sh
# ganache \
docker run --detach --publish 8545:8545 trufflesuite/ganache:latest --verbose \
    --wallet.accounts 0xe8ee08a685d093206043f7274958f3a51944ce0b49393d20fd9fed2d0585077b,50000000000000000000 \
    --wallet.accounts 0x299da34f69a69c7d8132d4d2ec47caa1b8f8a677eec5d196a6dfec3383d52f16,50000000000000000000 \
    --wallet.accounts 0x69c34779419063d33496991aedd3fb4303cf0058acd74c69476ddde263763dbd,50000000000000000000 \
    --wallet.accounts 0x26fa8b10a86b98b621454f1f857c1d0d2ad27d08c5c8793ee38f98793c3bfd1e,50000000000000000000 \
    --wallet.accounts 0x9cc4a8a0f14d4d0eed655f750c6f02804e3e84398c0bb62e2f65dd177688dda9,50000000000000000000 \
    --wallet.accounts 0x74fb7a6276448df88029eb3e84b758dab9f9a6812349f8cfc9ec5bd14c20b6d1,50000000000000000000 \
    # --database.dbPath ../ganache-db
