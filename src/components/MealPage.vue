<template>
  <div class="meal-wrapper">
    <div v-for="(meal, index) in meals" :key="index" class="meal-box">
      <div class="meal-date">{{ formatDate(meal.date) }}</div>
      <table class="meal-table">
        <tr>
          <td class="kcal">{{ meal.kcal }} Kcal</td>
          <td class="review">
            리뷰<br />
            <div class="stars">★★★★★</div>
            <i class="fas fa-pen"></i>
          </td>
        </tr>
        <tr>
          <td colspan="2" class="menu-list">
            <div v-for="line in formatMenu(meal.menu)" :key="line">{{ line }}</div>
          </td>
        </tr>
        <tr>
          <td colspan="2" class="see-more">리뷰보기</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const meals = ref([])

onMounted(async () => {
  const today = new Date()
  const dates = [0, 1].map(offset => {
    const d = new Date(today)
    d.setDate(today.getDate() + offset)
    return d.toISOString().substring(0, 10).replace(/-/g, '')
  })

  const result = []
  for (const date of dates) {
    try {
      const res = await fetch(`http://localhost:3001/api/meal?date=${date}`)
      const data = await res.json()
      result.push({ date, menu: data.meal, kcal: data.kcal || '0.0' })
    } catch (e) {
      result.push({ date, menu: '급식 정보 없음', kcal: '0.0' })
    }
  }
  meals.value = result
})

const formatDate = (dateStr) => {
  const date = new Date(`${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6)}`)
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

const formatMenu = (menuText) => {
  return menuText.split(/\n|<br\/>/).map(s => s.trim()).filter(Boolean)
}
</script>

<style scoped>
.meal-wrapper {
  max-width: 400px;
  margin: 0 auto;
  padding-bottom: 80px;
}

.meal-box {
  border: 1px solid #aaa;
  margin-bottom: 16px;
  background-color: #f9f9f9;
}

.meal-date {
  background-color: #e0e0e0;
  text-align: center;
  font-weight: bold;
  padding: 6px;
}

.meal-table {
  width: 100%;
  border-collapse: collapse;
}

.meal-table td {
  padding: 8px;
  border: 1px solid #ccc;
  vertical-align: top;
}

.kcal {
  width: 60%;
  font-weight: bold;
}

.review {
  width: 40%;
  text-align: center;
  font-size: 14px;
}

.stars {
  font-size: 16px;
  color: gold;
  margin: 4px 0;
}

.menu-list {
  font-size: 13px;
  white-space: pre-line;
  line-height: 1.4;
  padding-left: 12px;
}

.see-more {
  text-align: right;
  font-size: 12px;
  color: gray;
  padding-right: 8px;
}
</style>
