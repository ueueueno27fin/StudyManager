import PocketBase from "https://esm.sh/pocketbase";
import { createStudyBanner } from "./studyBannerFactory.mjs";

/**
 * StudyList一覧表示&検索フィルタ
 * @author Hiroya Ueno
 * @date 2025-07-12
 */

const pb = new PocketBase("http://localhost:8080");

// 認証チェック
if (!pb.authStore.isValid) {
  window.location.href = "../index.html";
}

const userId = pb.authStore.record.id;
console.log(userId);

const todayStudyList = document.getElementById("studyListContainer");
const doneTodayStudyList = document.getElementById("doneStudyListContainer");

// 読み込み完了と同時にバナー表示
document.addEventListener("DOMContentLoaded", () => {
  displayStudyBanners();
});

// バナー表示情報取得
async function displayStudyBanners() {
  todayStudyList.innerHTML = "";
  doneTodayStudyList.innerHTML = "";
  const today = new Date();
  try {
    const themes = await pb.collection("StudyTheme").getFullList({
      expand: "materials",
      sort: "-created",
    });

    //console.log(themes);

    const todayThemes = [];
    const doneTodayThemes = [];

    themes.forEach((theme) => {
      const startDate = new Date(theme.startDate);
      const endDate = new Date(theme.endDate);
      if (isTodayInRange(today, startDate, endDate)) {
        const doneDay = new Date(theme.doneToday);
        if (
          doneDay.getFullYear() === today.getFullYear() &&
          doneDay.getMonth() === today.getMonth() &&
          doneDay.getDate() === today.getDate()
        ) {
          doneTodayThemes.push(theme);
        } else {
          todayThemes.push(theme);
        }
      }
    });

    if (todayThemes.length === 0) {
      todayStudyList.innerHTML = "<p>本日の勉強予定はありません！</p>";
    } else {
      todayThemes.forEach((theme) => {
        const materials = theme.expand?.materials || [];

        const banner = createStudyBanner(theme, materials);
        banner.addEventListener("click", () => {
          goToDetailPage(theme);
        });
        todayStudyList.appendChild(banner);
      });
    }

    if (doneTodayThemes.length === 0) {
      doneTodayStudyList.innerHTML = "<p>勉強がありません。</p>";
    } else {
      doneTodayThemes.forEach((theme) => {
        const materials = theme.expand?.materials || [];

        const banner = createStudyBanner(theme, materials);
        banner.addEventListener("click", () => {
          goToDetailPage(theme);
        });
        doneTodayStudyList.appendChild(banner);
      });
    }
  } catch (error) {
    console.error("studyTheme の取得エラー:", error);
  }
}

// 今日が期間に含まれているか
function isTodayInRange(today, startDate, endDate) {
  // 日付だけの比較にする（時刻無視）
  const todayStr = today.toISOString().slice(0, 10);
  const startStr = startDate.toISOString().slice(0, 10);
  const endStr = endDate.toISOString().slice(0, 10);

  return todayStr >= startStr && todayStr <= endStr;
}

// 詳細遷移
function goToDetailPage(theme) {
  sessionStorage.setItem("themeId", theme.id);
  window.location.href = "/studyList/detail.html";
}
