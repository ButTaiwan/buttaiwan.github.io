const upm = 1000;
let lineWidth = 12; // 預設畫筆粗細為 12

const dbName = fdrawer.dbName || 'FontDrawerDB'; // 使用 fdrawer.dbName，如果未定義則使用預設值
const storeName = 'FontData';
let db;

// 初始化 IndexedDB
function initDB() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName, 1);

		request.onupgradeneeded = function (event) {
			db = event.target.result;
			if (!db.objectStoreNames.contains(storeName)) {
				db.createObjectStore(storeName, { keyPath: 'key' });
			}
		};

		request.onsuccess = function (event) {
			db = event.target.result;
			resolve(db);
		};

		request.onerror = function (event) {
			reject(event.target.error);
		};
	});
}

// 儲存資料到 IndexedDB
function saveToDB(key, value) {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([storeName], 'readwrite');
		const store = transaction.objectStore(storeName);
		const request = store.put({ key, value });

		request.onsuccess = function () {
			resolve();
		};

		request.onerror = function (event) {
			reject(event.target.error);
		};
	});
}

// 從 IndexedDB 讀取資料
function loadFromDB(key) {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([storeName], 'readonly');
		const store = transaction.objectStore(storeName);
		const request = store.get(key);

		request.onsuccess = function (event) {
			resolve(event.target.result ? event.target.result.value : null);
		};

		request.onerror = function (event) {
			reject(event.target.error);
		};
	});
}

function countGlyphFromDB() {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([storeName], 'readonly');
		const store = transaction.objectStore(storeName);
		const cursorRequest = store.openCursor();

		let count = 0;
		cursorRequest.onsuccess = function (event) {
			const cursor = event.target.result;
			if (cursor) {
				if (cursor.key.startsWith('g_')) count++;
				cursor.continue();
			} else {
				resolve(count); // 當游標完成時，返回計數
			}
		};

		cursorRequest.onerror = function (event) {
			reject(event.target.error);
		};
	});
}

// 刪除 IndexedDB 中的資料
function deleteFromDB(key) {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([storeName], 'readwrite');
		const store = transaction.objectStore(storeName);
		const request = store.delete(key);

		request.onsuccess = function () {
			resolve();
		};

		request.onerror = function (event) {
			reject(event.target.error);
		};
	});
}

// 清除 IndexedDB
function clearDB() {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([storeName], 'readwrite');
		const store = transaction.objectStore(storeName);
		const request = store.clear();

		request.onsuccess = function () {
			resolve();
		};

		request.onerror = function (event) {
			reject(event.target.error);
		};
	});
}

// 初始化
async function initCanvas(canvas) {
	canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
	canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

	var scale = await loadFromDB('scaleRate') || 100; // 縮放比例，預設為 100%
	scale = parseInt(scale, 10) / 100; // 轉換為小數
	//var scaleoff = (upm - scale * upm) / 2; // 縮放偏移量

	// 繪製九宮格底圖
	const gridCanvas = document.getElementById('gridCanvas');
	const gridCtx = gridCanvas.getContext('2d');
	gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

	const emWidth = gridCanvas.width / scale;			// 字身框寬度
	const emHeight = gridCanvas.height / scale;			// 字身框高度
	const gridXOff = (gridCanvas.width - emWidth) / 2;	// X 軸偏移量
	const gridYOff = (gridCanvas.height - emHeight) / 2;	// X 軸偏移量

	//const gridWidth = Math.round(gridCanvas.width / scale / 3);		// 每格寬度
	//const gridHeight = Math.round(gridCanvas.height / scale / 3);	// 每格高度

	gridCtx.strokeStyle = '#cccccc';
	gridCtx.lineWidth = 1;

	// 繪製格線
	for (let i = 0; i <= 3; i++) {
		gridCtx.beginPath();
		gridCtx.moveTo(gridXOff + emWidth * i / 3, gridYOff);
		gridCtx.lineTo(gridXOff + emWidth * i / 3, gridYOff + emHeight);
		gridCtx.stroke();

		gridCtx.beginPath();
		gridCtx.moveTo(gridXOff, gridYOff + emHeight * i / 3);
		gridCtx.lineTo(gridXOff + emWidth, gridYOff + emHeight * i / 3);
		gridCtx.stroke();

	}

	// 繪製基線
	gridCtx.strokeStyle = '#eebbbb';	// 基線顏色
	gridCtx.beginPath();
	gridCtx.moveTo(gridXOff, gridYOff + emHeight*0.72);
	gridCtx.lineTo(gridXOff + emWidth, gridYOff + emHeight*0.72);
	gridCtx.stroke();

	// 載入筆寬設定
	const savedLineWidth = await loadFromDB('lineWidth');
	if (savedLineWidth) {
		lineWidth = parseInt(savedLineWidth, 10);
		$('#lineWidthSlider').val(lineWidth);
		$('#lineWidthValue').text(lineWidth);
	}
}

