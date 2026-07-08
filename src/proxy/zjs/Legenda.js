/**
 * Chart Legend
 * @link https://tradingview.github.io/lightweight-charts/tutorials/how_to/legends
 */
export class Legenda {
	row1;

	/**
	 * @param chartDiv where the chart was created with createChart(document.getElementById(...some_div...
	 *
	 */
	constructor(chartDiv) {
		const chart = document.getElementById(chartDiv);
		const legendDiv = document.createElement('div');
		legendDiv.style = `position: absolute; left: 12px; top: 12px; z-index: 1; font-size: 24px; font-family: sans-serif; line-height: 28px; font-weight: 500;`;
		chart.appendChild(legendDiv);
		this.row1 = document.createElement('div');
		// this.row1.innerHTML = 'legend placeholder';
		this.row1.innerHTML = ' ';
		this.row1.style.color = 'green';
		legendDiv.appendChild(this.row1);
	}

	/**
	 * @param txt text to be displayed
	 */
	setText(txt){
		this.row1.innerHTML = txt;
	}
}