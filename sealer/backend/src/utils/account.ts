import fs from 'fs'
import path from 'path'
import { getValueFromDB, WALLET_TABLE } from '../database/database'

import { getWeb3 } from './web3'

const web3 = getWeb3()

export const getWallet = (): string => {
  // const storedWallet = getValueFromDB(WALLET_TABLE)
  const storedWallet = ''

  if (storedWallet === '') {
    const wallet = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../wallet/sealer.json'), 'utf8'))
    return '0x' + wallet.address
  } else {
    return '0x' + storedWallet
  }
}

export const getPassword = (): string => {
  return fs.readFileSync(path.resolve(__dirname, '../../wallet/sealer.pwd'), 'utf8')
}

export const getPrivateKey = () => {
    const wallet = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../wallet/sealer.json'), 'utf8'))
    return wallet.privateKey
}

export const getAccount = () => {
    // const privateKey = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../wallet/sealer.json'), 'utf8'))
    const privateKey = getPrivateKey()
    // return '0x' + wallet.address
    console.log(privateKey)
    const acc = web3.eth.accounts.privateKeyToAccount(privateKey)
    console.log(acc)
    return web3.eth.accounts.privateKeyToAccount(privateKey)
}

export const getAccountNonce = async () => {
    const txnCount = await web3.eth.getTransactionCount(getAccount().address);
    console.log("txnCount", txnCount)
    return web3.utils.numberToHex(txnCount);
}
