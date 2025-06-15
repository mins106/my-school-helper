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
              <div class="memo-buttons">
                <button class="memo-write" @click="goToMemoPage(index + 1, 'write')">📝 쓰기</button>
                <button class="memo-view" @click="goToMemoPage(index + 1, 'view')">👁 보기</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

const router = useRouter()

const selectedDate = ref(new Date().toISOString().substring(0, 10))
const selectedGrade = ref('')
const selectedClass = ref('')
const classOptions = ref([])
const timetable = ref([])
const memos = ref([])

const goToMemoPage = (period, mode) => {
  const date = selectedDate.value
  const grade = selectedGrade.value
  const classNo = selectedClass.value

  if (mode === 'write') {
    router.push({
      name: 'MemoPage',
      query: { date, period, grade, classNo, mode }
    })
  } else {
    router.push({
      name: 'MemoViewPage',
      query: { date, period, grade, classNo }
    })
  }
}

const isWeekend = computed(() => {
  const day = new Date(selectedDate.value).getDay()
  return day === 0 || day === 6 // 일요일 or 토요일
})

// 학년이 바뀔 때 반 개수 설정
watch(selectedGrade, (newGrade) => {
  Cookies.set('selectedGrade', newGrade)
  if (newGrade === '1' || newGrade === '2') {
    classOptions.value = Array.from({ length: 13 }, (_, i) => (i + 1).toString())
  } else if (newGrade === '3') {
    classOptions.value = Array.from({ length: 11 }, (_, i) => (i + 1).toString())
  } else {
    classOptions.value = []
  }
  selectedClass.value = ''
})

watch(selectedClass, (newClass) => {
  Cookies.set('selectedClass', newClass)
})

watch(selectedDate, (newDate) => {
  Cookies.set('selectedDate', newDate)
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

onMounted(() => {
  const savedGrade = Cookies.get('selectedGrade')
  const savedClass = Cookies.get('selectedClass')
  const savedDate = Cookies.get('selectedDate')

  if (savedGrade) selectedGrade.value = savedGrade
  if (savedDate) selectedDate.value = savedDate

  // classOptions는 selectedGrade watch에서 자동 생성됨
  if (savedClass) {
    // grade 반영 후 classOptions 완성될 때까지 기다려야 하므로 지연 설정
    setTimeout(() => {
      selectedClass.value = savedClass
    }, 0)
  }
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

.memo-buttons {
  display: flex;
  flex-direction: row; /* 세로 → 가로로 변경 */
  gap: 8px;             /* 버튼 사이 간격 */
  justify-content: center;
  align-items: center;
}

.memo-buttons button {
  width: 60px;
  padding: 4px 0;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.memo-write {
  background-color: #f0f8ff;
  color: #0074cc;
  border: 1px solid #0074cc;
}

.memo-view {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #aaa;
}

.memo-write:hover {
  background-color: #e0f0ff;
}

.memo-view:hover {
  background-color: #eaeaea;
}
</style>