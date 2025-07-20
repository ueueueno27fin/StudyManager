import PocketBase from "https://esm.sh/pocketbase";
import { createStudyBanner } from "./studyBannerFactory.mjs";

/**
 * StudyList一覧表示&検索フィルタ
 * @author Hiroya Ueno
 * @date 2025-06-23
 */

const pb = new PocketBase("http://localhost:8080");

// 認証チェック
if (!pb.authStore.isValid) {
  window.location.href = "../login.html";
}

const userId = pb.authStore.record.id;
console.log(userId);
const bannerContainer = document.getElementById("studyListContainer");

// 読み込み完了と同時にバナー表示
document.addEventListener("DOMContentLoaded", () => {
  displayStudyBanners();
});

// 検索ボタン押下処理
document.getElementById("searchBtn").addEventListener("click", () => {
  console.log("ボタンが押されました");
  const filterWord = document.getElementById("filterInput").value;
  console.log("フィルターワードは", filterWord);
  displayStudyBanners(filterWord);
});

// バナー表示情報取得
async function displayStudyBanners(filterWord = "") {
  bannerContainer.innerHTML = "";

  try {
    const themes = await pb.collection("StudyTheme").getFullList({
      expand: "materials",
      sort: "-created",
    });

    //console.log(themes);

    // フィルタリング
    const filteredThemes = themes.filter((theme) => {
      const title = (theme.title || "").toLowerCase();
      const tips = (theme.tips || "").toLowerCase();
      const word = filterWord.toLowerCase();

      return title.includes(word) || tips.includes(word);
    });

    if (filteredThemes.length === 0) {
      bannerContainer.innerHTML = "<p>勉強テーマがありません。</p>";
      return; // 処理終了
    }

    filteredThemes.forEach((theme) => {
      const materials = theme.expand?.materials || [];

      const banner = createStudyBanner(theme, materials);
      banner.addEventListener("click", () => {
        goToDetailPage(theme);
      });
      bannerContainer.appendChild(banner);
    });
  } catch (error) {
    console.error("studyTheme の取得エラー:", error);
    bannerContainer.innerHTML = "<p>読み込み中にエラーが発生しました。</p>";
  }
}

// 詳細遷移
function goToDetailPage(theme) {
  sessionStorage.setItem("themeId", theme.id);
  window.location.href = "/studyList/detail.html";
}
