<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { ElButton, ElMessage, ElDialog } from 'element-plus'

const router = useRouter()
const gameStore = useGameStore()

const currentTime = ref(0)
let timer = null
const showDetailedAnswer = ref(false)

const operators = ['+', '-', '×', '÷']
const brackets = ['(', ')']

onMounted(() => {
  if (gameStore.numbers.length === 0) {
    gameStore.generateNumbers()
  }
  timer = setInterval(() => {
    currentTime.value = Math.floor((Date.now() - gameStore.startTime) / 1000)
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

const handleNumberClick = (num, index) => {
  if (gameStore.usedNumbers[index]) {
    return
  }
  gameStore.addToExpression(num.toString())
  gameStore.markNumberUsed(index)
}

const handleOperatorClick = (op) => {
  gameStore.addToExpression(op)
}

const handleBracketClick = (bracket) => {
  gameStore.addToExpression(bracket)
}

const handleDelete = () => {
  gameStore.removeLast()
}

const handleReset = () => {
  gameStore.resetExpression()
}

const handleSubmit = () => {
  if (!gameStore.expression) {
    ElMessage.warning('请输入计算表达式')
    return
  }
  
  const success = gameStore.checkResult()
  if (success) {
    router.push('/result')
  } else {
    ElMessage.error('结果不正确，请重新尝试')
  }
}

const goHome = () => {
  router.push('/')
}

const showAnswer = () => {
  showDetailedAnswer.value = false
  gameStore.showSolutions()
}
</script>

<template>
  <div class="game">
    <div class="game-header">
      <el-button class="back-btn" @click="goHome" circle>
        ←
      </el-button>
      <div class="timer">
        ⏱️ {{ currentTime }}s
      </div>
    </div>

    <div class="game-content">
      <div class="numbers-section">
        <div 
          v-for="(num, index) in gameStore.numbers" 
          :key="index"
          class="number-card"
          :class="{ used: gameStore.usedNumbers[index] }"
        >
          {{ num }}
        </div>
      </div>

      <div class="expression-section">
        <div class="expression-display">
          {{ gameStore.expression || '点击下方按钮输入表达式' }}
        </div>
      </div>

      <div class="keyboard-section">
        <div class="numbers-row">
          <button
            v-for="(num, index) in gameStore.numbers"
            :key="'num-' + index"
            class="key-btn number-btn"
            :class="{ used: gameStore.usedNumbers[index] }"
            :disabled="gameStore.usedNumbers[index]"
            @click="handleNumberClick(num, index)"
          >
            {{ num }}
          </button>
        </div>

        <div class="operators-row">
          <button
            v-for="op in operators"
            :key="op"
            class="key-btn operator-btn"
            @click="handleOperatorClick(op)"
          >
            {{ op }}
          </button>
        </div>

        <div class="brackets-row">
          <button
            v-for="bracket in brackets"
            :key="bracket"
            class="key-btn bracket-btn"
            @click="handleBracketClick(bracket)"
          >
            {{ bracket }}
          </button>
          <button class="key-btn delete-btn" @click="handleDelete">
            ⌫
          </button>
        </div>

        <div class="action-row">
          <el-button class="reset-btn" @click="handleReset">
            重置
          </el-button>
          <el-button class="answer-btn" @click="showAnswer">
            查看答案
          </el-button>
          <el-button type="primary" class="submit-btn" @click="handleSubmit">
            提交
          </el-button>
        </div>
      </div>
    </div>

    <el-dialog 
      v-model="gameStore.showAnswer" 
      title="答案提示" 
      width="500px"
      class="answer-dialog"
    >
      <div class="dialog-content">
        <p class="numbers-info">数字: {{ gameStore.numbers.join(', ') }}</p>
        
        <div v-if="!showDetailedAnswer" class="hint-section">
          <div class="hint-message">
            <span v-if="gameStore.solutions.length > 0">✅ 这组数字可以计算出24！</span>
            <span v-else>❌ 这组数字无法计算出24</span>
          </div>
          <el-button 
            v-if="gameStore.solutions.length > 0" 
            type="primary" 
            size="large" 
            class="show-answer-btn"
            @click="showDetailedAnswer = true"
          >
            查看具体答案 ({{ gameStore.solutions.length }}种)
          </el-button>
        </div>

        <div v-else class="solutions-list">
          <el-button class="back-hint-btn" @click="showDetailedAnswer = false">
            ← 返回提示
          </el-button>
          <h3>共 {{ gameStore.solutions.length }} 种解法:</h3>
          <ul>
            <li v-for="(sol, index) in gameStore.solutions" :key="index">
              {{ sol }}
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.game {
  min-height: 100vh;
  padding: 20px;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.back-btn {
  width: 48px;
  height: 48px;
  font-size: 20px;
  background: white;
  border: 2px solid #e0e0e0;
}

.timer {
  font-size: 24px;
  font-weight: 600;
  color: #4A90E2;
  background: white;
  padding: 10px 24px;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.game-content {
  max-width: 600px;
  margin: 0 auto;
}

.numbers-section {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.number-card {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  color: #2c3e50;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.number-card.used {
  background: #e0e0e0;
  color: #999;
  transform: scale(0.95);
}

.expression-section {
  margin-bottom: 30px;
}

.expression-display {
  background: white;
  border-radius: 16px;
  padding: 24px;
  min-height: 80px;
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  word-break: break-all;
}

.keyboard-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.numbers-row, .operators-row, .brackets-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.action-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.key-btn {
  width: 70px;
  height: 60px;
  border: none;
  border-radius: 16px;
  font-size: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.number-btn {
  background: white;
  color: #2c3e50;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.number-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.number-btn.used, .number-btn:disabled {
  background: #e0e0e0;
  color: #999;
  cursor: not-allowed;
}

.operator-btn {
  background: #4A90E2;
  color: white;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.operator-btn:hover {
  background: #3a7bc8;
  transform: translateY(-2px);
}

.bracket-btn {
  background: #67B8E8;
  color: white;
  box-shadow: 0 4px 12px rgba(103, 184, 232, 0.3);
}

.bracket-btn:hover {
  background: #5aa8d8;
  transform: translateY(-2px);
}

.delete-btn {
  background: #E53935;
  color: white;
  box-shadow: 0 4px 12px rgba(229, 57, 53, 0.3);
}

.delete-btn:hover {
  background: #c62828;
  transform: translateY(-2px);
}

.reset-btn {
  width: 120px;
  height: 56px;
  font-size: 18px;
  border-radius: 28px;
  background: white;
  border: 2px solid #e0e0e0;
  color: #666;
}

.reset-btn:hover {
  border-color: #4A90E2;
  color: #4A90E2;
}

.answer-btn {
  width: 120px;
  height: 56px;
  font-size: 18px;
  border-radius: 28px;
  background: #ff9800;
  border: none;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.answer-btn:hover {
  background: #f57c00;
  transform: translateY(-2px);
}

.submit-btn {
  width: 120px;
  height: 56px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 28px;
  background: linear-gradient(135deg, #50E3C2 0%, #3bc9a8 100%);
  border: none;
  box-shadow: 0 6px 20px rgba(80, 227, 194, 0.4);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(80, 227, 194, 0.5);
}

.dialog-content {
  text-align: center;
}

.numbers-info {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.hint-section {
  padding: 30px 0;
}

.hint-message {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 12px;
  background: #f5f7fa;
}

.show-answer-btn {
  width: 100%;
  height: 56px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 28px;
}

.back-hint-btn {
  margin-bottom: 16px;
}

.solutions-list {
  text-align: left;
  max-height: 300px;
  overflow-y: auto;
}

.solutions-list h3 {
  color: #4A90E2;
  margin-bottom: 12px;
}

.solutions-list ul {
  list-style: none;
  padding: 0;
}

.solutions-list li {
  padding: 12px;
  background: #f5f7fa;
  margin-bottom: 8px;
  border-radius: 8px;
  font-size: 16px;
  color: #2c3e50;
  font-weight: 500;
}

@media (max-width: 480px) {
  .key-btn {
    width: 60px;
    height: 52px;
    font-size: 20px;
  }

  .number-card {
    width: 65px;
    height: 65px;
    font-size: 28px;
  }

  .expression-display {
    font-size: 22px;
    padding: 18px;
  }

  .action-row {
    flex-direction: column;
    align-items: center;
  }

  .reset-btn, .submit-btn {
    width: 100%;
    max-width: 200px;
  }
}
</style>
