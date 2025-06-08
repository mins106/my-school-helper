<template>
  <div class="review-wrapper">
    <router-link to="/meals" class="back-link">← 급식 리뷰 남기기</router-link>
    <h2 class="date-title">{{ formattedDate }}</h2>

    <div class="review-card">
      <textarea v-model="review" placeholder="급식에 대한 느낌을 자유롭게 남겨보세요!"></textarea>

      <div class="stars">
        <span v-for="n in 5" :key="n" @click="rating = n" :class="{ selected: n <= rating }">★</span>
      </div>

      <p class="score">🌟 {{ rating }}점</p>

      <button class="submit-button" @click="submitReview">리뷰 저장</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const dateParam = route.params.date

const rating = ref(0)
const review = ref('')

const formattedDate = computed(() => {
  const y = dateParam.substring(0, 4)
  const m = parseInt(dateParam.substring(4, 6))
  const d = parseInt(dateParam.substring(6, 8))
  return `${m}월 ${d}일`
})

const submitReview = async () => {
  try {
    await axios.post('http://localhost:3001/api/review', {
      date: dateParam,
      rating: Number(rating.value),  // ← 숫자로 명확히 변환
      text: review.value
    })
    alert('리뷰가 저장되었습니다!')
    router.push('/meals')
  } catch (err) {
    console.error('리뷰 저장 실패:', err)
    alert('리뷰 저장에 실패했습니다.')
  }
}
</script>

<style scoped>
.review-wrapper {
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
  font-family: 'Helvetica Neue', sans-serif;
}

.back-link {
  text-decoration: none;
  color: #4b6cb7;
  font-size: 15px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 16px;
}

.date-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #222;
}

.review-card {
  background-color: #f6f8fc;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  padding: 20px;
  border: 1px solid #e0e0e0;
}

textarea {
  width: 100%;
  height: 120px;
  border: 1.5px solid #ccc;
  border-radius: 10px;
  padding: 12px;
  font-size: 15px;
  margin-bottom: 20px;
  transition: border 0.2s;
}

textarea:focus {
  outline: none;
  border-color: #4b6cb7;
}

.stars {
  font-size: 30px;
  color: #ddd;
  cursor: pointer;
  margin-bottom: 10px;
  user-select: none;
}

.stars .selected {
  color: #ffc107;
}

.score {
  font-size: 16px;
  font-weight: 500;
  color: #444;
}

.submit-button {
  background-color: #4b6cb7;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  margin-top: 12px;
  width: 100%;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #3a549e;
}
</style>
