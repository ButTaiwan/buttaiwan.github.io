//var jsonUrl = 'https://spreadsheets.google.com/feeds/list/1e4gNpYWM_r_6CurWEBmvbMVLxitvZh_CZbC4nUhkc2Q/od6/public/values?alt=json';
//var Color = { BL: '#0072C6', BR: '#AA753F', O: '#FCA311', G: '#007C59', R: '#D12D33', Y: '#F7DB17' };

Date.prototype.toKey = function() { return this.getFullYear() + '' + (this.getMonth() < 9 ? '0' : '') + (this.getMonth()+1); };
function ymKey(dstr) { return new Date(dstr).toKey(); }
function lastMonthKey(ym) { return new Date(ym.substr(0, 4)*1, ym.substr(4, 2)*1-2, 1).toKey(); }
function lastYearKey(ym) { return new Date(ym.substr(0, 4)*1-1, ym.substr(4, 2)*1-1, 1).toKey(); }
//function toText(ym) { return (ym.substr(0, 4)*1-1911) + '年' + (ym.substr(4, 2)*1) + '月'; };
function toText(ym) { return (ym.substr(0, 4)*1) + '年' + (ym.substr(4, 2)*1) + '月'; };
	
Number.prototype.cut = function() {
	var s = this + '';
	var i = s.indexOf('.');
	return i < 0 ? s + '.00' : (s + '000').substr(0, i+3);
};

function loadData(res, colors) {
	var initRow = 0;
	var colorCol = 1;
	var initCol = 2;
	var dateMap = {};
	var counts = {};

	for (var j=initCol; j<res.values[initRow].length; j++) {
		dateMap[j] = ymKey(res.values[initRow][j]);
	}
	//console.log(dateMap);

	for (var i=initRow+1; i<res.values.length; i++) {
		var sta = res.values[i][0];
		var codes = res.values[i][colorCol];
		colors[sta] = codes.replace(/\d+[Aa]?/g, '').split(';');
		var tmp = codes.split(';');
		for (var n in tmp) numberlings.push({'c': tmp[n], 's': sta});

		counts[sta] = {};
		for (var j=initCol; j<res.values[i].length; j++) {
			counts[sta][dateMap[j]] = res.values[i][j] * 1;
		}
	}
	numberlings.sort(function(a, b) { return (a.c == b.c) ? 0 : (a.c < b.c ? -1 : 1); });
	
	return counts;
}

function fetchMonths(counts) {
	var months = [];
	for (var ym in counts[xSta]) {
		months.push(ym);
	}
	months.sort();
	return months;
}

function countRank(counts, rankIndex) {
	var ranks = { 'max': {} };
	
	for (var ym in counts[xSta]) {
		var tmp = [];
		for (var sta in counts) {
			tmp.push({'s': sta, 'c': counts[sta][ym] || 0});
		}
		tmp.sort(function(a, b) { return (a.c == b.c) ? 0 : (a.c < b.c ? 1 : -1); });
		
		rankIndex[ym] = [];
		for (var i in tmp) {
			if (tmp[i].c == 0) continue;
			var sta = tmp[i].s;
			rankIndex[ym].push(sta);
			if (!ranks[sta]) ranks[sta] = {};
			ranks[sta][ym] = ranks['max'][ym] = i*1+1;
		}
	}
	return ranks;
}

function countTops(counts) {
	var tops = {};
	
	for (var sta in counts) {
		var tmp = [];
		for (var ym in counts[sta]) {
			if (counts[sta][ym]) tmp.push({'ym': ym, 'c': counts[sta][ym]});
		}
		tmp.sort(function(a, b) { return (a.c == b.c) ? 0 : (a.c < b.c ? 1 : -1); });
		
		tops[sta] = {};
		for (var i in tmp) {
			//if (tmp[i].c == 0) continue;
			var ym = tmp[i].ym;
			if (i*1 <= 10) tops[sta][ym] = i*1+1;
			else if (i >= tmp.length-10) tops[sta][ym] = i*1-tmp.length;
		}
	}
	
	return tops;
}

