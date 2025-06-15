<template>
    <div class="memo-page">
        <header class="memo-header">
            <button class="back-btn" @click="$router.back()">←</button>
            <h2 class="memo-title">{{ formattedTitle }}</h2>
        </header>

        <section class="memo-area">
            <textarea v-model="memo" :readonly="mode === 'view'" placeholder="메모를 입력하세요..."
                class="memo-input"></textarea>
        </section>

        <section class="memo-options" v-if="mode === 'write'">
            <button class="option-btn" :class="{ selected: isPublic }" @click="isPublic = true">
                공개
            </button>
            <button class="option-btn" :class="{ selected: !isPublic }" @click="isPublic = false">
                비공개
            </button>
        </section>

        <section class="save-section" v-if="mode === 'write'">
            <button class="save-btn" @click="saveMemo">저장</button>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const { date, period, grade, classNo, mode } = useRoute().query
console.log('[메모 페이지 진입]', { date, period, grade, classNo, mode })

const memo = ref('')
const isPublic = ref(true)

const formattedTitle = computed(() => {
    const d = new Date(date)
    return `${d.getMonth() + 1}월 ${d.getDate()}일 ${period}교시`
})

const saveMemo = async () => {
    console.log('[메모 저장 시도]', {
        date, period, grade, classNo, memo: memo.value, isPublic: isPublic.value
    });

    try {
        await axios.post('http://localhost:3001/api/memo', {
            dateCode: date,
            period: Number(period),
            grade: Number(grade),
            classNo: Number(classNo),
            text: memo.value,
            isPublic: isPublic.value
        })
        alert('메모가 저장되었어요!');
        router.back();
    } catch (err) {
        console.error('저장 실패:', err);
        alert('메모 저장에 실패했어요 😥');
    }
};

</script>

<style scoped>
.memo-page {
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

.memo-area {
    margin-bottom: 16px;
}

.memo-input {
    width: 100%;
    height: 200px;
    resize: none;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-sizing: border-box;
}

.memo-options {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.option-btn {
    padding: 6px 16px;
    border: 1px solid #aaa;
    border-radius: 6px;
    background-color: #f5f5f5;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
}

.option-btn.selected {
    background-color: #0074cc;
    color: white;
    border-color: #0074cc;
}

.save-section {
    margin-top: 20px;
    text-align: center;
}

.save-btn {
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.save-btn:hover {
    background-color: #218838;
}
</style>
