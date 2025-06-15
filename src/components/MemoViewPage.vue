<template>
    <div class="memo-view-page">
        <header class="memo-header">
            <button class="back-btn" @click="$router.back()">←</button>
            <h2 class="memo-title">{{ formattedTitle }}</h2>
        </header>

        <section class="memo-display">
            <div v-if="memos.length > 0">
                <div v-for="memo in memos" :key="memo.id" class="memo-item">
                    <p class="memo-text">{{ memo.text }}</p>
                    <p class="memo-meta">
                        <span class="badge" :class="{ public: memo.isPublic, private: !memo.isPublic }">
                            {{ memo.isPublic ? '공개 메모' : '비공개 메모' }}
                        </span>
                        <span class="timestamp">{{ formatDate(memo.createdAt) }}</span>
                    </p>
                </div>
            </div>
            <p v-else class="no-memo">저장된 메모가 없어요 📝</p>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const { date, period, grade, classNo } = route.query

const memos = ref([])

const formattedTitle = computed(() => {
    const d = new Date(date)
    return `${d.getMonth() + 1}월 ${d.getDate()}일 ${period}교시`
})

const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleString('ko-KR', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3001/api/memo', {
      params: {
        dateCode: date,
        period,
        grade,
        classNo
      }
    });
    memos.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error('메모 불러오기 실패:', err);
  }
});
</script>

<style scoped>
.memo-view-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 16px;
    font-family: 'Pretendard', sans-serif;
    color: #333;
}

.memo-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.back-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #0074cc;
}

.memo-title {
    font-size: 18px;
    font-weight: 600;
}

.memo-display {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.memo-item {
    background: #f9f9f9;
    border-radius: 8px;
    padding: 12px;
    white-space: pre-wrap;
}

.memo-text {
    font-size: 15px;
}

.memo-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #666;
    margin-top: 8px;
}

.badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: bold;
}

.badge.public {
    background-color: #e0f4ff;
    color: #0074cc;
}

.badge.private {
    background-color: #f8f0f0;
    color: #cc3333;
}

.no-memo {
    color: #aaa;
    text-align: center;
}
</style>