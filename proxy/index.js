import express from 'express';
import cors from 'cors';
import ky from "ky";
import {Big, SMA} from 'trading-signals';


/*

============
HTTP REQUEST
============

KY
https://medium.com/@muzammilsyed270300/why-you-should-use-ky-instead-of-axios-for-http-requests-in-your-frontend-2c7878be3b30


=======
BINANCE
=======

probni api endpointi
https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints#compressedaggregate-trades-list

https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints#klinecandlestick-data
ovako:
https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h

Interval	interval value
seconds	1s
minutes	1m, 3m, 5m, 15m, 30m
hours	1h, 2h, 4h, 6h, 8h, 12h
days	1d, 3d
weeks	1w
months	1M

Binance json response
 [
   [
     1499040000000,      // [0] Kline open time
     "0.01634790",       // [1] Open price
     "0.80000000",       // [2] High price
     "0.01575800",       // [3] Low price
     "0.01577100",       // [4] Close price
     "148976.11427815",  // [5] Volume
     1499644799999,      // [6] Kline Close time
     "2434.19055334",    // [7] Quote asset volume
     308,                // [8] Number of trades
     "1756.87402397",    // [9] Taker buy base asset volume
     "28.46694368",      // [10] Taker buy quote asset volume
     "0"                 // [11] Unused field, ignore.
   ]
 ]


==================
TECHINCAL ANALYSIS
==================

trading-signals
(~2025)
https://www.npmjs.com/package/trading-signals?activeTab=readme
https://github.com/bennycode/trading-signals
https://bennycode.com/trading-signals/
npm install trading-signals


Indicator TS
(~2025)
https://github.com/cinar/indicatorts
npm install indicatorts

moving-averages
(~2021)
https://www.npmjs.com/package/moving-averages?activeTab=versions


*/



const app = express();
app.use(cors());
const lp = 3000;
app.listen(lp, () => {
	console.log('server na portu http://localhost:' + lp);
})

const sma = new SMA(3);
const sma7 = new SMA(7);

// You can add values individually:
sma.add(40);
sma.add(30);
sma.add(20);
sma.updates([70, 90, 21]);
sma.add('10');					// add string values
sma.replace('40');		// replace a previous value (useful for live charting):
sma.add(new Big(30.0009));		// add arbitrary-precision decimals:

console.log("is it stable? " + sma.isStable);
console.log(sma.getResult()?.toFixed());
// console.log(sma.getResultOrThrow().toFixed(2)); // 2 decimals
console.log('lo ' + sma.lowest?.toFixed(2)); // "23.33"
console.log('hi ' + sma.highest?.toFixed(2)); // "53.33"

app.get('/', async (req, res) => {
	try {
		const pomoc_json = { name: 'Sve je ok', age: 25 };
		const pomoc =
			"<head> <title>Pomoc</title></head>" +
			"  <p>Ovako:\n" +
			"  <p>go to <a href=\"/klines/BTCUSDT/1m\">klines BTCUSDT 1m</a></p>\n" +
			"  <p>go to <a href=\"/klines_test/\">klines_test</a></p>\n" +
			"  <p>go to <a href=\"/users/\">users</a></p>\n";
		res.status(200).send(pomoc);
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});


app.get('/klines_test', async (req, res) => {
	try {
		const reqs = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=3';
		const reqsOpcije = { name: 'Alice', age: 25 };
		const response = await ky.get(reqs, reqsOpcije);
		const result = await response.json();
		res.status(200).json(result);

	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});


app.get('/klines/:symbol/:interval/:limit', async (req, res) => {
	try {
		const { symbol, interval, limit } = req.params;
		const reqs = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
		console.log('request=' + reqs);
		const reqsOpcije = { name: 'Alice', age: 25 };
		const response = await ky.get(reqs, reqsOpcije);
		const data = await response.json();

		let f = 5;
		let s = 20;
		let volSmaF = new SMA(f);
		let volSmaS = new SMA(s);
		let tradeSmaF = new SMA(f)
		let tradeSmaS = new SMA(s);

		let klinedata = data.map((d) => ({
			time: d[0] / 1000,
			open: d[1] * 1,
			high: d[2] * 1,
			low: d[3] * 1,
			close: d[4] * 1,

			volume: d[5] *1,
			volumeFast: volSmaF.add(d[5]) *1,
			volumeSlow: volSmaS.add(d[5]) *1,

			numtrades: d[8] *1,
			numtradesFast: tradeSmaF.add(d[8]) *1,
			numtradesSlow: tradeSmaS.add(d[8]) *1,

		}));

		res.status(200).json(klinedata);

	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});


