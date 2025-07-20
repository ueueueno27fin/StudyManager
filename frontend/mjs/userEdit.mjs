import PocketBase from "https://esm.sh/pocketbase";

/**
 * プロフィール編集
 */
const pb = new PocketBase("https://studymanager-backend.onrender.com");

if (!pb.authStore.isValid) {
  window.location.href = "../login.html";
}

const userName = document.getElementById("userNameInput");
const passwordOld = document.getElementById("oldPasswordInput");
const password = document.getElementById("passwordInput");
const passwordRe = document.getElementById("passwordReInput");
const iconFile = document.getElementById("iconInput");
const updateBtn = document.getElementById("updateAccountBtn");

const savedAuthData = JSON.parse(localStorage.getItem("pocketbase_auth"));

// 初期値を入力
function setText() {
  if (!savedAuthData || !savedAuthData.record) return;
  userName.value = savedAuthData.record.name || "";
}

setText();

//ボタン押下イベントリスナー
updateBtn.addEventListener("click", updateUser);

// ユーザー情報更新
async function updateUser() {
  const newName = userName.value.trim();
  const oldPassword = passwordOld.value.trim();
  const newPassword = password.value.trim();
  const rePassword = passwordRe.value.trim();
  const icon = iconFile.files[0];

  const errDiv = document.getElementById("errDiv");
  errDiv.innerHTML = "";

  if(!oldPassword){
    errDiv.innerHTML = "前のパスワードを入力してください。";
    return;
  }
  if (newPassword && newPassword !== rePassword) {
    errDiv.innerHTML = "パスワードが一致しません。";
    return;
  }
  

  const formData = new FormData();
  formData.append("name", newName);
  formData.append("oldPassword", oldPassword);

  if (newPassword) {
    formData.append("password", newPassword);
    formData.append("passwordConfirm", newPassword);
  }

  if (icon) {
    formData.append("icon", icon);
  }

  try {
    const updatedUser = await pb
      .collection("Users")
      .update(savedAuthData.record.id, formData);

    // パスワードを更新した場合は再認証
    if (newPassword) {
      const auth = await pb
        .collection("Users")
        .authWithPassword(savedAuthData.record.email, newPassword);
      pb.authStore.save(auth.token, auth.record);
    } else {
      // パスワード変更なしなら手動でauthStoreを更新
      pb.authStore.save(pb.authStore.token, updatedUser);
    }

    // ここで authStore の状態を保存する（← updatedUser 自体ではなく）
    localStorage.setItem(
      "pocketbase_auth",
      JSON.stringify({
        token: pb.authStore.token,
        record: pb.authStore.record,
      })
    );

    location.href = "/myPage"; // 成功したら遷移
  } catch (error) {
    errDiv.innerHTML =
      "更新に失敗しました：" + (error.message || "不明なエラー");
  }
}
