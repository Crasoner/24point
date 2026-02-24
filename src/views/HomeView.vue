<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { ElButton, ElDialog, ElInput, ElInputNumber, ElMessage } from 'element-plus'

const router = useRouter()
const gameStore = useGameStore()

const showCustomInput = ref(false)
const customNumbers = ref([1, 1, 1, 1])
const customSolutions = ref([])
const showCustomAnswer = ref(false)

const startGame = () => {
  gameStore.generateNumbers()
  router.push('/game')
}

const showRules = () => {
  gameStore.showRules = true
}

const goToHistory = () => {
  router.push('/history')
}

const openCustomInput = () => {
  showCustomInput.value = true
}

const checkCustomNumbers = () => {
  const nums = customNumbers.value
  
  const hasEmpty = nums.some(n => n === null || n === undefined)
  const hasInvalid = nums.some(n => n < 1 || n > 13)
  
  if (hasEmpty || hasInvalid) {
    ElMessage.warning('请输入1-13之间的数字')
    return
  }
  
  customSolutions.value = gameStore.checkCustomNumbers(nums)
  showCustomAnswer.value = true
}

const startGameWithCustom = () => {
  gameStore.numbers = [...customNumbers.value]
  gameStore.usedNumbers = [false, false, false, false]
  gameStore.expression = ''
  gameStore.isSolved = false
  gameStore.solveTime = 0
  gameStore.startTime = Date.now()
  showCustomInput.value = false
  router.push('/game')
}
</script>

<template>
  <div class="home">
    <div class="home-container">
      <div class="logo-section">
        <div class="logo">
          <span class="logo-icon">🎯</span>
        </div>
        <h1 class="title">24点游戏</h1>
        <p class="subtitle">挑战你的数学思维</p>
      </div>

      <div class="action-section">
        <el-button 
          type="primary" 
          size="large" 
          class="start-btn"
          @click="startGame"
        >
          开始游戏
        </el-button>

        <el-button 
          size="large" 
          class="custom-btn"
          @click="openCustomInput"
        >
          自定义数字
        </el-button>

        <el-button 
          size="large" 
          class="rules-btn"
          @click="showRules"
        >
          规则说明
        </el-button>

        <el-button 
          size="large" 
          class="history-btn"
          @click="goToHistory"
        >
          历史记录
        </el-button>
      </div>

      <div class="stats-section" v-if="gameStore.totalGames > 0">
        <div class="stat-card">
          <div class="stat-value">{{ gameStore.totalGames }}</div>
          <div class="stat-label">总游戏次数</div>
        </div>
        <div class="stat-card" v-if="gameStore.bestRecord">
          <div class="stat-value">{{ gameStore.bestRecord.solveTime }}s</div>
          <div class="stat-label">最佳成绩</div>
        </div>
        <div class="stat-card" v-if="gameStore.averageTime > 0">
          <div class="stat-value">{{ gameStore.averageTime }}s</div>
          <div class="stat-label">平均时间</div>
        </div>
      </div>
    </div>

    <el-dialog 
      v-model="gameStore.showRules" 
      title="游戏规则" 
      width="500px"
      class="rules-dialog"
    >
      <div class="rules-content">
        <h3>玩法说明</h3>
        <p>使用给定的4个数字，通过加、减、乘、除四则运算，使计算结果等于24。</p>
        
        <h3>规则</h3>
        <ul>
          <li>每个数字只能使用一次</li>
          <li>可以使用括号改变运算顺序</li>
          <li>运算结果必须恰好等于24</li>
        </ul>

        <h3>示例</h3>
        <div class="example">
          <p>数字: 2, 6, 8, 9</p>
          <p>解法: (9 - 6) × (8 - 2) = 24</p>
        </div>
      </div>
    </el-dialog>

    <el-dialog 
      v-model="showCustomInput" 
      title="自定义数字" 
      width="500px"
      class="custom-dialog"
      :close-on-click-modal="false"
    >
      <div class="custom-input-section" v-if="!showCustomAnswer">
        <p class="input-hint">请输入4个1-13之间的数字：</p>
        <div class="number-inputs">
          <el-input-number 
            v-for="i in 4" 
            :key="i"
            v-model="customNumbers[i-1]" 
            :min="1" 
            :max="13" 
            size="large"
            class="num-input"
          />
        </div>
        <div class="dialog-actions">
          <el-button @click="showCustomInput = false">取消</el-button>
          <el-button type="primary" @click="checkCustomNumbers">查看答案</el-button>
        </div>
      </div>

      <div class="custom-answer-section" v-else>
        <p class="numbers-info">数字: {{ customNumbers.join(', ') }}</p>
        <div class="hint-message">
          <span v-if="customSolutions.length > 0">✅ 这组数字可以计算出24！</span>
          <span v-else>❌ 这组数字无法计算出24</span>
        </div>
        <div v-if="customSolutions.length > 0" class="solutions-list">
          <h3>共 {{ customSolutions.length }} 种解法:</h3>
          <ul>
            <li v-for="(sol, index) in customSolutions" :key="index">
              {{ sol }}
            </li>
          </ul>
        </div>
        <div class="dialog-actions">
          <el-button @click="showCustomAnswer = false">返回修改</el-button>
          <el-button type="primary" @click="startGameWithCustom">用此数字开始游戏</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.home-container {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.logo-section {
  margin-bottom: 60px;
}

.logo {
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #4A90E2 0%, #67B8E8 100%);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 40px rgba(74, 144, 226, 0.3);
}

.logo-icon {
  font-size: 60px;
}

.title {
  font-size: 48px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 18px;
  color: #7f8c8d;
}

.action-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 60px;
}

