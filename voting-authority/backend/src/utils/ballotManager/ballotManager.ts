import { FFelGamal } from '@meck93/evote-crypto'
import BN = require('bn.js')
import path from 'path'
import { Contract } from 'web3-eth-contract'
import { Transaction } from "@ethereumjs/tx";
import { Common } from "@ethereumjs/common";

import { parityConfig } from '../../config'
import { BALLOT_ADDRESS_TABLE, getValueFromDB } from '../../database/database'
import { VotingState } from '../../endpoints/state'
import { unlockAccountRPC, getAccount, getAccountNonce } from '../rpc'
import { getWeb3 } from '../web3'
import { privateKey } from '../../private-key'

const Tx = require('ethereumjs-tx').Transaction
const ballotContract = require(path.join(__dirname, '/../../../solidity/toDeploy/Ballot.json'))
const web3 = getWeb3()
const GAS_LIMIT = 6000000
const toHex = (number: BN): string => web3.utils.toHex(number)
const account = getAccount()

/**
 * Returns a Contract object with which one can interface with the Ballot.
 */
const getContract = (): Contract => {
  // const contractAddress: string = getValueFromDB(BALLOT_ADDRESS_TABLE)
  const contractAddress = "0xA0623f2cECe0783b95a21267Ef5B17a73C598aBa"
  // console.log(contractAddress)
  const contract = new web3.eth.Contract(ballotContract.abi, contractAddress)
  return contract
}

const getAuthAccount = async (): Promise<string> => {
  return await unlockAccountRPC(parityConfig.nodeUrl, parityConfig.accountPassword, parityConfig.accountAddress)
}

export const setSystemParameters = async (): Promise<void> => {
  const contract = getContract()
  console.log("contract")
  // const authAcc = await getAuthAccount()
  console.log("authAcc")

  // possible parameters for p_: 23, 167, 263, 359
  const p_: number = 23
  const g_: number = 2
  const systemParams: FFelGamal.SystemParameters = FFelGamal.SystemSetup.generateSystemParameters(p_, g_)
  console.log("setSystemParameters")
  console.log(systemParams.p.toString())
  console.log(systemParams.q.toString())
  console.log(systemParams.g.toString())
  try {
    const txData = await contract.methods.setParameters(
        [toHex(systemParams.p), toHex(systemParams.q),
            toHex(systemParams.g)]).encodeABI()
      // .send({ from: authAcc, gas: GAS_LIMIT })
    await sendTx(txData)
    // const rawTxOptions = {
      // nonce: await getAccountNonce(),
      // from: account.address,
      // to: getValueFromDB(BALLOT_ADDRESS_TABLE), //public tx
      // data: txData, // contract binary appended with initialization value

      // // maxPriorityFeePerGas: '0x3B9ACA00',
      // // maxFeePerGas: '0x2540BE400',
      // // gasPrice: "0xBA43B7400", //ETH per unit of gas, legacy 50
      // gasPrice: "0x2540BE400", //ETH per unit of gas, legacy 10
      // gasLimit: "0x1AB3F00" //max number of gas units the tx is allowed to use
    // };
    // console.log(rawTxOptions)
    // const tx = new Tx(rawTxOptions, {'chain':'goerli'});
    // console.log("Signing transaction...");
    // tx.sign(Buffer.from(privateKey.slice(2), 'hex'));
    // console.log("Serializing transaction...");
    // var serializedTx = tx.serialize();
    // console.log("Sending transaction...");
    // const pTx = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex').toString("hex"));
    // console.log("tx transactionHash: " + pTx.transactionHash);
    // console.log("tx contractAddress: " + pTx.contractAddress);
    // return pTx.contractAddress
    // await contract.methods
      // .setParameters([toHex(systemParams.p), toHex(systemParams.q), toHex(systemParams.g)])
      // // .send({ from: authAcc, gas: GAS_LIMIT })
      // .send({ from: account.address, gas: GAS_LIMIT })
  } catch (error) {
      console.log(error)
    throw new Error('System parameters could not be initialized.')
  }
}

export const getPublicKey = async (): Promise<BN> => {
  const contract = getContract()
  try {
    return await contract.methods.getPublicKey().call()
  } catch (error) {
    throw new Error('Could not get public key.')
  }
}

/**
 * Generates the public key of the system. The public key will consist of multiple
 * key shares submitted by the sealer nodes. Hence, this function can only be called
 * once all shares are submitted and stored inside the contract.
 */
