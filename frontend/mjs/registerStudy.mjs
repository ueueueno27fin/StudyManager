import PocketBase from "https://esm.sh/pocketbase";

/**
 * StudyTheme作成
 * @author Hiroya Ueno
 * @date 2025-06-24
 */

const pb = new PocketBase("https://studymanager-backend.onrender.com");

// 教材単体登録
async function createStudyMaterial(material) {
  try {
    const { name, type, totalAmount, unitName } = material;
    const materialData = { name, type, totalAmount, unitName };

    const record = await pb.collection("StudyMaterial").create(materialData);
    return record;
  } catch (error) {
    console.error("教材登録失敗:", error);
    throw error;
  }
}

// 複数教材一括登録
async function createAllStudyMaterials(materials) {
  const createdMaterials = [];
  for (const material of materials) {
    const record = await createStudyMaterial(material);
    createdMaterials.push(record);
  }
  return createdMaterials;
}

// 勉強テーマ登録
async function registerStudyTheme() {
  const themeTitle = document.getElementById("themeTitle").value.trim();
  const beginDay = document.getElementById("beginDay").value;
  const endDay = document.getElementById("endDay").value;
  const comment = document.getElementById("comment").value.trim();

  const materialElems = document.querySelectorAll(".inputMaterial");
  const materials = [];

  materialElems.forEach((elem) => {
    const name = elem.querySelector(".materialName").value.trim();
    const type = elem.querySelector(".typeSelection").value.trim();
    const totalAmountStr = elem.querySelector(".inputAmount").value.trim();
    const totalAmount = totalAmountStr === "" ? 0 : Number(totalAmountStr);
    const unitName = elem.querySelector(".unitName").value.trim();

    if (name) {
      materials.push({ name, type, totalAmount, unitName });
    }
  });
  
  //ここから検査
  if (!themeTitle) {
    alert("勉強タイトルは必須です！");
    return;
  }

  if (!beginDay || !endDay) {
    alert("開始日と終了日を入力してください。");
    return;
  }

  const begin = new Date(beginDay);
  const end = new Date(endDay);

  if (isNaN(begin.getTime()) || isNaN(end.getTime())) {
    alert("有効な日付を入力してください。");
    return;
  }

  if (begin > end) {
    alert("終了日は開始日より後にしてください。");
    return;
  }

  if (materials.length === 0) {
    alert("最低1つの教材を入力してください。");
    return;
  }

  for (const m of materials) {
    if (isNaN(m.totalAmount)) {
      alert(`教材「${m.name}」の総量に数値を入力してください。`);
      return;
    }
  }
  //検査ここまで

  try {
    // 教材をすべて登録
    const createdMaterials = await createAllStudyMaterials(materials);
    // IDのみ抽出
    const materialIds = createdMaterials.map(
      (materialRecord) => materialRecord.id
    );

    // テーマ登録データ
    const studyThemeData = {
      user: pb.authStore.record.id,
      title: themeTitle,
      tips: comment,
      startDate: beginDay,
      endDate: endDay,
      tips: comment,
      materials: materialIds, // materials はリレーションフィールドでID配列を受け取る想定
    };

    // テーマ登録
    const studyThemeRecord = await pb
      .collection("StudyTheme")
      .create(studyThemeData);
    alert(`勉強テーマ登録成功！`);
    window.location.href = "/studyList/";
    // 必要ならフォームリセットや画面遷移等ここに書く
  } catch (error) {
    alert("登録中にエラーが発生しました: " + error.message);
  }
}

// ボタンにイベント登録
document
  .getElementById("registerStudyBtn")
  .addEventListener("click", registerStudyTheme);