function countRatios(counts) {
	var ratios = {};
	for (var i in months) {
		var ym = months[i];
		var total = 0;
		for (var sta in counts) {
			if (counts[sta][ym]) total += counts[sta][ym];
		}
		for (var sta in counts) {
			if (!ratios[sta]) ratios[sta] = {};
			ratios[sta][ym] = counts[sta][ym] * 2 / total;
		}
	}
	return ratios;
}

function showMonthUI(ym) {
	var lmym = lastMonthKey(ym);
	var lyym = lastYearKey(ym);
	
	var tmp = [];
	for (var i in rankIndex[ym]) {
		var sta = rankIndex[ym][i];
		if (counts[sta][lyym]) tmp.push({'s': sta, 'v': (counts[sta][ym] - counts[sta][lyym])*100.0 / counts[sta][lyym]});
	}
	tmp.sort(function(a, b) { return (a.v == b.v) ? 0 : (a.v < b.v ? 1 : -1); });
	var ydiff = {};
	for (var i in tmp) {
		ydiff[tmp[i].s] = { 'value': tmp[i].v };
		if (i*1 < 10 && tmp[i].v > 0) ydiff[tmp[i].s].rank = i*1+1;
		if (i*1 >= tmp.length - 10 && tmp[i].v < 0) ydiff[tmp[i].s].rank = -(tmp.length-i*1);
	}
	
	var html = '<h1>' + system + '<select id="selYM">';
	for (var i in months) {
		html += '<option value="' + months[i] + '"' + (months[i] == ym ? ' selected' : '') + '>';
		html += toText(months[i]) + '</option>';
	}
	html += '</select>各站進出旅運量日平均</h1>';
	
	html += '<table>';
	html += '<tr><th colspan="2">名次</th><th>車站</th>';
	html += '<th colspan="2">' + toText(ym) + '<br>日均進出人次</th><th>旅客比</th>';
	html += '<th>' + toText(lmym) + '<br>日均進出人次</th><th>較上月增減</th>';
	html += '<th>' + toText(lyym) + '<br>日均進出人次</th><th>較去年<br>同月增減</th><th>&nbsp;</th></tr>';
	
	for (var i in rankIndex[ym]) {
		if (i % 10 == 0) html += '<tr class="x"></tr>';
		
		var sta = rankIndex[ym][i];
		var rdiff = ranks[sta][lmym] ? ranks[sta][lmym] - ranks[sta][ym] : 0;
		
		html += '<tr class="z">';
		if (rdiff > 0) {
			html += '<td class="rd up">↑' + rdiff + '</td>';
		} else if (rdiff < 0) {
			html += '<td class="rd dn">↓' + (-rdiff) + '</td>';
		} else {
			html += '<td class="rd"></td>';
		}
		
		var style = colors[sta].length > 1 ? 
			'background-image: linear-gradient(to bottom, ' + Color[colors[sta][0]] + ' 49%, ' + Color[colors[sta][1]] + ' 50%)' :
			'background-color: ' + Color[colors[sta][0]]; // + ';' + (colors[sta][0] == 'O' ? 'color: #000' : '');
		
		html += '<td class="r">' + ranks[sta][ym] + '</td>';
		html += '<td class="sta" style="' + style + '">' + sta + '</td>';
		html += '<td class="c curr">' + counts[sta][ym].toLocaleString() + '</td>';
		
		var newRecord = true;
		for (var m in months) {
			if (months[m] == ym) break;
			if (counts[sta][months[m]] > counts[sta][ym]) newRecord = false;
		}
		
		html += '<td>' + (newRecord ? '*' : '');
		if (tops[sta][ym] > 0 && tops[sta][ym] <= 5) {
			html += '<span class="up">' + (' ①②③④⑤⑥⑦⑧⑨⑩'.charAt(tops[sta][ym]*1)) + '</span>';
		} else if (tops[sta][ym] < 0 && tops[sta][ym] >= -5) {
			html += '<span class="dn">' + (' ①②③④⑤'.charAt(-tops[sta][ym]*1)) + '</span>';
		}
		html += '</td>';
		// ①②③④⑤⑥⑦⑧⑨⑩
		html += '<td class="p">' + (ratios[sta][ym]*100.0).cut() + '%</td>';
		
		if (counts[sta][lmym]) {
			html += '<td class="c">' + counts[sta][lmym].toLocaleString() + '</td>';
			html += '<td class="p">' + ((counts[sta][ym] - counts[sta][lmym])*100.0 / counts[sta][lmym]).cut() + '%</td>';
		} else {
			html += '<td class="n">-</td><td class="n">-</td>';
		}
		
		if (counts[sta][lyym]) {
			html += '<td class="c">' + counts[sta][lyym].toLocaleString() + '</td>';
			html += '<td class="p">' + ydiff[sta].value.cut() + '%</td>';
			if (ydiff[sta].rank > 0) {
				html += '<td class="up">▲' + ydiff[sta].rank + '</td>';
			} else if (ydiff[sta].rank < 0) {
				html += '<td class="dn">▼' + (-ydiff[sta].rank) + '</td>';
			} else {
				html += '<td class="n"></td>';
			}
		} else {
			html += '<td class="n">-</td><td class="n">-</td>';
		}
		
		html += '</tr>';
	}
	
	//html += '<tr class="x"></tr>';
	html += '</table>';
	
	html += '<ol id="note">';
	html += '<li>資料來源：' + source + '<br>';
  	html += '計算方式：（入站+出站）/營運日數';
	for (var ni in notes) html += '<li>' + notes[ni];
	html += '<li>若本月運量為通車以來最高，則以「*」註記。';
	html += '<li>旅客比：在此站進出的旅客比例。計算方式： (日均進出人次/當月全站進出人次總和) × 2';
	html += '<li>圈號數字是' + toText(months[0]) + '至' + toText(months[months.length-1]) + '止運量記錄前<span class="up">⑤</span>高與前<span class="dn">⑤</span>低的月份。';
	html += '<li><span class="rd">&nbsp;&nbsp;&nbsp;</span>色塊內「<span class="up">↑</span>」及「<span class="dn">↓</span>」分別表示該車站名次比上月上升及下降（數字為排名數）；';
	html += '「<span class="up">▲</span>」及「<span class="dn">▼</span>」分別表示運量比去年同期成長及衰退最多之車站（數字為依成長或衰退百分比排名之名次）。';
	html += '</ol>';
	
	$('#main').html(html);
}

