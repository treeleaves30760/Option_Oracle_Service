import axios from 'axios';
const BinanceOptionBaseUrl = "https://vapi.binance.com"
const BinanceCoinBaseUrl = "https://api3.binance.com"


export async function getCoinPrice(symbol = "ETHUSDT") {
  return await axios.get(BinanceCoinBaseUrl + "/api/v3/ticker/price?symbol=" + symbol).then((result) => {
    return result.data["price"];
  });
}

// Symbol For Coin To Get
// Dates In format of "YYMMDD", YY is the last two number of years in AD
// Price is an integer start with 2000 and with Interval Of 2000
// Type is "C" for buy call, is "P" for buy put  
export async function getOptionPrice(Symbol, Dates, Price, Type) {
  return await axios.get(BinanceOptionBaseUrl + "/vapi/v1/ticker?symbol=" + Symbol + "-" + Dates + "-" + Price + "-" + Type).then((result) => {
    return result.data;
  });
}
