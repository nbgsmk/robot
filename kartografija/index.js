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

//////////////////
// uvek postoji
//////////////////
// price, volume, number of trades
const priceSeries = chart.addSeries(CandlestickSeries, {
	// title: 'ticker',
	upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
	wickUpColor: '#26a69a', wickDownColor: '#ef5350',
	priceFormat: {
			type: 'price',	// percent | price | volume
		},
	}, 0, );
const volumeSeries = chart.addSeries(HistogramSeries, {
		// title: 'volume',
		color: '#05530511',
		lineWidth: 1,
		priceFormat: {
			type: 'volume',
		},
	}, 1, );
const tradeSeries = chart.addSeries(HistogramSeries, {
		// title: 'trades',
		color: '#05530511',
		lineWidth: 1,
		priceFormat: {
			type: 'volume',
		},
	}, 2, );

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
const deltaSeriesOC = chart.addSeries(LineSeries, { color: '#920000', lineWidth: 1, priceFormat: {type: 'volume',},}, 3,);
const deltaSeriesHL = chart.addSeries(LineSeries, { color: '#02bb99', lineWidth: 1, priceFormat: {type: 'volume',},}, 3,);


// LEGENDE
const l1 = new Legenda('tv_chart');
const wmV = new TextWater(chart, 1, 'volume');
const wmS = new TextWater(chart, 2, 'trading speed');
const wmD = new TextWater(chart, 3, 'price delta');

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
		volumeSeries.setData(
			data.map(item => ({
				time: item.time,
				value: item.vol.raw,
			}))
		);
		tradeSeries.setData(
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
		deltaSeriesOC.setData(data.map(item => ({time: item.time, value: (item.close - item.open),})));
		// deltaSeriesHL.setData(data.map(item => ({time: item.time, value: (item.high - item.low),})));
		deltaSeriesHL.setData(data.map(item => ({time: item.time, value: item.delta.fast,})));

		l1.setText(symbol + ' / ' + interval);


	} catch (error) {
		console.error(error.message);
	}
}

const iks = getData("BTCUSDT", "1h", 1000);

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