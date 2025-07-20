import PocketBase from "https://esm.sh/pocketbase";

/**
 * アカウント作成
 * @author Hiroya Ueno
 * @date 2025-06-21
 */

const pb = new PocketBase("http://localhost:8080");

// ボタン押下時処理
document.getElementById("createAccountBtn").addEventListener("click", async () => {
    const name       = document.getElementById("userNameInput").value.trim();
    const email      = document.getElementById("userEmailInput").value.trim();
    const password   = document.getElementById("passwordInput").value;
    const passwordRe = document.getElementById("passwordReInput").value;
    const iconFile   = document.getElementById("iconInput").files[0];
    const errDiv     = document.getElementById("errDiv");
    errDiv.innerHTML = ""; // 毎回リセット

    // ① フォーマットチェック
    const formatErrors = formatCheck(name, email, password, passwordRe);
    if (formatErrors.length > 0) {
        errDiv.innerHTML = formatErrors.map(e => `<p>${e}</p>`).join("");
        return;
    }

    // ② email 重複チェック
    const isDuplicate = await emailDuplicateCheck(email);
    if (isDuplicate) {
        errDiv.innerHTML = "<p>このメールアドレスはすでに登録されています。</p>";
        return;
    }

    // ③ PocketBase へ登録
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("passwordConfirm", passwordRe);
    if (iconFile) {
        formData.append("icon", iconFile);
    }

    try {
        await pb.collection("Users").create(formData);
        await pb.collection("Users").authWithPassword(email, password);
        window.location.href = "./index.html";
    } catch (err) {
        console.error(err);
        errDiv.innerHTML = "<p>アカウント作成に失敗しました。</p>";
    }
});

// フォーマットチェック
function formatCheck(name, email, password, passwordRe) {
    const errors = [];

    if (!name) errors.push("ユーザー名を入力してください。");
    if (!email) errors.push("メールアドレスを入力してください。");
    if (!password) errors.push("パスワードを入力してください。");
    if (!passwordRe) errors.push("パスワード（確認用）を入力してください。");
    if (password && passwordRe && password !== passwordRe) {
        errors.push("パスワードが一致しません。");
    }

    return errors;
}

// メルアド重複チェック
async function emailDuplicateCheck(email) {
    try {
        const result = await pb.collection("users").getFirstListItem(`email="${email}"`);
        return result !== null;
    } catch (err) {
        if (err.status === 404) {
            return false;
        }
    }
}
