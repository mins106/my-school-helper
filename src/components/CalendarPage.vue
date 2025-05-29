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

    <div class="calendar-container">
      <div class="month-selector">
        <select v-model="selectedMonth">
          <option v-for="m in 12" :key="m" :value="m">{{ m }}월</option>
        </select>
      </div>
      <table class="calendar">
        <thead>
          <tr>
            <th v-for="day in days" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, wi) in weeks" :key="wi">
            <td v-for="(day, di) in week" :key="di" :class="{ 'empty': !day, 'today': isToday(day) }">
              <span v-if="day">{{ day }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedMonth = ref(new Date().getMonth() + 1)
const days = ['월', '화', '수', '목', '금', '토', '일']
const today = new Date()
const year = today.getFullYear()

const getWeeks = (month) => {
  const first = new Date(year, month - 1, 1)
  const last = new Date(year, month, 0)
  const weeks = []
  let week = new Array(7).fill('')
  for (let i = 1 - (first.getDay() + 6) % 7; i <= last.getDate(); i++) {
    const col = (new Date(year, month - 1, i).getDay() + 6) % 7
    if (i > 0) week[col] = i
    if (col === 6 || i === last.getDate()) {
      weeks.push(week)
      week = new Array(7).fill('')
    }
  }
  return weeks
}

const weeks = computed(() => getWeeks(selectedMonth.value))

const isToday = (day) => {
  return day === today.getDate() && selectedMonth.value === today.getMonth() + 1
}
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
  width: 28px;
  height: 28px;
}

.icon-section {
  display: flex;
  gap: 12px;
  font-size: 20px;
}

.calendar-container {
  border: 2px solid #007bff;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.month-selector {
  margin-bottom: 12px;
}

.calendar {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  table-layout: fixed;
}

.calendar th {
  background: #f0f2f5;
  font-weight: bold;
  padding: 8px;
  border: 1px solid #ddd;
}

.calendar td {
  padding: 12px;
  border: 1px solid #ddd;
  height: 60px;
  vertical-align: top;
  font-size: 14px;
  background-color: #fafafa;
  transition: background-color 0.3s ease;
}

.calendar td.empty {
  background-color: #f9f9f9;
}

.calendar td.today {
  background-color: #cce5ff;
  font-weight: bold;
  color: #004085;
  border: 2px solid #007bff;
}
</style>
