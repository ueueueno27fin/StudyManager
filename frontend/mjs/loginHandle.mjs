import PocketBase from "https://esm.sh/pocketbase";

/**
 * ログイン処理担当
 * @author Hiroya Ueno
 * @date 2025-06-21
 */

const pb = new PocketBase("https://studymanager-backend.onrender.com")
const errDiv = document.getElementById("errDiv");

if(pb.authStore.isValid){
  window.location.href = "./index.html"
}

// ログインボタン押下
document.getElementById('loginBtn').addEventListener("click", tryLogin);

export async function tryLogin(event) {
    event.preventDefault(); // リロード防止

    const email    = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;

    // フォーマットチェックしてOKならログイン処理をする。
    if(formatCheck(email, password)){
        try {
            const authData = await pb.collection("Users").authWithPassword(email, password);
            console.log("ログイン成功", authData);
            window.location.href = "./index.html";
        } catch (error) {
            console.error("ログイン失敗", error);
            errDiv.textContent = "ログインに失敗しました。IDかパスワードを確認してください。";
        }
    }
}

// フォーマットチェック
function formatCheck(email, password){
    errDiv.innerHTML = "";  // まずは前のエラー消す
    let errTxt = "";
    let checkFlag = false;

    if(!email){
        errTxt += "ユーザーIDを入力してください。<br>";
        checkFlag = true;
    } 
    if(!password){
        errTxt += "パスワードを入力してください。<br>";
        checkFlag = true;
    }
    if (checkFlag) {
        errDiv.innerHTML = errTxt;
        return false;
    }
    return true; // 両方入力されていればOK
}