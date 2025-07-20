import { calcTodayNorma } from "../js/calcNorma.js";

/**
 * バナーのパーツを作成するファクトリー
 * @author Hiroya Ueno
 * @date 2025-06-24
 * @param {*} param0
 * @returns
 */

// バナー作成
export function createStudyBanner(theme, materials) {
  const title = theme.title;
  const explain = theme.tips;
  const deadlineTxt = calcDeadLine(theme.endDate);

  const banner = document.createElement("div");
  banner.classList.add("studyBanner");

  const titleDiv = document.createElement("div");
  titleDiv.classList.add("studyThemeTitle");
  titleDiv.textContent = title;

  const explainDiv = document.createElement("div");
  explainDiv.classList.add("explainTxt");
  explainDiv.textContent = explain;

  const taskArea = document.createElement("div");
  taskArea.classList.add("taskArea");
  const doneToday = new Date(theme.doneToday);
  const today = new Date();

  let taskAreaText = "今日のノルマ:";
  if (
    doneToday.getFullYear() === today.getFullYear() &&
    doneToday.getMonth() === today.getMonth() &&
    doneToday.getDate() === today.getDate()
  ) {
    taskAreaText = "今日のノルマ(本日済):";
  }
  taskArea.textContent = taskAreaText;

  calcTodayNorma(materials, theme).forEach((n) => {
    const task = document.createElement("div");
    task.classList.add("task");
    task.innerHTML = `【${n.type}】${n.materialName}:<b> ${n.amount}</b> ${n.unit}`;
    taskArea.appendChild(task);
  });

  const deadlineDiv = document.createElement("div");
  deadlineDiv.classList.add("deadline");
  deadlineDiv.innerHTML = deadlineTxt;

  banner.append(titleDiv, explainDiv, taskArea, deadlineDiv);

  return banner;
}

// 期日計算
function calcDeadLine(endDate) {
  const start = new Date();
  const end = new Date(endDate);

  const dayOfWeekMap = ["日", "月", "火", "水", "木", "金", "土"];

  // 曜日取得
  const weekDay = dayOfWeekMap[end.getDay()];

  // 日数差の計算（UTC切り捨て対応）
  const diffTime = end.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // フォーマット整形
  const year = end.getFullYear();
  const month = String(end.getMonth() + 1).padStart(2, "0");
  const day = String(end.getDate()).padStart(2, "0");

  return `${year}年${month}月${day}日(${weekDay})まで <big><b>${diffDays}日</b></big>`;
}
