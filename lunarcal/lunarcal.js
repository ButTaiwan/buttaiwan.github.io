var Now = null;

var HolidayLunar = {		// 除夕特例處理
	'1-1': '春節',
	'1-2': '春節',
	'1-3': '春節',
	'5-5': '端午',
	'8-15': '中秋'
};

var HolidaySolar = {		// 清明特例處理
	//'1-1': '元旦',		// 元旦跳過(為了顯示年分)
	'2-28': '和平日',
	'4-4': '兒童節',
	'10-10': '雙十節'
};

function draw() {
	$('#head').text(Now.mstr + (Now.days == 30 ? '大' : '小'));
	$('#adyear').text(Now.year + ' ' + Now.ystr);
	
	var html = '<table id="cal">';
	html += '<tr><th class="w0">日</th><th>月</th><th>火</th><th>水</th><th>木</th><th>金</th><th class="w6">土</th></tr>';
	
	if (Now.start > 0) html += '<tr><td colspan="' + Now.start + '" class="empty"></td>';
	for (var i=1; i<=Now.days; i++) {
		var w = (Now.start + i - 1) % 7;
		var d = calendar.lunar2solar(Now.year, Now.month, i, Now.isLeap);
		var cls = 'w' + w;
		var clst = '';
		
		var t = d.Term || d.cDay;	//dayToChinese(d.cDay);
		if (d.cDay == 1) {
			t = d.cYear + '/' + d.cMonth;
			clst = ' x';
		}
		
		// holiday test
		if (d.cDay == 1 && d.cMonth == 1) {
			t = d.cYear + '元旦';
			cls = 'w0';
		} else if (!Now.isLeap && Now.month == 12 && Now.days == i) {
			t = '除夕';
			cls = 'w0';
		} else if (!Now.isLeap && HolidayLunar[Now.month + '-' + i]) {
			if (HolidayLunar[Now.month + '-' + i] != '春節') t = HolidayLunar[Now.month + '-' + i];
			cls = 'w0';
		} else if (HolidaySolar[d.cMonth + '-' + d.cDay]) {
			t = HolidaySolar[d.cMonth + '-' + d.cDay];
			cls = 'w0';
		} else if (d.Term == '清明') {
			cls = 'w0';
		}
		
		var today = new Date();
		if (d.cYear == today.getFullYear() && d.cMonth == today.getMonth()+1 && d.cDay == today.getDate()) {
			cls += ' today';
		}

		if (w == 0) html += '<tr>';
		html += '<td class="' + cls + '"><span class="d">' + i + '</span>';
		html += '<span class="t' + clst + '">' + t + '</span>';
		html += '</td>';
		if (w == 6) html += '</tr>';
	}
	html += '</table>';
	
	$('#main').html(html);
}

function setLunarMonth(year, month, isLeap) {
	var d = calendar.lunar2solar(year, month, 1, isLeap);
	
	var mdays = d.isLeap ? calendar.leapDays(d.lYear) : calendar.monthDays(d.lYear, d.lMonth);
	
	Now = {
		year: d.lYear,
		month: d.lMonth,
		isLeap: d.isLeap,
		days: mdays,
		
		ystr: d.gzYear + '年',
		mstr: monthToChinese(d.lMonth, d.isLeap),
		start: d.nWeek,
		leapMonth: calendar.leapMonth(d.lYear)
	};
	
	console.log(Now);
	console.log(d);

	draw();
}

function init() {
	var sToday = new Date();
	var lToday = calendar.solar2lunar(sToday.getFullYear(), sToday.getMonth()+1, sToday.getDate());
	
	setLunarMonth(lToday.lYear, lToday.lMonth, lToday.isLeap);

	$('#nexty').click(function() {
		setLunarMonth(Now.year+1, Now.month, false);
	});

	$('#prevy').click(function() {
		setLunarMonth(Now.year-1, Now.month, false);
	});

	$('#next').click(function() {
		if (Now.month == calendar.leapMonth(Now.year) && !Now.isLeap) {
			setLunarMonth(Now.year, Now.month, true);
		} else if (Now.month == 12) {
			setLunarMonth(Now.year+1, 1, false);
		} else {
			setLunarMonth(Now.year, Now.month + 1, false);
		}
	});

	$('#prev').click(function() {
		if (Now.isLeap) {
			setLunarMonth(Now.year, Now.month, false);
			return;
		}
		
		var lastYear = Now.year;
		var lastMonth = Now.month - 1;

		if (lastMonth == 0) {
			lastYear = Now.year-1;
			lastMonth = 12;
		}
		
		if (lastMonth == calendar.leapMonth(lastYear)) {
			setLunarMonth(lastYear, lastMonth, true);
		} else {
			setLunarMonth(lastYear, lastMonth, false);
		}
	
	});


}

var zhnum = ['十', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

function monthToChinese(i, isLeap) {
	if (i <= 10)
		return (isLeap ? '閏' : '') + zhnum[i] + '月';
	else 
		return (isLeap ? '閏' : '') + '十' + zhnum[i%10] + '月';
}

function dayToChinese(i) {
	if (i <= 10)
		return zhnum[i] + '日';
	else if (i%10 == 0)
		return zhnum[i/10] + '十';
	else if (i < 20)
		return '十' + zhnum[i%10];
	else if (i < 30)
		return '廿' + zhnum[i%10];
	else if (i == 31)
		return '卅一';
	
	return null;
}


$(document.body).ready(function() {
	init();
});