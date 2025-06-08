<template>
  <div class="app-wrapper">
    <!-- 현재 라우트에 해당하는 컴포넌트를 보여줌 -->
    <router-view />

    <!-- 하단 탭 네비게이션 -->
    <footer class="bottom-nav">
      <router-link
        to="/meals"
        class="nav-item"
        :class="{ active: $route.path.startsWith('/meals') }"
      >
        <div class="icon-label">🍴<br /><span>급식</span></div>
      </router-link>

      <router-link
        to="/timetable"
        class="nav-item"
        :class="{ active: $route.path.startsWith('/timetable') }"
      >
        <div class="icon-label">🕒<br /><span>시간표</span></div>
      </router-link>

      <router-link
        to="/calendar"
        class="nav-item"
        :class="{ active: $route.path.startsWith('/calendar') }"
      >
        <div class="icon-label">📅<br /><span>달력</span></div>
      </router-link>
    </footer>
  </div>
</template>

<script setup>
// 이제 currentPage는 필요 없음!
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
  text-decoration: none;
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