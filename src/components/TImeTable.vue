<template>
  <div class="wrapper">
    <!-- Header -->
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

    <!-- Filters -->
    <div class="filters">
      <select>
        <option>동백중학교</option>
      </select>

      <select v-model="selectedGrade">
        <option disabled value="">학년</option>
        <option value="1">1학년</option>
        <option value="2">2학년</option>
        <option value="3">3학년</option>
      </select>

      <select v-model="selectedClass" :disabled="classOptions.length === 0">
        <option disabled value="">반</option>
        <option v-for="ban in classOptions" :key="ban" :value="ban">{{ ban }}반</option>
      </select>
    </div>

    <!-- Date and Table -->
    <div class="table-wrapper">
      <table class="time-table">
        <thead>
          <tr>
            <th colspan="3">
              📅 <input type="date" v-model="selectedDate" class="date-input" />
            </th>
          </tr>
          <tr>
            <th>교시</th>
            <th>과목</th>
            <th>메모</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isWeekend">
            <td colspan="3">오늘은 주말이라 수업이 없어요 😊</td>
          </tr>
          <tr v-else-if="timetable.length === 0">
            <td colspan="3">시간표 정보가 없습니다.</td>
          </tr>
          <tr v-for="(item, index) in timetable.slice(0, 7)" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.subject || '-' }}</td>
            <td>
              <input v-model="memos[index]" type="text" class="memo-input" placeholder="메모..." />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const selectedDate = ref(new Date().toISOString().substring(0, 10))
const selectedGrade = ref('')
const selectedClass = ref('')
const classOptions = ref([])
const timetable = ref([])
const memos = ref([])

const isWeekend = computed(() => {
  const day = new Date(selectedDate.value).getDay()
  return day === 0 || day === 6 // 일요일 or 토요일
})

// 학년이 바뀔 때 반 개수 설정
watch(selectedGrade, (newGrade) => {
  if (newGrade === '1' || newGrade === '2') {
    classOptions.value = Array.from({ length: 13 }, (_, i) => (i + 1).toString())
  } else if (newGrade === '3') {
    classOptions.value = Array.from({ length: 11 }, (_, i) => (i + 1).toString())
  } else {
    classOptions.value = []
  }
  selectedClass.value = ''
})

// 시간표 불러오기
const fetchTimeTable = async () => {
  if (!selectedGrade.value || !selectedClass.value) return
  if (isWeekend.value) {
    timetable.value = []
    return
  }

  const today = new Date(selectedDate.value)
  const weekday = today.getDay() - 1

  try {
    const res = await fetch(`http://localhost:3001/api/timetable?grade=${selectedGrade.value}&classNo=${selectedClass.value}&weekday=${weekday}`)
    const data = await res.json()
    timetable.value = Array.isArray(data) ? data.slice(0, 7) : []
    memos.value = Array.from({ length: timetable.value.length }, () => '')
  } catch (err) {
    timetable.value = []
    console.error('시간표 요청 실패:', err)
  }
}

watch([selectedDate, selectedGrade, selectedClass], () => {
  fetchTimeTable()
})
</script>

<style scoped>
.wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 20px;
}

.logo {
  width: 24px;
  height: 24px;
}

.icon-section {
  display: flex;
  gap: 10px;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 8px;
}

.filters select {
  flex: 1;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.table-wrapper {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}

.time-table {
  width: 100%;
  text-align: center;
  border-collapse: collapse;
}

.time-table th,
.time-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.time-table thead th {
  background-color: #f0f0f0;
}

.date-input {
  border: none;
  text-align: center;
  font-size: 14px;
  background: transparent;
}

.memo-input {
  width: 90%;
  padding: 4px;
  font-size: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>