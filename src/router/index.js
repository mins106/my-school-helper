import { createRouter, createWebHistory } from 'vue-router'

import TimeTable from '@/components/TimeTable.vue'
import MealPage from '@/components/MealPage.vue'
import CalendarPage from '@/components/CalendarPage.vue'
import ReviewForm from '@/components/ReviewPage.vue'
import ReviewListPage from '@/components/ReviewListPage.vue' // ✅
import MemoPage from '../components/MemoPage.vue'
import MemoViewPage from '../components/MemoViewPage.vue'

const routes = [
  { path: '/', redirect: '/timetable' }, // 시작페이지는 시간표
  { path: '/timetable', component: TimeTable },
  { path: '/meals', component: MealPage },
  { path: '/calendar', component: CalendarPage },
  { path: '/review/:date', component: ReviewForm }, // 리뷰 남기기
  { path: '/review/:date/view', component: ReviewListPage }, // ✅ 리뷰 보기
  { path: '/memo', name: 'MemoPage', component: MemoPage },
  { path: '/memo-view', name: 'MemoViewPage', component: MemoViewPage }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
