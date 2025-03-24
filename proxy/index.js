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

console.log(new Date(8.64e15).toString());

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

		const f = 5;
		const m = 20;
		const s = 50;
		const volSmaF = new SMA(f);
		const volSmaM = new SMA(m);
		const volSmaS = new SMA(s);

		const tradeSmaF = new SMA(f)
		const tradeSmaM = new SMA(m)
		const tradeSmaS = new SMA(s);

		const vv = data.map((item, index) => ({
			// i: index,
			// time: item[0] / 1000,
			raw: item[5] *1,
			fast: volSmaF.add(item[5]) *1,
			med: volSmaM.add(item[5]) *1,
			slow: volSmaS.add(item[5]) *1,
		}))
		const tt = data.map((item, index) => ({
			// i: index,
			// time: item[0] / 1000,
			raw: item[8] *1,
			fast: tradeSmaF.add(item[8]) *1,
			med: tradeSmaM.add(item[8]) *1,
			slow: tradeSmaS.add(item[8]) *1,
		}))


		const rezult = data.map((item, index) => ({
			time: item[0] / 1000,
			open: item[1] * 1,
			high: item[2] * 1,
			low: item[3] * 1,
			close: item[4] * 1,

			ind: index,

			vol: vv[index],

			trades: tt[index],
		}));

		res.status(200).json(rezult);

	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});


app.get('/nested_map', async (req, res) => {
	try {
		const reqs = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=5';
		const reqsOpcije = { name: 'Alice', age: 25 };
		const response = await ky.get(reqs, reqsOpcije);
		const data = await response.json();

		const f = 1;
		const m = 2;
		const s = 5;
		const volSmaF = new SMA(f);
		const volSmaM = new SMA(m);
		const volSmaS = new SMA(s);

		const tradeSmaF = new SMA(f)
		const tradeSmaM = new SMA(m)
		const tradeSmaS = new SMA(s);


		const v = data.map((item, index) => ({
			i: index,
			time: item[0] / 1000,
			raw: item[5] *1,
			fast: volSmaF.add(item[5]) *1,
			med: volSmaM.add(item[5]) *1,
			slow: volSmaS.add(item[5]) *1,
		}))
		const t = data.map((item, index) => ({
			i: index,
			time: item[0] / 1000,
			raw: item[8] *1,
			fast: tradeSmaF.add(item[8]) *1,
			med: tradeSmaM.add(item[8]) *1,
			slow: tradeSmaS.add(item[8]) *1,
		}))

		const rezult = data.map((item, index) => ({
			time: item[0] / 1000,
			open: item[1] * 1,
			high: item[2] * 1,
			low: item[3] * 1,
			close: item[4] * 1,

			ind: index,

			vol: v[index],

			trade: t[index],
		}));

		res.status(200).json(rezult);

	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});