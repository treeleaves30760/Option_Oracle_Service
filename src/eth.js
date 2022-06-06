import Web3 from 'web3';
import 'dotenv/config'

export var web3 = new Web3(process.env.WEB3_PROVIDER_ADDRESS);

const contractAddress = process.env.CONTRACT_ADDRESS;
const contractAbi = JSON.parse(process.env.ABI);

var acc = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)
web3.eth.accounts.wallet.add(acc);

export const OracleAddress = web3.eth.accounts.wallet[0].address;
export const contract = new web3.eth.Contract(contractAbi, contractAddress);