function showStationUI(sta) {
	var html = '<h1>' + system + '<select id="selSta">';
	for (var i in numberlings) {
		var s = numberlings[i].s;
		html += '<option value="' + s + '" class="c' + numberlings[i].c.replace(/\d+A?/i, '') + '" ' + (s == sta ? ' selected' : '') + '>';
		html += numberlings[i].c + ' ' + s + '</option>';
	}
	html += '</select>站進出旅運量日平均演進</h1>';
	
	html += '<table>';
	html += '<tr><th>順位</th><th>月份</th>';
	html += '<th colspan="2">日均進出人次</th><th>全站排名</th><th>旅客比</th>';
	html += '<th>較上月增減</th><th class="h">&nbsp;</th></tr>';

	var min = 999999999, max = 0;
	for (var ym in counts[sta]) {
		if (counts[sta][ym] > max) max = counts[sta][ym];
		if (counts[sta][ym] < min) min = counts[sta][ym];
	}
	
	var lmym = null;
	var maxVal = 0;
	for (var i in months) {
		var ym = months[i];
		if (!counts[sta][ym]) continue;
		if (ym.substr(4, 2) == '01') html += '<tr class="x"></tr>';
		
		html += '<tr class="z">';
		if (tops[sta][ym] > 0 && tops[sta][ym] <= 10) {
			html += '<td class="r up">' + (' ①②③④⑤⑥⑦⑧⑨⑩'.charAt(tops[sta][ym]*1)) + '</td>';
		} else if (tops[sta][ym] < 0 && tops[sta][ym] >= -5) {
			html += '<td class="r dn">' + (' ①②③④⑤⑥⑦⑧⑨⑩'.charAt(-tops[sta][ym]*1)) + '</td>';
		} else { html += '<td class="r"></td>'; }
		
		html += '<td class="ym" data-val="' + ym + '">' + toText(ym) + '</td>';
		html += '<td class="c curr">' + counts[sta][ym].toLocaleString() + '</td>';
		html += '<td>' + (counts[sta][ym] > maxVal ? '*' : '') + '</td>';
		if (counts[sta][ym] > maxVal) maxVal = counts[sta][ym];
		html += '<td class="r">' + ranks[sta][ym] + '/' + ranks['max'][ym] + '</td>';
		
		html += '<td class="p">' + (ratios[sta][ym]*100.0).cut() + '%</td>';
		
		if (lmym && counts[sta][lmym]) {
			html += '<td class="p">' + ((counts[sta][ym] - counts[sta][lmym])*100.0 / counts[sta][lmym]).cut() + '%</td>';
		} else {
			html += '<td class="n">-</td>';
		}
		
		html += '<td><span class="bar" style="width: ' + Math.floor(20 + (280.0*(counts[sta][ym]-min) / (max-min))) + 'px">&nbsp;</span></td>';
		
		html += '</tr>';
		lmym = ym;
	}
	
	html += '</table>';
	
	html += '<ol id="note">';
	html += '<li>資料來源：' + source + '<br>';
  	html += '計算方式：（入站+出站）/營運日數';
	for (var ni in notes) html += '<li>' + notes[ni];
	html += '<li>圈號數字是' + toText(months[0]) + '至' + toText(months[months.length-1]) + '止運量記錄前<span class="up">⑩</span>高與前<span class="dn">⑤</span>低的月份。';
	html += '<li>若本月運量為通車以來最高，則以「*」註記。';
	html += '<li>旅客比：在此站進出的旅客比例。計算方式： (日均進出人次/當月全站進出人次總和) × 2';
	html += '</ol>';
	
	$('#main').html(html);
}

