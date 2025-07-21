import PocketBase from "https://esm.sh/pocketbase";
import { calcTodayNorma } from "../js/calcNorma.js";
/**
 * 勉強詳細ページ
 * @author Hiroya Ueno
 * @date 2025-07-07
 */

const pb = new PocketBase("https://studymanager-backend.onrender.com");
const themeId = sessionStorage.getItem("themeId");

const theme = await pb.collection("studyTheme").getOne(themeId, {
  expand: "materials",
});

const doneToday = new Date(theme.doneToday);
const today = new Date();
if (
  doneToday.getFullYear() === today.getFullYear() &&
  doneToday.getMonth() === today.getMonth() &&
  doneToday.getDate() === today.getDate()
) {
  document.getElementById("registerProgress").hidden = true;
  document.getElementById("doneToday").hidden = false;
}

document.getElementById("studyTitle").textContent = theme.title;
document.getElementById("commentOfStudy").textContent = theme.tips;

const materials = theme.expand?.materials || [];
const materialContainer = document.getElementById("materialContainer");

// 本日のノルマを計算
const todayNormas = calcTodayNorma(materials, theme);

materials.forEach((material) => {
  const materialBanner = document.createElement("div");
  materialBanner.classList.add("materialBanner");

  // 教材名
  const materialName = document.createElement("div");
  materialName.textContent = material.name;
  materialName.classList.add("materialName");

  // 進捗：doneAmount
  const progress = document.createElement("div");
  progress.textContent = `進捗: ${material.doneAmount}/${material.totalAmount} ${material.unitName}`;
  progress.classList.add("materialProgress");

  // 本日のノルマ
  const normaData = todayNormas.find((n) => n.materialName === material.name);
  const todayNormaDiv = document.createElement("div");
  if (normaData) {
    todayNormaDiv.textContent = `今日のノルマ: ${normaData.amount} ${normaData.unit}`;
  } else {
    todayNormaDiv.textContent = "今日のノルマ: 計算できません";
  }
  todayNormaDiv.classList.add("todayNorma");

  // DOMに追加
  materialBanner.append(materialName, progress, todayNormaDiv);
  materialContainer.appendChild(materialBanner);
});

document
  .getElementById("registerProgress")
  .addEventListener("click", async () => {
    const result = window.confirm(
      "今日の勉強を完了として記録してもよろしいですか？"
    );
    if (result) {
      const todayNormas = calcTodayNorma(materials, theme);

      try {
        // 各教材のdoneAmountを更新
        for (let material of materials) {
          const todayData = todayNormas.find(
            (n) => n.materialName === material.name
          );
          if (!todayData) continue;

          const newDoneAmount = Math.min(
            material.doneAmount + todayData.amount,
            material.totalAmount
          );

          await pb.collection("StudyMaterial").update(material.id, {
            doneAmount: newDoneAmount,
          });
        }
        // テーマも更新しておく
        await pb.collection("StudyTheme").update(theme.id, {
          doneToday: new Date().toISOString(), // 今日の日付をセット
        });

        alert("今日の進捗を登録しました！");
        location.href = "../studyList/index.html";
      } catch (err) {
        console.error("更新失敗:", err);
        alert("更新に失敗しました。");
      }
    }
  });


// 勉強削除
document
  .getElementById("deleteStudy")
  .addEventListener("click", async function () {
    const result = window.confirm("この勉強テーマを削除してもよろしいですか？");
    if (!result) return;

    const secondResult = window.confirm(
      "関連教材もすべて削除されます。本当に削除しますか？"
    );
    if (!secondResult) return;

    try {
      const themeId = sessionStorage.getItem("themeId");
      const theme = await pb.collection("studyTheme").getOne(themeId, {
        expand: "materials",
      });

      const materials = theme.expand?.materials || [];

      // 関連教材（materials）を順番に削除
      for (const material of materials) {
        await pb.collection("StudyMaterial").delete(material.id);
      }

      // テーマ（studyTheme）自体を削除
      await pb.collection("StudyTheme").delete(themeId);

      alert("勉強テーマと関連教材を削除しました。");
      window.location.href = "/studyList/index.html"; // 一覧画面などに遷移
    } catch (error) {
      console.error("削除中にエラーが発生しました:", error);
      alert("削除に失敗しました。");
    }
  });
