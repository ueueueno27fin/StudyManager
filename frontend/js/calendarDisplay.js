/**
 * カレンダー表示処理
 */


const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

// 現在の日付を取得
const today = new Date();

// 年・月・日・曜日を取得
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const date = String(today.getDate()).padStart(2, '0');
const day = weekdays[today.getDay()]; // 0~6で日〜土
let color = "black"; //黒
if(day=="土"){
    color = "blue";
} else if(day=="日"){
    color = "red";
}


// 表示形式に整形
const calendarString = `${year}年<br>${month}月${date}日(${day})`;

// HTMLに挿入
document.getElementById("todayDisplay").innerHTML = calendarString;
document.getElementById("todayDisplay").style.color = color;