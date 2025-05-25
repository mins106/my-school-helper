<script setup>
import TimeTable from './components/TImeTable.vue'
import MealPage from './components/MealPage.vue' // ✅ 추가
import { ref } from 'vue'

const currentPage = ref('timetable') // 기본은 시간표
</script>

<template>
  <div>
    <MealPage v-if="currentPage === 'meal'" />
    <TimeTable v-else />
  </div>

  <div class="footer">
    <button @click="currentPage = 'timetable'">시간표</button>
    <button @click="currentPage = 'meal'">급식</button>
  </div>
</template>