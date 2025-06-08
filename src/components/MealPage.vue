<template>
  <div class="wrapper">
    <header class="header">
      <div class="logo-section">
        <img src="/logo.png" alt="로고" class="logo" />
        <span class="school-name">용인 동백중</span>
      </div>
    </header>

    <div class="week-control">
      <button @click="changeWeek(-1)">⬅️ 지난 주</button>
      <span>{{ weekLabel }}</span>
      <button @click="changeWeek(1)">다음 주 ➡️</button>
    </div>

    <div v-for="(meal, index) in meals" :key="index" class="meal-card">
      <div class="meal-date">{{ meal.date }}</div>
      <div class="meal-content">
        <div class="meal-left">
          <div class="kcal">{{ meal.kcal }}</div>
          <ul v-if="meal.menu.length" class="menu">
            <li v-for="(item, i) in meal.menu" :key="i">{{ item }}</li>
          </ul>
          <p v-else style="color: gray;">급식 정보가 없습니다.</p>
        </div>
        <div class="meal-right" v-if="meal.menu.length">
          <div class="review-title">리뷰</div>
          <div v-if="meal.rating > 0">
            <div class="stars">
              <span v-for="n in 5" :key="n" :class="{ selected: n <= Math.round(meal.rating) }">★</span>
            </div>
            <p class="score">({{ meal.rating.toFixed(1) }}점)</p>
          </div>
          <div v-else class="no-review">아직 리뷰 없음</div>
          <div class="review-actions">
            <router-link :to="`/review/${meal.dateCode}`" class="review-link">✏️ 리뷰 남기기</router-link>
            <router-link :to="`/review/${meal.dateCode}/view`" class="review-link">👀 리뷰 보기</router-link>
          </div>
        </div>
        <i class="fas fa-pen edit-icon"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const meals = ref([])
const currentWeekOffset = ref(0)
const route = useRoute()

const getWeekDates = (weekOffset = 0) => {
  const dates = []
  const today = new Date()
  const monday = new Date(today)
  const dayOfWeek = today.getDay()
  monday.setDate(monday.getDate() - dayOfWeek + 1 + weekOffset * 7) // 월요일로 조정

  for (let i = 0; i < 5; i++) { // 월~금
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const formatted = d.toISOString().slice(0, 10)
    const label = `${d.getMonth() + 1}월 ${d.getDate()}일`
    dates.push({ formatted, label })
  }
  return dates
}

const fetchMeals = async () => {
  meals.value = []
  const dates = getWeekDates(currentWeekOffset.value)

  for (const { formatted, label } of dates) {
    const yyyymmdd = formatted.replace(/-/g, '')
    let mealData = { kcal: '-', menu: [] }
    let rating = 0

    try {
      const res = await axios.get(`http://localhost:3001/api/meal?date=${yyyymmdd}`)
      mealData = {
        kcal: res.data.kcal,
        menu: res.data.menu
      }
    } catch (err) {
      console.warn(`🍽️ 급식 정보 없음 (${yyyymmdd})`)
    }

    try {
      const reviewRes = await axios.get(`http://localhost:3001/api/review/${yyyymmdd}/avg`)
      rating = reviewRes.data.avg ? Number(reviewRes.data.avg) : 0
    } catch (err) {
      console.warn(`⭐ 리뷰 평균 정보 없음 (${yyyymmdd})`)
    }

    meals.value.push({
      date: label,
      dateCode: yyyymmdd,
      kcal: mealData.kcal,
      menu: mealData.menu,
      rating
    })
  }
}

const changeWeek = (offsetChange) => {
  currentWeekOffset.value += offsetChange
  fetchMeals()
}

const weekLabel = computed(() => {
  if (currentWeekOffset.value === 0) return '이번 주'
  if (currentWeekOffset.value === 1) return '다음 주'
  if (currentWeekOffset.value === -1) return '지난 주'
  return `${Math.abs(currentWeekOffset.value)}주차 ${currentWeekOffset.value > 0 ? '후' : '전'}`
})

onMounted(() => {
  fetchMeals()
})

watch(() => route.fullPath, () => {
  fetchMeals()
})

</script>


<style scoped>
.wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  font-family: 'Arial', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 20px;
}

.logo {
  width: 28px;
  height: 28px;
}

.icon-section {
  display: flex;
  gap: 12px;
  font-size: 20px;
}

input[type="date"] {
  display: block;
  margin: 0 auto 20px;
  padding: 6px 12px;
  font-size: 16px;
}

.meal-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow: hidden;
}

.meal-date {
  background-color: #4b6cb7;
  color: white;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
}

.meal-content {
  display: flex;
  padding: 16px;
}

.meal-left {
  flex: 2;
}

.kcal {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 8px;
}

.menu {
  padding-left: 16px;
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.meal-right {
  flex: 1;
  text-align: center;
  border-left: 1px solid #ddd;
  padding-left: 12px;
}

.review-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.stars {
  font-size: 18px;
  color: #ddd; /* 비활성 별 회색 */
  margin-bottom: 6px;
}

.stars .selected {
  color: #f0c000; /* 활성 별 노란색 */
}

.edit-icon {
  color: #555;
  font-size: 14px;
  cursor: pointer;
}

.more {
  text-align: right;
  font-size: 12px;
  padding: 8px 12px;
  color: #888;
  background: #f9f9f9;
  border-top: 1px solid #eee;
}

.review-button {
  all: unset;
  /* 버튼 기본 스타일 제거 */
  color: #888888;
  /* 회색 글씨 */
  font-size: 13px;
  cursor: pointer;
  margin-top: 4px;
}

.review-button:hover {
  color: #555555;
  /* 호버 시 살짝 진한 회색 */
}

.week-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
  padding: 0 8px;
  font-size: 14px;
}

.week-control button {
  background: none;
  border: none;
  color: #4b6cb7;
  font-weight: bold;
  cursor: pointer;
}

.review-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 6px;
}

.review-link {
  all: unset;
  font-size: 13px;
  color: #888;
  cursor: pointer;
  text-align: center;
}

.review-link:hover {
  color: #555;
}
</style>