function initListSelect($listSelect) {
	for (var list in glyphList) {
		$listSelect.append(
			$('<option></option>').val(list).text(list)
		);
	}
}

async function createFont(glyphs, gidMap, verts, ccmps) {
	const fontNameEng = await loadFromDB('fontNameEng') || 'MyFreehandFont';
	const fontNameCJK = await loadFromDB('fontNameCJK') || fdrawer.fontNameCJK;
	
	const font = new opentype.Font({
		familyName: fontNameEng,
		fullName: fontNameEng,
		postScriptName: fontNameEng.replace(/[^a-zA-Z0-9]/g, ''), // 去除特殊字符
		styleName: 'Regular',
		designer: 'zi-hi.com',
		designerURL: 'https://zi-hi.com',
		manufacturer: 'zi-hi.com',
		manufacturerURL: 'https://zi-hi.com',

		unitsPerEm: upm,
		ascender: 880,
		descender: -120,
		glyphs: glyphs
	});

	for (var group in font.names) {
		font.names[group].fontFamily[fdrawer.fontLang] = fontNameCJK;
		font.names[group].fullName[fdrawer.fontLang] = fontNameCJK;
	}

	font.tables.os2.achVendID = 'ZIHI';
	font.tables.os2.ulCodePageRange1 = fdrawer.codePage; // CodePage
	font.tables.os2.usWinAscent = 920; // Windows ascent
	font.tables.os2.usWinDescent = 200; // Windows ascent
	font.tables.os2.xAvgCharWidth = upm;

	// ccmps
	for (let i in ccmps) {
		var gname_to = ccmps[i];
		var allpass = true;
		var subfrom = [];
		for (let i in glyphMap[gname_to].s) {
			var gname_from = glyphMap[gname_to].s[i];
			if (!gidMap[gname_from]) allpass = false;
			subfrom.push(gidMap[gname_from]);
		}
		if (!allpass) continue;
		font.substitution.addLigature('ccmp', {sub: subfrom, by: gidMap[gname_to]});
	}

	// verts
	for (let i in verts) {
		var gname_v = verts[i];
		var gname_h = glyphMap[gname_v].v;
		if (!gidMap[gname_v]) continue; // 如果沒有對應的 cid，則跳過
		if (!gidMap[gname_h]) continue; // 如果沒有對應的 cid，則跳過
		font.substitution.addSingle('vert', {sub: gidMap[gname_h], by: gidMap[gname_v]});
	}

	return font;
}

