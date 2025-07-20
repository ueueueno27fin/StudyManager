import PocketBase from "https://esm.sh/pocketbase";

/**
 * マイページ表示用
 * @author Hiroya Ueno
 * @date 2025-06-21
 */

const pb = new PocketBase("https://studymanager-backend.onrender.com");

if (!pb.authStore.isValid) {
  window.location.href = "../login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const savedAuthData = JSON.parse(localStorage.getItem("pocketbase_auth"));

  if (!savedAuthData) {
    // ログイン情報なし or 不正ならリダイレクトとか処理してもOK
    console.log("ログイン情報がありません");
    return;
  }

  const user = savedAuthData.model;

  // ユーザー名表示
  const userNameElem = document.getElementById("userName");
  if (userNameElem)
    userNameElem.textContent = `名前: ${savedAuthData.record.name || "名無し"}`;

  // メール表示
  const emailElem = document.getElementById("email");
  if (emailElem)
    emailElem.textContent = `メールアドレス: ${
      savedAuthData.record.email || ""
    }`;

  // ユーザー名タイトル部分
  const myPageTitle = document.getElementById("myPageTitle");
  if (myPageTitle)
    myPageTitle.textContent = `${
      savedAuthData.record.name || "名無し"
    }さんのマイページ`;

  // アイコン表示
  const userIconDiv = document.getElementById("userIcon");
  if (userIconDiv) {
    if (savedAuthData.record.icon) {
      // avatarが存在したらimgタグ挿入（256x256固定）
      const url = pb.files.getURL(savedAuthData.record, savedAuthData.record.icon, {'thumb': '256x256'});
      userIconDiv.innerHTML = `<img src="${url}" alt="ユーザーアイコン" width="256" height="256" style="object-fit: cover;">`;
    } else {
      // avatarなければ何もしない（div自体に背景灰色のCSSがある想定）
      userIconDiv.innerHTML = "";
    }
  }
});

// ログアウト
document.getElementById("logoutBtn").addEventListener("click", function () {
  const result = window.confirm("ログアウトしますか？");
  if (result) {
    pb.authStore.clear();
    window.location.reload();
  }
});

//ユーザー削除
document.getElementById("deleteAccount").addEventListener("click", function () {
  const result = window.confirm("本当に削除しますか？");
  if (result) {
    const secondResult = window.confirm("二度聞くが。\n本当に削除するのだな？");
    if (secondResult) {
      pb.collection("Users").delete(pb.authStore.record.id);
      pb.authStore.clear();
      window.location.reload();
      alert("マジで削除しました。");
    }
  }
});
