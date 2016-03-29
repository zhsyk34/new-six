$(function() {
	date();
	page();

	find();
});

function init() {
	var records = [];
	$.ajax({
		url : "../data.txt",
		async : false,
		success : function(data) {
			var list = data.split(/\n/);
			for (var i = 0, len = list.length; i < len; i++) {
				var record = {};
				// 2016/03/29,16-037,22,09,31,13,12,30,28
				var props = list[i].replace(/\s/g, "").replace(/\./g, ",").split(/,/);
				record.date = props[0].replace(/\//g, "-");
				record.ordinal = parseInt(props[1].split(/-/)[1]);
				record.generals = [];
				for (var j = 2; j < 8; j++) {
					record.generals.push(parseInt(props[j]));
				}

				record.special = parseInt(props[8]);
				records.push(record);
			}
		}
	});
	return records;
}

function test() {
	// TODO
	$.ajax({
		url : "http://www.dd.biga.com.tw/txtftp/hkmark6.txt",
		type : "get",
		dataType : "jsonp",
		success : function(data) {
			console.log(data);
		}
	});
}
// 日期控件初始化
function date() {
	$("#begin,#end").on("click", function() {
		WdatePicker({
			maxDate : "%y-%M-%d"
		});
	});
}
// 翻页控件初始化
function page() {
	$("#page").page({
		pageNo : 1,
		pageSize : 20,
		onChangePage : function(pageNo, pageSize) {
			load();
		}
	});
}
// 数据入口
function find() {
	load();
	$("#find").on("click", function() {
		$("#page").page({
			pageNo : 1
		});
		load();
	});
	$("#color").on("change", function() {
		$("#page").page({
			pageNo : 1
		});
		load();
	});
}
// 筛选数据
function query() {
	var records = init();
	var list = [];

	var begin = $.trim($("#begin").val());
	var end = $.trim($("#end").val());
	var min = parseInt($("#min").val());
	var max = parseInt($("#max").val());

	var color = $("#color").val();

	var options = $("#page").page("options");
	var pageNo = options.pageNo;
	var pageSize = options.pageSize;

	var intReg = /^\d+$/;
	var dateReg = /^\d{4}-\d{1,2}-\d{1,2}$/;

	$.each(records, function() {
		var special = parseInt(this.special);
		var current = this.date;
		if (intReg.test(min) && special < min) {
			return true;
		}
		if (intReg.test(max) && special > max) {
			return true;
		}
		if (dateReg.test(begin) && compareDate(begin, current) > 0) {
			return true;
		}
		if (dateReg.test(end) && compareDate(end, current) < 0) {
			return true;
		}
		if (color && getColor(special) != color) {
			return true;
		}
		list.push(this);
	});

	$("#page").page({// 结果总数
		dataCount : list.length
	});

	return list.slice((pageNo - 1) * pageSize, Math.min(list.length, pageNo * pageSize));
}

// 加载查询数据
function load() {
	var data = query();
	var body = $("#data").empty();

	var str = "<tr>";
	str += "<td class='index'></td>";
	str += "<td class='date'></td>";
	str += "<td class='ordinal'></td>";
	str += "<td class='generals'><div></div><div></div><div></div><div></div><div></div><div></div></td>";
	str += "<td class='special'><div></div></td>";
	str += "<td class='zodiac'><div></div></td>";
	str += "</tr>";

	$.each(data, function(index, record) {
		var date = strToDate(record.date);
		var tr = $(str);
		tr.find(".index").text(index + 1);
		tr.find(".date").text(record.date);

		tr.find(".ordinal").text(formatInteger(record.ordinal, 3));

		var divs = tr.find(".generals div");
		$.each(record.generals, function(i, general) {
			divs.eq(i).text(formatInteger(general, 2)).addClass(getColor(general));
		});

		var special = record.special;
		tr.find(".special div").text(formatInteger(special, 2)).addClass(getColor(special));
		tr.find(".zodiac").text(getZodiac(date.getFullYear(), special));
		body.append(tr);
	});
}
