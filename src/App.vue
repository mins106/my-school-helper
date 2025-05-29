<template>
  <div class="app-wrapper">
    <div>
      <MealPage v-if="currentPage === 'meal'" />
      <TimeTable v-else-if="currentPage === 'timetable'" />
      <CalendarPage v-else />
    </div>

    <footer class="bottom-nav">
      <button
        class="nav-item"
        :class="{ active: currentPage === 'meal' }"
        @click="currentPage = 'meal'"
      >
        <div class="icon-label">🍴<br><span>급식</span></div>
      </button>
      <button
        class="nav-item"
        :class="{ active: currentPage === 'timetable' }"
        @click="currentPage = 'timetable'"
      >
        <div class="icon-label">🕒<br><span>시간표</span></div>
      </button>
      <button
        class="nav-item"
        :class="{ active: currentPage === 'calendar' }"
        @click="currentPage = 'calendar'"
      >
        <div class="icon-label">📅<br><span>달력</span></div>
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TimeTable from './components/TimeTable.vue'
import MealPage from './components/MealPage.vue'
import CalendarPage from './components/CalendarPage.vue'

const currentPage = ref('timetable')
</script>

<style scoped>
.app-wrapper {
  position: relative;
  padding-bottom: 60px;
  min-height: 100vh;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #ddd;
  z-index: 1000;
}

.nav-item {
  background: none;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  text-align: center;
  flex: 1;
  border: none;
}

.nav-item.active {
  color: #333;
  font-weight: bold;
}

.icon-label {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 1.2;
}
</style>
