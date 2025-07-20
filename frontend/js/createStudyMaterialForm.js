/**
 * 教材登録フォーム生成
 * @author Hiroya Ueno
 * @date 2025-06-24
 */

// 教材フォームのHTMLテンプレート（削除ボタン付き）
const materialFormTemplate = `
<div class="inputMaterial">
    <div><label for="materialName">教材名:</label>
        <input type="text" class="materialName">
    </div>
    <div><label for="typeSelection">タイプ:</label>
        <input list="typeOptions" class="typeSelection" placeholder="選択 or 入力" />
        <datalist id="typeOptions">
            <option value="本">
            <option value="アプリ">
            <option value="動画">
            <option value="問題集">
            <option value="その他">
        </datalist>
    </div>
    <div><label for="inputAmount">総量:</label>
        <input type="number" class="inputAmount">
    </div>
    <div><label for="unitName">単位:</label>
        <input list="unitOptions" class="unitName" placeholder="例: ページ, 問, 回" />
        <datalist id="unitOptions">
            <option value="ページ">
            <option value="問">
            <option value="回">
            <option value="時間">
        </datalist>
    </div>
    <button type="button" class="removeMaterialBtn">削除</button>
</div>
`;

function setupAddMaterialButton() {
  const container = document.getElementById("registerContainer");

  // +ボタンを移動：教材群の下にくるように
  const addBtn = document.getElementById("addMaterialBtn");
  container.appendChild(addBtn);

  addBtn.addEventListener("click", () => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = materialFormTemplate.trim();
    container.insertBefore(wrapper.firstChild, addBtn); // addBtn の前に追加
  });

  // 削除ボタンのイベント
  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("removeMaterialBtn")) {
      const targetMaterial = e.target.closest(".inputMaterial");
      if (targetMaterial) {
        targetMaterial.remove();
      }
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setupAddMaterialButton();
});