.start-btn {
  width: 100%;
  height: 56px;
  font-size: 20px;
  font-weight: 600;
  border-radius: 28px;
  background: linear-gradient(135deg, #4A90E2 0%, #67B8E8 100%);
  border: none;
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
  transition: all 0.3s ease;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(74, 144, 226, 0.5);
}

.rules-btn, .history-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  border-radius: 24px;
  background: white;
  border: 2px solid #e0e0e0;
  color: #666;
  transition: all 0.3s ease;
}

.rules-btn:hover, .history-btn:hover {
  border-color: #4A90E2;
  color: #4A90E2;
}

.custom-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  border-radius: 24px;
  background: #ff9800;
  border: none;
  color: white;
}

.custom-btn:hover {
  background: #f57c00;
}

.stats-section {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.stat-card {
  background: white;
  padding: 20px 32px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  min-width: 120px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #4A90E2;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
}

.rules-content {
  text-align: left;
}

.rules-content h3 {
  color: #2c3e50;
  margin: 20px 0 12px;
  font-size: 18px;
}

.rules-content h3:first-child {
  margin-top: 0;
}

.rules-content p {
  color: #666;
  line-height: 1.8;
  margin-bottom: 12px;
}

.rules-content ul {
  padding-left: 20px;
  color: #666;
  line-height: 2;
}

.example {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
  margin-top: 12px;
}

.example p {
  margin: 4px 0;
}

.custom-input-section {
  text-align: center;
  padding: 20px 0;
}

.input-hint {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

.number-inputs {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.num-input {
  width: 80px;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
}

.custom-answer-section {
  text-align: center;
}

.numbers-info {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 16px;
}

.hint-message {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  padding: 12px;
  border-radius: 8px;
  background: #f5f7fa;
}

@media (max-width: 480px) {
  .title {
    font-size: 36px;
  }
  
  .logo {
    width: 100px;
    height: 100px;
  }
  
  .logo-icon {
    font-size: 48px;
  }
  
  .stats-section {
    flex-direction: column;
    align-items: center;
  }
  
  .stat-card {
    width: 100%;
    max-width: 200px;
  }
}
</style>
