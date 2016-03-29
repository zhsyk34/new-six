// 波段数组
var reds = [ 1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46 ];
var blues = [ 3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48 ];
var greens = [ 5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49 ];

// 生肖数组
var zodiacs = [ "鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪" ];

// 背景数组
var colors = [ "red", "blue", "green" ];

// 判断生肖
function getZodiac(year, input) {
	return zodiacs[(year - input + 9) % 12];
}

// 判断颜色
function getColor(input) {
	if (reds.indexOf(input) >= 0) {
		return colors[0];
	}
	if (blues.indexOf(input) >= 0) {
		return colors[1];
	}
	if (greens.indexOf(input) >= 0) {
		return colors[2];
	}
}

// 格式化数据
function formatInteger(input) {
	var length = arguments[1] || 2;
	return (Array(length).join(0) + input).slice(-length);
}

// 转为日期
function strToDate(str) {
	return new Date(Date.parse(str.replace(/-/g, "/")));
}

// 比较日期
function compareDate() {
	var first = strToDate(arguments[0]);
	var second = strToDate(arguments[1]);

	return first.getTime() - second.getTime();
}
