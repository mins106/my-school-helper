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

    <div v-for="(meal, index) in meals" :key="index" class="meal-card">
      <div class="meal-date">{{ meal.date }}</div>
      <div class="meal-content">
        <div class="meal-left">
          <div class="kcal">{{ meal.kcal }}</div>
          <ul class="menu">
            <li v-for="(item, i) in meal.menu" :key="i">{{ item }}</li>
          </ul>
        </div>
        <div class="meal-right">
          <div class="review-title">리뷰</div>
          <div class="stars">
            <span v-for="n in 5" :key="n">{{ n <= meal.rating ? '★' : '☆' }}</span>
          </div>
          <i class="fas fa-pen edit-icon"></i>
        </div>
      </div>
      <div class="more">리뷰보기</div>
    </div>
  </div>
</template>

<script setup>
const meals = [
  {
    date: '5월 7일',
    kcal: '981.7 Kcal',
    rating: 4,
    menu: [
      '달걀꽃우밥',
      '쉬림프빠오',
      '마라탕',
      '배추겉절이(동)',
      '요플레(딸기)',
      '사과주스'
    ]
  },
  {
    date: '5월 8일',
    kcal: '709.1 Kcal',
    rating: 3,
    menu: [
      '흑미기장밥',
      '얼무된장국',
      '국물떡볶이(부)',
      '간장(돼지)불고기',
      '총각김치',
      '완자강정',
      '샐러드',
      '모듬쌈',
      '아이스망고'
    ]
  }
]
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
  margin-bottom: 24px;
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

.meal-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  margin-bottom: 24px;
  overflow: hidden;
}

.meal-date {
  background-color: #4b6cb7;
  color: white;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
}

.meal-content {
  display: flex;
  padding: 16px;
}

.meal-left {
  flex: 2;
}

.kcal {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 8px;
}

.menu {
  padding-left: 16px;
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.meal-right {
  flex: 1;
  text-align: center;
  border-left: 1px solid #ddd;
  padding-left: 12px;
}

.review-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.stars {
  font-size: 18px;
  color: #f0c000;
  margin-bottom: 6px;
}

.edit-icon {
  color: #555;
  font-size: 14px;
  cursor: pointer;
}

.more {
  text-align: right;
  font-size: 12px;
  padding: 8px 12px;
  color: #888;
  background: #f9f9f9;
  border-top: 1px solid #eee;
}
</style>
