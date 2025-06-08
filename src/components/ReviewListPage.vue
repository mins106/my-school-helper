<template>
  <div class="review-list-wrapper">
    <button class="back-button" @click="goBack">← 뒤로 가기</button>

    <h2>{{ formattedDate }} 급식 리뷰</h2>

    <div v-if="reviews.length">
      <div v-for="(r, i) in reviews" :key="i" class="review-item">
        <div class="stars">
          <span v-for="n in 5" :key="n" :class="{ selected: n <= Number(r.rating) }">★</span>
        </div>
        <p class="text">{{ r.text }}</p>
        <p class="created-at">🕒 {{ formatDate(r.createdAt) }}</p>
      </div>
    </div>
    <div v-else class="no-review">아직 작성된 리뷰가 없습니다.</div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const reviews = ref([])
const date = route.params.date

const formattedDate = `${date.slice(0, 4)}년 ${date.slice(4, 6)}월 ${date.slice(6)}일`

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3001/api/review/${date}`)
    console.log('받은 리뷰:', res.data.map(r => r.rating)) // ← 이거 추가
    reviews.value = res.data
  } catch (err) {
    console.error('리뷰 불러오기 실패:', err)
  }
})

const goBack = () => {
  router.back()
}

function formatDate(iso) {
  const date = new Date(iso)

  // UTC → KST (+9시간)으로 변환
  date.setHours(date.getHours() + 9)

  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.review-list-wrapper {
  max-width: 600px;
  margin: 20px auto;
  padding: 16px;
}

.review-item {
  background: #f9f9f9;
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stars {
  font-size: 18px;
  color: #ddd;
  margin-bottom: 4px;
}

.text {
  font-size: 15px;
  color: #333;
  margin-bottom: 6px;
}

.created-at {
  font-size: 12px;
  color: #888;
}

.no-review {
  text-align: center;
  color: #999;
  margin-top: 40px;
  font-size: 15px;
}

.back-button {
  background: none;
  border: none;
  color: #4b6cb7;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 12px;
}

.stars .selected {
  color: #ffc107;
}
</style>
