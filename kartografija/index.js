import {
	createChart,
	LineSeries,
	CandlestickSeries,
	HistogramSeries,
	LineStyle
} from './js/lightweight-charts.standalone.development.mjs';

const chartOptions = {
	layout: {
		textColor: 'blue',
		background: {
			type: 'solid',
			color: 'white'
		},
		panes: {
            separatorColor: '#ff0000ff',
            separatorHoverColor: '#ff000022',
            enableResize: true,
        },
	}
};
const chart = createChart(document.getElementById('tv_chart'), chartOptions);

const candleSeries = chart.addSeries(CandlestickSeries, {
	upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
	wickUpColor: '#26a69a', wickDownColor: '#ef5350',
});
const volumeSeries = chart.addSeries(
	HistogramSeries,
	{
		color: '#05530522',
		lineWidth: 1,
		priceFormat: {
			type: 'volume',
		},
	},
	1 // Pane index
);
const speedSeries = chart.addSeries(
	HistogramSeries,
	{
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

const iks = getData("ETHUSDT", "5m", 500);

chart.timeScale().fitContent();


/////////////
// LEGEND
/////////////
const symbolName = 'Legenda kralju';
const container = document.getElementById('tv_chart');
const legend = document.createElement('div');
legend.style = `position: absolute; left: 12px; top: 12px; z-index: 1; font-size: 14px; font-family: sans-serif; line-height: 18px; font-weight: 300;`;
container.appendChild(legend);
const firstRow = document.createElement('div');
firstRow.innerHTML = symbolName;
firstRow.style.color = 'green';
legend.appendChild(firstRow);


//////////////////////
// Series primitive
//////////////////////
class MySeriesPrimitive {
    /* Class implementing the ISeriesPrimitive interface */
}
const mySeriesPrimitive = new MySeriesPrimitive();
speedSeries.attachPrimitive(mySeriesPrimitive);

////////////////////
// Pane primitive
////////////////////
class MyPanePrimitive {
	/* Class implementing the IPanePrimitive interface */
}
const myPanePrimitive = new MyPanePrimitive();
const mainPane = chart.panes()[1]; // Get the main pane
mainPane.attachPrimitive(myPanePrimitive);