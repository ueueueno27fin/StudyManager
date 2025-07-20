// ノルマ計算
const weekdayWeight = 2;
const weekendWeight = 3;

export function calcTodayNorma(materials, theme) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const start = new Date(theme.startDate);
  const end = new Date(theme.endDate);
  const oneDayMs = 1000 * 60 * 60 * 24;

  console.log(materials[0]);

  return materials.map((material) => {
    const { totalAmount, name, unitName } = material;
    console.log(totalAmount);
    console.log(name);
    console.log(unitName);
    const days = [];
    for (
      let d = new Date(start);
      d <= end;
      d = new Date(d.getTime() + oneDayMs)
    ) {
      const ymd = d.toISOString().slice(0, 10);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const weight = isWeekend ? weekendWeight : weekdayWeight;
      days.push({ date: ymd, weight });
    }

    const totalWeight = days.reduce((sum, day) => sum + day.weight, 0);
    const todayEntry = days.find((d) => d.date === todayStr);

    const ratio = todayEntry ? todayEntry.weight / totalWeight : 0;
    const todayNorma = Math.round(totalAmount * ratio);

    return {
      materialName: name,
      amount: todayNorma,
      unit: unitName,
      type: material.type,
    };
  });
}