export const generatePublicKey = async (): Promise<void> => {
  const contract = getContract()
  // const authAcc = await getAuthAccount()
  try {
    // await contract.methods.generatePublicKey().send({ from: authAcc, gas: GAS_LIMIT })
    let txData = await contract.methods.getNrOfPublicKeyShares().encodeABI()
    // await sendTx(txData)
    // const nrOfPublicKeyShares = await contract.methods.getNrOfPublicKeyShares().call()
    console.log("getNrOfPublicKeyShares")
    const nrOfPublicKeyShares = await getNrOfPublicKeyShares() 
    console.log(nrOfPublicKeyShares)
    console.log("generatePublicKey")
    txData = await contract.methods.generatePublicKey().encodeABI()
    await sendTx(txData)
    // const rawTxOptions = {
      // nonce: await getAccountNonce(),
      // from: account.address,
      // to: getValueFromDB(BALLOT_ADDRESS_TABLE), //public tx
      // data: txData, // contract binary appended with initialization value

      // // maxPriorityFeePerGas: '0x3B9ACA00',
      // // maxFeePerGas: '0x2540BE400',
      // // gasPrice: "0xBA43B7400", //ETH per unit of gas, legacy 50
      // gasPrice: "0x2540BE400", //ETH per unit of gas, legacy 10
      // gasLimit: "0x1AB3F00" //max number of gas units the tx is allowed to use
    // };
    // console.log(rawTxOptions)
    // const tx = new Tx(rawTxOptions, {'chain':'goerli'});
    // console.log("Signing transaction...");
    // tx.sign(Buffer.from(privateKey.slice(2), 'hex'));
    // console.log("Serializing transaction...");
    // var serializedTx = tx.serialize();
    // console.log("Sending transaction...");
    // const pTx = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex').toString("hex"));
    // console.log("tx transactionHash: " + pTx.transactionHash);
    // // return pTx.contractAddress
  } catch (error) {
    throw new Error('The public key of the system could not be created.')
  }
}

/**
 * Will create verifiers for the system parameters set inside the contract.
 */
export const createVerifiers = async (): Promise<void> => {
  const contract = getContract()
  const authAcc = await getAuthAccount()
  try {
    await contract.methods.createVerifiers().send({ from: authAcc, gas: GAS_LIMIT })
  } catch (error) {
    throw new Error('The verifiers could not be created')
  }
}

/**
 * Opens the ballot for voting. Inside the contract, IS_VOTING_OPEN is set to true.
 */
export const openBallot = async (): Promise<void> => {
  const contract = getContract()
  // const authAcc = await getAuthAccount()
  try {
    // await contract.methods.openBallot().send({ from: authAcc, gas: GAS_LIMIT })
    const txData = await contract.methods.openBallot().encodeABI()
    await sendTx(txData)
    const isBallotOpenBool = await isBallotOpen()
    console.log(`ballot open: ${isBallotOpenBool}`)
  } catch (error) {
    throw new Error('The Ballot could no be opened. Make sure you are the owner and it is not already open.')
  }
}

const sendTx = async (txData) => { 
    const rawTxOptions = {
      nonce: await getAccountNonce(),
      from: account.address,
      // to: getValueFromDB(BALLOT_ADDRESS_TABLE), //public tx
      to: "0xA0623f2cECe0783b95a21267Ef5B17a73C598aBa", //public tx
      data: txData, // contract binary appended with initialization value

      // maxPriorityFeePerGas: '0x3B9ACA00',
      // maxFeePerGas: '0x2540BE400',
      // gasPrice: "0xBA43B7400", //ETH per unit of gas, legacy 50
      gasPrice: "0x5D21DBA00", //ETH per unit of gas, legacy 25
      // gasPrice: "0x2540BE400", //ETH per unit of gas, legacy 10
      // gasPrice: "0x3B9ACA00", //ETH per unit of gas, legacy 1
      // gasLimit: "0x1AB3F00" //max number of gas units the tx is allowed to use, 28 mil
      gasLimit: "0xF4240" //max number of gas units the tx is allowed to use, 1 mil
    };
  // const common = Common.custom(
    // {
      // chainId: 1337,
      // defaultHardfork: "shanghai",
    // },
    // { baseChain: "mainnet" }
  // );
    console.log(rawTxOptions)
  console.log("Creating transaction...");
    const tx = new Tx(rawTxOptions, {'chain':'goerli'});
  // const tx = new Transaction(rawTxOptions, { common });
    console.log("Signing transaction...");
    // tx.sign(Buffer.from(privateKey.slice(2), 'hex'));
    const signed = tx.sign(Buffer.from(privateKey.slice(2), 'hex'));
    console.log("Serializing transaction...");
    var serializedTx = tx.serialize();
    // var serializedTx = signed.serialize();
    console.log("Sending transaction...");
    const pTx = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex').toString("hex"));
    console.log("tx transactionHash: " + pTx.transactionHash);
}