$(document).ready(async function () {
	const $listSelect = $('#listSelect');

    const $canvas = $('#drawingCanvas');
    const canvas = $canvas[0];
    const ctx = canvas.getContext('2d');
	let ratio = canvas.height / $canvas.height();
    let isDrawing = false;
    const undoStack = []; // 儲存畫布狀態的堆疊
	const $naviContainer = $('#navi-container');
	const $progressContainer = $('#progress-container');
    const $progressBar = $('#progress-bar');
    const $progressText = $('#progress-text');

    // 初始化 IndexedDB
    initDB().then(() => {
        console.log('IndexedDB 起動完成');
		initCanvas(canvas);	// 初始化九宮格底圖
		$listSelect.change(); // 觸發一次 change 事件以載入第一個列表
    }).catch((error) => {
        console.error('IndexedDB 起動失敗', error);
    });


	let nowList = null;
	let nowGlyphIndex = null;
	let nowGlyph = null;

	initListSelect($listSelect);


	// 切換列表
	$listSelect.on('change', function () {
		const selectedValue = $(this).val();
		if (selectedValue) {
			nowList = glyphList[selectedValue];
			nowGlyphIndex = 0; // 重置當前字形索引
			setGlyph(0);
		}
	});	//.change(); // 觸發一次 change 事件以載入第一個列表

	// 設定編輯中的字符
	function setGlyph(index) {
		if (!nowList) return;
		if (index < 0) index = nowList.length - 1; // 如果索引小於0，則設為最後一個字符
		if (index >= nowList.length) index = 0; // 如果索引大於字符數量，則設為第一個字符
		nowGlyphIndex = index;
		nowGlyph = nowList[index]; // 取得當前字符的名稱
	
		$('#glyphName').text(nowGlyph); // 更新顯示的字符
		$('#charSeq').text(glyphMap[nowGlyph].c).removeClass('vert');
		if (glyphMap[nowGlyph].v && nowGlyph.indexOf('.vert') > 0) $('#charSeq').addClass('vert');

		$('#glyphNote').text(glyphMap[nowGlyph].n || '');

		// 載入之前的畫布內容
		undoStack.length = 0; // 清空復原堆疊
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		loadCanvasData(nowGlyph);
	}

	// 儲存畫布的功能
	async function saveToLocalDB() {
		const dataURL = canvas.toDataURL();
		const svgData = await toSVG(nowGlyph, dataURL); // SVG 版本

		if (svgData && svgData != '') {
			await saveToDB('g_' + nowGlyph, dataURL);
			await saveToDB('s_' + nowGlyph, svgData);
		} else {
			await deleteFromDB('g_' + nowGlyph);
			await deleteFromDB('s_' + nowGlyph);
		}
		
		//console.log(nowGlyph, dataURL, svgData);
	}

	// 修改讀取畫布的功能
	async function loadCanvasData(glyph) {
		const savedCanvas = await loadFromDB('g_' + glyph);
		if (savedCanvas) {
			const img = new Image();
			img.src = savedCanvas;
			img.onload = function () {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(img, 0, 0);
			};
		}
	}

	$('#prevButton').on('click', function () { setGlyph(nowGlyphIndex - 1); }); // 切換到上一個字符
	$('#nextButton').on('click', function () { setGlyph(nowGlyphIndex + 1); }); // 切換到下一個字符

    $('#findButton').on('click', function () {
		var char = prompt(fdrawer.findMsg);
		if (!char) return; // 如果沒有輸入字符，則不進行任何操作
		char = char.trim(); // 去除前後空白
		if (char.length === 0) return;

		var breakFlag = false;
		for (let i in glyphList) {
			for (let j in glyphList[i]) {
				if (glyphMap[glyphList[i][j]].c == char) {
					nowList = glyphList[i];
					$listSelect.val(i); 	// 更新下拉選單的值
					setGlyph(j*1);
					breakFlag = true;
					break;
				}
			}
			if (breakFlag) break;
		}
		if (!breakFlag) alert(fdrawer.notFound);
    });

    // 更新筆寬
    $('#lineWidthSlider').on('input', function () {
        lineWidth = parseInt($(this).val(), 10);
    	$('#lineWidthValue').text(lineWidth);
        saveToDB('lineWidth', lineWidth); // 儲存筆寬到 Local Storage
    });

    // 開始繪製
    $canvas.on('mousedown touchstart', function (event) {
        isDrawing = true;
		undoStack.push(canvas.toDataURL()); // 儲存當前畫布狀態到 undoStack
        const { x, y } = getCanvasCoordinates(event);
        ctx.beginPath();
        ctx.moveTo(x * ratio, y * ratio);
	});

	var eraseMode = false;

	$('#penButton').on('click', function () {
		$('#penButton').addClass('use');
		$('#eraserButton').removeClass('use');
		eraseMode = false;
	});
	$('#eraserButton').on('click', function () {	
		$('#eraserButton').addClass('use');
		$('#penButton').removeClass('use');
		eraseMode = true; // 切換到橡皮擦模式
	});

    // 繪製中
	$canvas.on('mousemove touchmove', function (event) {
        if (!isDrawing) return;
        const { x, y } = getCanvasCoordinates(event);

		ctx.globalCompositeOperation = eraseMode ? "destination-out" : "source-over"; // 如果是橡皮擦模式，則使用 destination-out，否則使用 source-over
		// 毛筆模式：動態調整線條粗細
		ctx.lineWidth = lineWidth * 0.7 + Math.random() * lineWidth * 0.6; // 粗細隨機變化
		ctx.lineJoin = 'round'; // 線條連接處為圓角
		ctx.lineCap = 'round'; // 線條端點為圓角
        ctx.lineTo(x*ratio, y*ratio);
		ctx.strokeStyle = 'black';
        ctx.stroke();
    });

    // 停止繪製
    $canvas.on('mouseup mouseleave touchend', function () {
        isDrawing = false;
        ctx.closePath();
        saveToLocalDB(); // 停止繪製時儲存畫布內容到 Local Storage
    });

    // 復原功能
    $('#undoButton').on('click', function () {
        if (undoStack.length > 0) {
            const lastState = undoStack.pop();
            const img = new Image();
            img.src = lastState;
            img.onload = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                saveToLocalDB(); // 復原後更新 Local Storage
            };
        }
    });

	async function moveGlyph(xoff, yoff) {
		const savedCanvas = await loadFromDB('g_' + nowGlyph);
		if (!savedCanvas) return; // 如果沒有儲存的畫布，則不進行任何操作
		undoStack.push(canvas.toDataURL()); // 儲存當前畫布狀態到 undoStack

		const img = new Image();
		img.src = savedCanvas;
		img.onload = function () {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, xoff, yoff);
			saveToLocalDB(); // 更新 Local Storage
		};
	}

	$('#moveLeftButton').on('click', function () { moveGlyph(-10, 0); }); // 向左移動 10px
	$('#moveRightButton').on('click', function () { moveGlyph(10, 0); }); // 向右移動 10px
	$('#moveUpButton').on('click', function () { moveGlyph(0, -10); }); // 向上移動 10px
	$('#moveDownButton').on('click', function () { moveGlyph(0, 10); }); // 向下移動 10px

    // 更新進度條
    function updateProgress(current, total) {
        const percentage = Math.round((current / total) * 100);
        $progressBar.val(percentage);
        $progressText.text(`${percentage}%`);
    }

	async function toSVG(gname, savedCanvas) {
		// 建立一個臨時的 canvas
		const tempCanvas = document.createElement('canvas');
		const tempCtx = tempCanvas.getContext('2d');
		tempCanvas.width = 500;
		tempCanvas.height = 500;

		tempCtx.fillStyle = 'white';
		tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
		const img = new Image();
		img.src = savedCanvas;
		return new Promise((resolve) => {
			img.onload = function () {
				tempCtx.drawImage(img, 0, 0);

				// 使用 potrace.js 將臨時 canvas 轉換為 SVG
				Potrace.loadImageFromUrl(tempCanvas.toDataURL('image/png'));
				Potrace.setParameter({
					turdSize: 100, // 減少雜訊
					opttolerance: 0.5, // 調整優化容差
				});
				Potrace.process(function () {
					var svgData = Potrace.getSVG(2); // 取得 SVG 資料
					svgData = svgData.replace(/^.+path d="/, '').replace(/".+$/, '');
					//await saveToDB('s_' + gname, svgData);
					resolve(svgData);
				});
			};
		});
	}

	async function loadSVG(gname) {
		var savedSvg = await loadFromDB('s_' + gname);
		if (savedSvg) return savedSvg; 	// 如果已經存在 SVG，則直接返回

		var savedCanvas = await loadFromDB('g_' + gname);
		if (!savedCanvas) return null;
		var svgData = toSVG(gname, savedCanvas); // 如果不存在 SVG，則儲存並返回新的 SVG
		await saveToDB('s_' + gname, svgData);
		return svgData;
	}

	function createGlyph(unicode, gname, adw, path) {
		var glyphObj = {
			name: gname,
			advanceWidth: adw,
			path: path || new opentype.Path()
		};
		if (unicode) glyphObj.unicode = unicode;
		return new opentype.Glyph(glyphObj);
	}

	function padPath(path, pad, isAdw) {
		var boundingBox = path.getBoundingBox();
		var width = Math.round(boundingBox.x2 - boundingBox.x1);
		var xoff = isAdw ? Math.round((pad - width) / 2 - Math.round(boundingBox.x1)) : // 指定最終字寬模式
						pad - Math.round(boundingBox.x1);		// 單純指定邊界寬度
						
		path.commands.forEach( c => {
			c.x = c.x + xoff;
			if (c.x1) c.x1 = c.x1 + xoff;
			if (c.x2) c.x2 = c.x2 + xoff;
		});
		return isAdw ? pad : width + pad*2; // 返回調整後的寬度
	}

	// 儲存字型檔
    $('#saveButton').on('click', async function () {
		// 顯示進度條
		$naviContainer.hide();
		$progressContainer.show();
		$progressBar.val(0);
		$progressText.text('0%');

		const glyphs = [							// 建立字符陣列，並加入一些空格字符（因程式機制上無法畫出空白字符，只能自動產生）
			createGlyph(null, '.notdef', 600),		// notdef
			createGlyph(0x20, 'space', 300),		// 空格
			createGlyph(0xA0, 'uni00A0', 300),		// No-break Space
			createGlyph(0x2c9, 'macron', 600),		// 一聲
			createGlyph(0x3000, 'uni3000', upm),	// Ideographic Space
			createGlyph(0x2002, 'uni2002', upm/2),	// En Space
			createGlyph(0x2003, 'uni2003', upm),	// Em Space
		];

		const gidMap = {};
		const fulls = [];
		const verts = [];
		const ccmps = [];

		const totalGlyphs = Object.keys(glyphMap).length; // 總字符數量
		let processedGlyphs = 0;
		var scale = await loadFromDB('scaleRate') || 100; // 縮放比例，預設為 100%
		scale = parseInt(scale, 10) / 100; // 轉換為小數
		var scaleoff = (upm - scale * upm) / 2; // 縮放偏移量

		for (let gname in glyphMap) {
			// 更新進度條
			updateProgress(processedGlyphs, totalGlyphs);				
			processedGlyphs++;

			var svgData = await loadSVG(gname);				
			if (!svgData) continue;
			var path = await opentype.Path.fromSVG(svgData, {flipYBase: 0, scale: scale, y: 880 - scaleoff, x: scaleoff});

			var adw = upm;
			if (glyphMap[gname].w == 'P' || glyphMap[gname].w == 'H') { // 比例寬自動調整
				adw = padPath(path, 50);
			} else if (await loadFromDB('noFixedWidthFlag') == 'Y') {
				adw = padPath(path, 100);
			}

			var unicode = null;
			if (gname.match(/^uni([0-9A-F]{4})$/i)) {
				unicode = parseInt(RegExp.$1, 16); // 轉換為 Unicode 編碼
			} else if (gname.match(/^u([0-9A-F]{5})$/i)) {
				unicode = parseInt(RegExp.$1, 16); // 轉換為 Unicode 編碼
			} else if (gname.indexOf('.vert') < 0 && glyphMap[gname].c.length == 1) {
				unicode = glyphMap[gname].c.charCodeAt(0); // 使用字符的 Unicode 編碼
			}
			var glyph = createGlyph(unicode, gname, adw, path);
			glyphs.push(glyph);
			gidMap[gname] = glyphs.length-1;

			// 自動製作全形字符
			if (glyphMap[gname].f) {
				var gnameF = glyphMap[gname].f;
				var pathF = await opentype.Path.fromSVG(svgData, {flipYBase: 0, scale: scale, y: 880 - scaleoff, x: scaleoff});
				var adwF = await loadFromDB('noFixedWidthFlag') == 'Y' ? padPath(pathF, 100) : padPath(pathF, upm, true);
				var unicodeF = null;
				if (gnameF.match(/^uni([0-9A-F]{4})$/i)) unicodeF = parseInt(RegExp.$1, 16); // 轉換為 Unicode 編碼
				var glyphF = createGlyph(unicodeF, gnameF, adwF, pathF);
				fulls.push(glyphF);
			}

			if (glyphMap[gname].v) verts.push(gname);
			if (glyphMap[gname].s) ccmps.push(gname);

		}

		// 加入全形字符在後面
		for (let i in fulls) {
			var glyphF = fulls[i];
			glyphs.push(glyphF);
			gidMap[glyphF.name] = glyphs.length-1;
		}
		const font = await createFont(glyphs, gidMap, verts, ccmps);

		// 建立下載連結
		const link = document.createElement('a');
		link.download = font.names.windows.postScriptName.en + '.otf'; //'drawing.otf';
		link.href = window.URL.createObjectURL(new Blob([font.toArrayBuffer()]), {type: "font/opentype"});
		link.click();

		// 隱藏進度條
		$naviContainer.show();
		$progressContainer.hide();
	});

    // 清除畫布的功能
    $('#clearButton').on('click', async function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        undoStack.length = 0; // 清空復原堆疊
        await deleteFromDB('g_' + nowGlyph); // 清除 IndexedDB 中的資料
        await deleteFromDB('s_' + nowGlyph); // 清除 IndexedDB 中的資料
    });

    // 顯示設定畫面
    $('#settingButton').on('click', async function () {
        $('#settings-container').show();
		$('#fontNameEng').val(await loadFromDB('fontNameEng') || 'MyFreehandFont');
		$('#fontNameCJK').val(await loadFromDB('fontNameCJK') || fdrawer.fontNameCJK);
		$('#noFixedWidthFlag').prop('checked', await loadFromDB('noFixedWidthFlag') == 'Y');
		var scale = await loadFromDB('scaleRate') || 100; // 預設縮放比例為 100%
		$('#scaleRateSlider').val(scale);
		$('#scaleRateValue').text(scale + '%');

		$('#spanAllCount').text(Object.keys(glyphMap).length);
		$('#spanDoneCount').text(await countGlyphFromDB());
    });

    // 關閉設定畫面
    $('#closeSettingsButton').on('click', function () {
        $('#settings-container').hide();
    });

	$('#fontNameEng').on('change', function () { saveToDB('fontNameEng', $(this).val().replace(/[^a-zA-Z0-9 ]/g, '')); });
	$('#fontNameCJK').on('change', function () { saveToDB('fontNameCJK', $(this).val()); });
	$('#noFixedWidthFlag').on('click', function () { saveToDB('noFixedWidthFlag', $(this).prop('checked') ? 'Y' : 'N'); });
	$('#scaleRateSlider').on('input', function () { 
		var rate = parseInt($(this).val(), 10);
		$('#scaleRateValue').text(rate + '%');
		saveToDB('scaleRate', rate);
		initCanvas(canvas);
	});

	// 顯示字表畫面
    $('#canvasListButton').on('click', async function () {
        $('#listup-container').show();
		$('#listup-body').empty(); 		// 清空

		for (let i in nowList) {
			var gname = nowList[i];
			var drawData = await loadFromDB('g_' + gname);
			if (drawData) {		// 已寫過
				$('#listup-body').append(
					$('<img>').attr('src', drawData).data('index', i).on('click', function () {
						setGlyph($(this).data('index')*1);
						$('#listup-container').hide();
					})
				);
			} else {
				var cell = $('<span>').text(glyphMap[gname].c).data('index', i).on('click', function () {
					setGlyph($(this).data('index')*1);
					$('#listup-container').hide();
				});
				if (glyphMap[gname].v && gname.indexOf('.vert') > 0) cell.addClass('vert');
				$('#listup-body').append(cell);
			}
		}
    });

    // 關閉設定畫面
    $('#closeListupButton').on('click', function () {
        $('#listup-container').hide();
    });

	// 顯示提示畫面
	$('#hintButton').on('click', function () {
		$('#hint-container').show();
	});

	// 關閉設定畫面
	$('#closeHintButton').on('click', function () {
		$('#hint-container').hide();
	});

    // 取得滑鼠或觸控座標
    function getCanvasCoordinates(event) {
        const rect = canvas.getBoundingClientRect();
        const touch = event.type.includes('touch') ? event.originalEvent.touches[0] : event;
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    }

    // 匯出資料
    $('#exportDataButton').on('click', async function () {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = async function (event) {
            const data = event.target.result.map(item => `${item.key}\t${item.value}`).join('\n');
            if (data.length > 0) {
                const blob = new Blob([data], { type: 'text/plain' });
                const link = document.createElement('a');
                link.download = (await loadFromDB('fontNameEng') || 'MyFreehandFont') + '-' + (new Date()).toISOString() + '.txt';
                link.href = window.URL.createObjectURL(blob);
                link.click();
            } else {
                alert(fdrawer.noDataToExport);
            }
        };
    });

    // 匯入資料
    $('#importDataFile').on('change', async function () {
        if (confirm(fdrawer.importConfirm)) {
            const fileInput = $(this);
            const file = fileInput[0].files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async function (e) {
                    await clearDB(); // 清除現有的 IndexedDB 資料
                    const data = e.target.result;
                    const lines = data.split('\n');
                    for (const line of lines) {
                        if (line.trim() === '') continue; // 跳過空行
                        const parts = line.split('\t');
                        if (parts.length < 2) continue; // 如果格式不正確，跳過
                        const key = parts[0].trim();
                        const value = parts[1].trim();
                        await saveToDB(key, value);
                    }
                    alert(fdrawer.importDone);
                    location.reload(); // 重新載入頁面
                };
                reader.readAsText(file);
            }
        } else {
            $(this).val(''); // 清除選擇的檔案
        }
    });

    // 修改清除所有資料的功能
    $('#clearAllButton').on('click', async function () {
        if (confirm(fdrawer.clearConfirm)) {
            await clearDB();
            alert(fdrawer.clearDone);
            location.reload(); // 重新載入頁面
        }
    });
});
