import {
	createChart,
	createTextWatermark,
	LineSeries,
	CandlestickSeries,
	HistogramSeries,
	LineStyle
} from './js/lightweight-charts.standalone.development.mjs';

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

const candleSeries = chart.addSeries(CandlestickSeries, {
	upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
	wickUpColor: '#26a69a', wickDownColor: '#ef5350',
	priceFormat: {
			type: 'price',	// percent | price | volume
		},
});
const volumeSeries = chart.addSeries(HistogramSeries, {
		color: '#05530522',
		lineWidth: 1,
		priceFormat: {
			type: 'volume',
		},
	},
	1 // Pane index
);
const speedSeries = chart.addSeries(HistogramSeries, {
		color: '#05530522',
		lineWidth: 1,
		priceFormat: {
			type: 'volume',
		},
	},
	2 // Pane index
);



async function getData(symbol, interval, limit) {
	const url = "http://localhost:3000/klines/" + symbol + "/" + interval + "/" + limit;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const data = await response.json();
		console.log(data);

		candleSeries.setData(data);
		volumeSeries.setData(
			data.map(item => ({
				time: item.time,
				value: item.volume,
			}))
		);
		speedSeries.setData(
			data.map(item => ({
				time: item.time,
				value: item.numtrades
			}))
		);
		// lineSeries.setData(data);

	} catch (error) {
		console.error(error.message);
	}
}

const iks = getData("ETHUSDT", "4h", 50);

chart.timeScale().fitContent();


/////////////
// LEGEND
/////////////
class Legenda {
	firstRow;
	constructor() {
		const container = document.getElementById('tv_chart');
		const legendDiv = document.createElement('div');
		legendDiv.style = `position: absolute; left: 12px; top: 12px; z-index: 1; font-size: 14px; font-family: sans-serif; line-height: 18px; font-weight: 300;`;
		container.appendChild(legendDiv);
		this.firstRow = document.createElement('div');
		this.firstRow.innerHTML = 'symbolName';
		this.firstRow.style.color = 'green';
		legendDiv.appendChild(this.firstRow);

	}
	setText(txt){
		this.firstRow.innerHTML = txt;
	}
}
const l1 = new Legenda();
l1.setText('patka');

/////////////////////
// Watermark
/////////////////////
const firstPane = chart.panes()[1];
const textWatermark = createTextWatermark(firstPane, {
	vertAlign: 'top',
	horzAlign: 'left',
	lines: [
		{
			text: 'Watermark',
			color: '#ff2277ff',
			fontSize: 14,
		},
	],
});


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



