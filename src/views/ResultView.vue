<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { ElButton } from 'element-plus'

const router = useRouter()
const gameStore = useGameStore()

const isSuccess = computed(() => gameStore.isSolved)

const playAgain = () => {
  gameStore.generateNumbers()
  router.push('/game')
}

const goHome = () => {
  router.push('/')
}

const numbers = computed(() => gameStore.numbers)
const solveTime = computed(() => gameStore.solveTime)
</script>

<template>
  <div class="result">
    <div class="result-container">
      <div class="result-icon" :class="{ success: isSuccess, fail: !isSuccess }">
        {{ isSuccess ? '✓' : '✗' }}
      </div>

      <h1 class="result-title">
        {{ isSuccess ? '恭喜成功！' : '挑战失败' }}
      </h1>

      <div v-if="isSuccess" class="result-details">
        <div class="detail-card">
          <div class="detail-label">使用数字</div>
          <div class="detail-value numbers">
            <span v-for="(num, index) in numbers" :key="index" class="num-item">
              {{ num }}
            </span>
          </div>
        </div>

        <div class="detail-card">
          <div class="detail-label">解题时间</div>
          <div class="detail-value time">{{ solveTime }}秒</div>
        </div>

        <div class="detail-card">
          <div class="detail-label">表达式</div>
          <div class="detail-value expression">{{ gameStore.expression }}</div>
        </div>
      </div>

      <div v-else class="fail-message">
        <p>很遗憾，这次没有算出24</p>
        <p>再接再厉，下次一定能行！</p>
      </div>

      <div class="action-buttons">
        <el-button type="primary" class="play-again-btn" @click="playAgain">
          重新开始
        </el-button>
        <el-button class="home-btn" @click="goHome">
          返回主页
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.result-container {
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.result-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  font-weight: 700;
  margin: 0 auto 30px;
}

.result-icon.success {
  background: linear-gradient(135deg, #50E3C2 0%, #3bc9a8 100%);
  color: white;
  box-shadow: 0 10px 40px rgba(80, 227, 194, 0.4);
}

.result-icon.fail {
  background: linear-gradient(135deg, #E53935 0%, #c62828 100%);
  color: white;
  box-shadow: 0 10px 40px rgba(229, 57, 53, 0.4);
}

.result-title {
  font-size: 36px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 40px;
}

.result-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}

.detail-card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.detail-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 8px;
}

.detail-value {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.detail-value.numbers {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.num-item {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4A90E2 0%, #67B8E8 100%);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.detail-value.time {
  font-size: 28px;
  color: #50E3C2;
}

.detail-value.expression {
  font-size: 18px;
  color: #4A90E2;
}

.fail-message {
  background: white;
  padding: 30px;
  border-radius: 16px;
  margin-bottom: 40px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.fail-message p {
  color: #666;
  font-size: 16px;
  line-height: 1.8;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.play-again-btn {
  width: 100%;
  height: 56px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 28px;
  background: linear-gradient(135deg, #4A90E2 0%, #67B8E8 100%);
  border: none;
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
}

.play-again-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(74, 144, 226, 0.5);
}

.home-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  border-radius: 24px;
  background: white;
  border: 2px solid #e0e0e0;
  color: #666;
}

.home-btn:hover {
  border-color: #4A90E2;
  color: #4A90E2;
}
</style>
