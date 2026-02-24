<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { ElButton, ElTable, ElTableColumn } from 'element-plus'

const router = useRouter()
const gameStore = useGameStore()

const historyList = computed(() => gameStore.history)
const totalGames = computed(() => gameStore.totalGames)
const bestRecord = computed(() => gameStore.bestRecord)
const averageTime = computed(() => gameStore.averageTime)

const goHome = () => {
  router.push('/')
}

const formatNumbers = (row) => {
  return row.numbers.join(', ')
}

const formatResult = (row) => {
  return row.isSuccess ? '✓ 成功' : '✗ 失败'
}
</script>

<template>
  <div class="history">
    <div class="history-container">
      <div class="history-header">
        <el-button class="back-btn" @click="goHome" circle>
          ←
        </el-button>
        <h1 class="title">历史记录</h1>
      </div>

      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon">🎮</div>
          <div class="stat-content">
            <div class="stat-value">{{ totalGames }}</div>
            <div class="stat-label">总游戏次数</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-content">
            <div class="stat-value">{{ bestRecord ? bestRecord.solveTime + 's' : '-' }}</div>
            <div class="stat-label">最佳成绩</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-value">{{ averageTime > 0 ? averageTime + 's' : '-' }}</div>
            <div class="stat-label">平均时间</div>
          </div>
        </div>
      </div>

      <div class="table-section" v-if="historyList.length > 0">
        <el-table :data="historyList" stripe class="history-table">
          <el-table-column label="日期" prop="date" width="120" />
          <el-table-column label="时间" prop="time" width="120" />
          <el-table-column label="数字" width="150">
            <template #default="scope">
              {{ formatNumbers(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="结果" width="100">
            <template #default="scope">
              <span :class="scope.row.isSuccess ? 'success-text' : 'fail-text'">
                {{ formatResult(scope.row) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="解题时间">
            <template #default="scope">
              <span v-if="scope.row.isSuccess">{{ scope.row.solveTime }}s</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="empty-state" v-else>
        <div class="empty-icon">📝</div>
        <p>暂无游戏记录</p>
        <el-button type="primary" @click="goHome">
          开始游戏
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history {
  min-height: 100vh;
  padding: 20px;
}

.history-container {
  max-width: 900px;
  margin: 0 auto;
}

.history-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.back-btn {
  width: 48px;
  height: 48px;
  font-size: 20px;
  background: white;
  border: 2px solid #e0e0e0;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
}

.stats-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1;
  min-width: 200px;
  background: white;
  padding: 24px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  font-size: 36px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #4A90E2;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
}

.table-section {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.history-table {
  width: 100%;
}

.success-text {
  color: #50E3C2;
  font-weight: 600;
}

.fail-text {
  color: #E53935;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.empty-state p {
  font-size: 18px;
  color: #7f8c8d;
  margin-bottom: 24px;
}

@media (max-width: 600px) {
  .stats-cards {
    flex-direction: column;
  }

  .stat-card {
    width: 100%;
  }

  .history-table {
    font-size: 14px;
  }
}
</style>
