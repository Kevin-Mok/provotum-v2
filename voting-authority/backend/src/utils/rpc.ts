import axios from 'axios'
import { getWeb3 } from './web3'
import { privateKey } from '../private-key'

const config = { headers: { 'Content-Type': 'application/json' } }

const web3 = getWeb3()

export const createAccount = async (url: string, password: string, passphrase: string): Promise<string> => {
  const body = {
    jsonrpc: '2.0',
    method: 'parity_newAccountFromPhrase',
    params: [password, passphrase],
    id: 0,
  }
  const response = await axios.post(url, body, config)

  if (response.data.error) {
    throw new Error(response.data.error.message)
  }
  return response.data.result
}

export const unlockAccountRPC = async (url: string, password: string, address: string): Promise<string> => {
  const body = {
    jsonrpc: '2.0',
    method: 'personal_unlockAccount',
    params: [address, password, null],
    id: 0,
  }
  const response = await axios.post(url, body, config)

  if (response.data.error) {
    throw new Error(response.data.error.message)
  } else {
    return address
  }
}

export const getAccount = () => {
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
