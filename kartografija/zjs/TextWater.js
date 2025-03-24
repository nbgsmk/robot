
import { createTextWatermark } from "../js/lightweight-charts.standalone.development.mjs";

/**
 * TextWaterMark for a panelId (zero-based)
 * @link https://tradingview.github.io/lightweight-charts/tutorials/how_to/watermark
 */
export class TextWater {
	tw;
	col = '#ff3377ff';
	fs = 14;

	/**
	 * @param chart container created with createChart(document.getElementById(...
	 * @param panelId zero-based number of sub-panel where to create text watermark
	 * @param txt text to be displayed
	 */
	constructor(chart, panelId, txt) {
		this.tw = createTextWatermark(chart.panes()[panelId], {
			vertAlign: 'top',
			horzAlign: 'left',
			lines: [ {
				text: txt,
				color: this.col,
				fontSize: this.fs,
			}]
		})
	}

	/**
	 * @param txt text to be displayed
	 */
	setText(txt) {
		this.tw.applyOptions({
			lines: [{
				text: txt,
				color: this.col,
				fontSize: this.fs,
			}]
		})
	}
}

