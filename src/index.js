import "dotenv/config";
import { getOptionPrice } from "./getPrice.js";
import { contract, OracleAddress, web3 } from "./eth.js";

var times = 0;
var NowJobId = 0;

async function setup() {
    console.log(OracleAddress)
}

const wait = (milliseconds) => {
    return new Promise((resolve, reject) => setTimeout(() => resolve(), milliseconds));
};

function restart() {
    wait(process.env.TIMEOUT).then(start);
}

function start() {
    contract.events.EventGetOptionPrice({}, (err, event) => {
        // console.log("event", event)
    })
    .on('data', (
        datas
    ) => {
        datas = datas.returnValues
        var coin = datas.coin;
        var date = datas.date;
        var price = datas.price;
        var buytype = datas.buytype;
        var JobId = datas.JobId;
        console.log("========================================================================================================================");
        console.log("Coin:", coin, "Date:", date, "Price:", price, "Buy Type:", buytype, "JobId:", JobId);
        console.log("========================================================================================================================");
        if (JobId > NowJobId) {
            getOptionPrice(coin, date, price, buytype).then((result) => {
                return result.data[0]
            }).then((OptionData) => {
                console.log(JobId,
                    (parseInt(OptionData.open * 10000)),
                    (parseInt(OptionData.lastPrice * 10000)),
                    (parseInt(OptionData.high * 10000)),
                    (parseInt(OptionData.low * 10000)),
                    OptionData.openTime.toString(),
                    OptionData.closeTime.toString(),
                    OptionData.symbol)
                contract.methods.updateOptionPrice(
                    JobId,
                    (parseInt(OptionData.open * 10000)),
                    (parseInt(OptionData.lastPrice * 10000)),
                    (parseInt(OptionData.high * 10000)),
                    (parseInt(OptionData.low * 10000)),
                    OptionData.openTime.toString(),
                    OptionData.closeTime.toString(),
                    OptionData.symbol
                ).send({from: OracleAddress, gasLimit: process.env.GAS_LIMIT});
            })
            NowJobId = JobId;
        }
        
    })
    .on('error', (error, receipt) => {
        getRevertReason(error.transactionHash).then(console.log);
        // console.log('error', error);
        // console.log('receipt', receipt);
        restart();
    })
    console.log("Times: ", times++);
    restart();
}

async function getRevertReason(txHash){
    const tx = await web3.eth.getTransaction(txHash)
    var result = await web3.eth.call(tx, tx.blockNumber)
    result = result.startsWith('0x') ? result : `0x${result}`
    if (result && result.substr(138)) {
        const reason = web3.utils.toAscii(result.substr(138))
        console.log('Revert reason:', reason)
    } else {
        console.log('Cannot get reason - No return value')
    }
}

async function main() {
    await setup();
    start();
}
// getOptionPrice("BTC", "220610", 32000, "C").then((res) => {
//     console.log(res.data);
// })

main();
// getRevertReason("0x5a9b5631c9a065a93a82355cfb6d6f5d8ccb3a73000d2153fd15a5aa9995148a").then(console.log)