function setUI() {
	var val = decodeURIComponent((window.location.hash + '').replace(/^#/, ''));
	if (val.match(/^20[0-3]\d{3}$/)) {
		showMonthUI(val);
	} else if (counts[val]) {
		showStationUI(val);
	} else {
		showMonthUI(months[months.length-1]);
	}
}

function setUrl(val) {
	window.location.hash = '' + val;
	setUI();
}

var months;
var counts;
var ranks;
var rankIndex;
var tops;
var colors;
var numberlings;
var ratios;

function init() {
	$.getJSON(jsonUrl, function(res) {
		colors = {};
		numberlings = [];
		counts = loadData(res, colors, numberlings);
		months = fetchMonths(counts);
		rankIndex = {};
		ranks = countRank(counts, rankIndex);
		tops = countTops(counts);
		ratios = countRatios(counts);
		setUI();
	});

	$('#foot').html('<a href="./">台北捷運</a> | <a href="./nt.html">新北捷運</a> | <a href="./ty.html">桃園捷運</a> | <a href="./tc.html">台中捷運</a> | <a href="./ks.html">高雄捷運</a>');
}

$(document).on('change', "#selYM", function() { setUrl($(this).val()); } );
$(document).on('change', "#selSta", function() { setUrl($(this).val()); } );
$(document).on('click', "td.sta", function() { setUrl($(this).text()); } );
$(document).on('click', "td.ym", function() { setUrl($(this).data('val')); } );
window.onpopstate = setUI;

init();
