import {
	createChart,
	createTextWatermark,
	LineSeries,
	CandlestickSeries,
	HistogramSeries,
	LineStyle
} from "./js/lightweight-charts.standalone.development.mjs";
import { Legenda } from "./zjs/Legenda.js";
import { TextWater } from './zjs/TextWater.js';


const chartOptions = {
	layout: {
		textColor: 'blue',
		background: {
			type: 'gradient',
			topColor: 'white',
			bottomColor: '#EEEEEEff'
		},
		panes: {
            separatorColor: '#777777',
            separatorHoverColor: '#22222222',
            enableResize: true,
        },
	},
	timeScale: {
		timeVisible: true,
		secondsVisible: false,
	},
	textWwatermark: {
		visible: true,
		fontSize: 34,
		horzAlign: "center",
		vertAlign: "bottom",
		color: 'red',
		text: 'prices',
	},
};
const chart = createChart(document.getElementById('tv_chart'), chartOptions);

/////////////////////////////////////
// Histogrami su uglavnom raw data
/////////////////////////////////////
// price, volume, number of trades
const priceSeries = chart.addSeries(CandlestickSeries, {
	// title: 'ticker',
	upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
	wickUpColor: '#26a69a', wickDownColor: '#ef5350',
	priceFormat: {
			type: 'price',	// percent | price | volume
		},
	}, 0, );
const volumeHist = chart.addSeries(HistogramSeries, {
		// title: 'volume',
		color: '#05530511',
		lineWidth: 1,
		priceFormat: {
			type: 'volume',
		},
	}, 1, );
const tradeHist = chart.addSeries(HistogramSeries, {
		// title: 'trades',
		color: '#05530511',
		lineWidth: 1,
		priceFormat: {
			type: 'volume',
		},
	}, 2, );
const deltaHist = chart.addSeries(HistogramSeries, {
		// title: 'trades',
		color: '#05530511',
		lineWidth: 1,
		priceFormat: {
			type: 'volume',
		},
	}, 3, );

////////////////////////
// indikatori po zelji
////////////////////////
// volume SMA
const volSMAf = chart.addSeries(LineSeries, { color: '#02bb99', lineWidth: 1, priceFormat: {type: 'volume',},}, 1,);
const volSMAm = chart.addSeries(LineSeries, { color: '#029999', lineWidth: 1, priceFormat: {type: 'volume',},}, 1,);
const volSMAs = chart.addSeries(LineSeries, { color: '#025599', lineWidth: 1, priceFormat: {type: 'volume',},}, 1,);

// trading speed
const tradeSMAf = chart.addSeries(LineSeries, { color: '#02bb99', lineWidth: 1, priceFormat: {type: 'volume',},}, 2,);
const tradeSMAm = chart.addSeries(LineSeries, { color: '#029999', lineWidth: 1, priceFormat: {type: 'volume',},}, 2,);
const tradeSMAs = chart.addSeries(LineSeries, { color: '#025599', lineWidth: 1, priceFormat: {type: 'volume',},}, 2,);

// price delta
const deltaSeriesSMAf = chart.addSeries(LineSeries, { color: '#02bb9999', lineWidth: 1, priceFormat: {type: 'volume',},}, 3,);
const deltaSeriesSMAm = chart.addSeries(LineSeries, { color: '#02bb9999', lineWidth: 1, priceFormat: {type: 'volume',},}, 3,);
const deltaSeriesSMAs = chart.addSeries(LineSeries, { color: '#02bb9999', lineWidth: 1, priceFormat: {type: 'volume',},}, 3,);
// const deltaSeriesHL = chart.addSeries(LineSeries, { color: '#920000', lineWidth: 1, priceFormat: {type: 'volume',},}, 3,);



// LEGENDE
const l1 = new Legenda('tv_chart');
const wmV = new TextWater(chart, 1, 'volume');
const wmS = new TextWater(chart, 2, 'trading speed');
const pdscale = 5;
const wmD = new TextWater(chart, 3, 'price delta * ' + pdscale);

async function getData(symbol, interval, limit) {
	const url = "http://localhost:3000/klines/" + symbol + "/" + interval + "/" + limit;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const data = await response.json();
		console.log(data);

		priceSeries.setData(
			data.map(item => ({
				time: item.time,
				open: item.open,
				high: item.high,
				low: item.low,
				close: item.close,
			}))
		);
		volumeHist.setData(
			data.map(item => ({
				time: item.time,
				value: item.vol.raw,
			}))
		);
		tradeHist.setData(
			data.map(item => ({
				time: item.time,
				value: item.trades.raw,
			}))
		);

		// volume SMA
		volSMAf.setData(data.map(item => ({time: item.time, value: item.vol.fast,})));
		// volSMAm.setData(data.map(item => ({time: item.time, value: item.vol.med,})));
		volSMAs.setData(data.map(item => ({time: item.time, value: item.vol.slow,})));

		// trading speed
		tradeSMAf.setData(data.map(item => ({time: item.time, value: item.trades.fast,})));
		// tradeSMAm.setData(data.map(item => ({time: item.time, value: item.trades.med,})));
		tradeSMAs.setData(data.map(item => ({time: item.time, value: item.trades.slow,})));

		// price gradient
		deltaHist.setData(data.map(item => ({time: item.time, value: item.delta.raw,})));
		deltaSeriesSMAf.setData(data.map(item => ({time: item.time, value: item.delta.fast *pdscale,})));
		// deltaSeriesSMAm.setData(data.map(item => ({time: item.time, value: item.delta.med *pdscale,})));
		deltaSeriesSMAs.setData(data.map(item => ({time: item.time, value: item.delta.slow *pdscale,})));
		// deltaSeriesHL.setData(data.map(item => ({time: item.time, value: item.delta.fast,})));

		l1.setText(symbol + ' / ' + interval);


	} catch (error) {
		console.error(error.message);
	}
}

const iks = getData("BTCUSDT", "15m", 1000);

chart.timeScale().fitContent();



//////////////////////
// Series primitive
//////////////////////
// class MySeriesPrimitive {
//     /* Class implementing the ISeriesPrimitive interface */
// }
// const mySeriesPrimitive = new MySeriesPrimitive();
// speedSeries.attachPrimitive(mySeriesPrimitive);

////////////////////
// Pane primitive
////////////////////
// class MyPanePrimitive {
// 	/* Class implementing the IPanePrimitive interface */
// }
// const myPanePrimitive = new MyPanePrimitive();
// const mainPane = chart.panes()[1]; // Get the main pane
// mainPane.attachPrimitive(myPanePrimitive);



/*
https://tradingview.github.io/lightweight-charts/tutorials/demos/range-switcher

 */