/**
 * Closes the ballot and prevents further votes from being recorded.
 */
export const closeBallot = async (): Promise<void> => {
  const contract = getContract()
  // const authAcc = await getAuthAccount()
  try {
    const txData = await contract.methods.closeBallot().encodeABI()
    await sendTx(txData)
    const isBallotOpenBool = await isBallotOpen()
    console.log(`ballot open: ${isBallotOpenBool}`)
    // await contract.methods.closeBallot().send({ from: authAcc, gas: GAS_LIMIT })
  } catch (error) {
    throw new Error('The Ballot could no be closed.')
  }
}

/**
 * Returns a boolean indicating if the ballot is still open.
 */
export const isBallotOpen = async (): Promise<boolean> => {
  const contract = getContract()
  try {
    const status = await contract.methods.getBallotStatus().call()
    console.log(status)
    return status === VotingState.VOTING
  } catch (error) {
    throw new Error('The status of the Ballot could no be fetched.')
  }
}

export const getNrOfPublicKeyShares = async (): Promise<number> => {
  const contract = getContract()
  // console.log(contract.address)
  try {
    return parseInt(await contract.methods.getNrOfPublicKeyShares().call())
  } catch (error) {
    throw new Error('The number of public key shares could not be fetched.')
  }
}

export const getNumberOfDecryptedShares = async (): Promise<number> => {
  const contract = getContract()
  // const authAcc = await getAuthAccount()
  try {
    // return parseInt(await contract.methods.getNrOfDecryptedShares().call({ from: authAcc }))
    const submittedDecryptedShares = parseInt(await contract.methods.getNrOfDecryptedShares().call())
    return submittedDecryptedShares 
  } catch (error) {
    console.log('The number of decrypted shares could not be assessed.')
    throw new Error('The number of decrypted shares could not be assessed.')
  }
}

/**
 * Combines the decrypted shares that were previously submitted by each authority.
 * Together they will generate the final decrypted result of the ballot.
 */
export const combineDecryptedShares = async (): Promise<boolean> => {
  const contract = getContract()
  // const authAcc = await getAuthAccount()
  try {
    // return await contract.methods.combineDecryptedShares().send({ from: authAcc, gas: GAS_LIMIT })
    // return await contract.methods.combineDecryptedShares().call()
    let status = await contract.methods.getBallotStatus().call()
    console.log(`pre-combineDecryptedShares status: ${status}`)
    const numberOfDecryptedShares = parseInt(await contract.methods.getNrOfDecryptedShares().call())
    console.log(`pre-combineDecryptedShares numberOfDecryptedShares: ${numberOfDecryptedShares}`)
    const numVotes = await contract.methods.getNumberOfVotes().call()
    console.log(`pre-combineDecryptedShares numVotes: ${numVotes}`)
    await contract.methods.combineDecryptedShares().call()

    status = await contract.methods.getBallotStatus().call()
    console.log(`combineDecryptedShares status: ${status}`)
  } catch (error) {
    throw new Error('The decrypted shares could no be combined.')
  }
}

/**
 * Fetches the final voting result -> number of yes votes.
 */
export const getVoteResult = async (): Promise<number> => {
  const contract = getContract()
  // const authAcc = await getAuthAccount()
  try {
    // return await contract.methods.getVoteResult().call({ from: authAcc })
    const status = await contract.methods.getBallotStatus().call()
    console.log(`getVoteResult status: ${status}`)
    return await contract.methods.getVoteResult().call()
  } catch (error) {
    throw new Error('The final voting result could not be fetched. Maybe the voting is still ongoing.')
  }
}

/**
 * Gets number of votes
 */
export const getNumberOfVotes = async (): Promise<number> => {
  const contract = getContract()
  // const authAcc = await getAuthAccount()
  try {
    // return await contract.methods.getNumberOfVotes().call({ from: authAcc })
    return await contract.methods.getNumberOfVotes().call()
  } catch (error) {
    throw new Error('The number of votes could not be assessed.')
  }
}
