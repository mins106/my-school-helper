<template>
  <div class="wrapper">
    <header class="header">
      <div class="logo-section">
        <img src="/logo.png" alt="로고" class="logo" />
        <span class="school-name">용인 동백중</span>
      </div>
      <div class="icon-section">
        <i class="fas fa-search"></i>
        <i class="fas fa-user-circle"></i>
      </div>
    </header>

    <!-- 날짜 선택 -->
    <input type="date" v-model="selectedDate" @change="handleDateChange" />

    <!-- 급식 카드 -->
    <div v-if="meal" class="meal-card">
      <div class="meal-date">{{ formattedDate }}</div>
      <div class="meal-content">
        <div class="meal-left">
          <div class="kcal">{{ meal.kcal }}</div>
          <ul class="menu">
            <li v-for="(item, i) in meal.menu" :key="i">{{ item }}</li>
          </ul>
        </div>
        <div class="meal-right">
          <div class="review-title">리뷰</div>
          <div class="stars">
            <span v-for="n in 5" :key="n">{{ n <= rating ? '★' : '☆' }}</span>
          </div>
          <i class="fas fa-pen edit-icon"></i>
        </div>
      </div>
      <div class="more">리뷰보기</div>
    </div>

    <!-- 급식 없음 -->
    <div v-else>
      <p style="text-align: center; margin-top: 20px;">🍽️ 급식 정보가 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// 선택한 날짜
const selectedDate = ref(new Date().toISOString().slice(0, 10))
// 급식 정보
const meal = ref(null)
// 별점
const rating = ref(0)

// 급식 API 호출
const fetchMeal = async () => {
  const dateStr = selectedDate.value.replace(/-/g, '')
  try {
    const res = await axios.get(`http://localhost:3001/api/meal?date=${dateStr}`)
    meal.value = res.data
    rating.value = Math.floor(Math.random() * 5) + 1  // 랜덤 별점
  } catch (err) {
    console.error('급식 불러오기 실패:', err)
    meal.value = null
  }
}

// 날짜 변경 시 호출
const handleDateChange = () => {
  fetchMeal()
}

// 날짜 포맷
const formattedDate = computed(() => {
  const date = new Date(selectedDate.value)
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
})

// 페이지 최초 로딩 시
onMounted(() => {
  fetchMeal()
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
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
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
  color: #f0c000;
  margin-bottom: 6px;
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
</style>
