import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const operators = ['+', '-', '*', '/']
const operatorSymbols = { '+': '+', '-': '-', '*': '×', '/': '÷' }

const canMake24 = (nums) => {
  if (nums.length === 1) {
    return Math.abs(nums[0] - 24) < 0.0001
  }
  
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      const remaining = []
      for (let k = 0; k < nums.length; k++) {
        if (k !== i && k !== j) {
          remaining.push(nums[k])
        }
      }
      
      for (const op of operators) {
        let results = []
        
        if (op === '+') {
          results = [nums[i] + nums[j]]
        } else if (op === '-') {
          results = [nums[i] - nums[j], nums[j] - nums[i]]
        } else if (op === '*') {
          results = [nums[i] * nums[j]]
        } else if (op === '/') {
          if (nums[j] !== 0) results.push(nums[i] / nums[j])
          if (nums[i] !== 0) results.push(nums[j] / nums[i])
        }
        
        for (const result of results) {
          if (canMake24([...remaining, result])) {
            return true
          }
        }
      }
    }
  }
  
  return false
}

const getAllSolutions = (nums, originalNums) => {
  const solutions = new Set()
  const target = 24
  
  const formatNum = (n) => {
    if (Number.isInteger(n)) return n.toString()
    return n.toFixed(2).replace(/\.?0+$/, '')
  }

  const solve = (currentItems) => {
    if (currentItems.length === 1) {
      if (Math.abs(currentItems[0].value - target) < 0.0001 && currentItems[0].usedNums.length === originalNums.length) {
        solutions.add(currentItems[0].expression)
      }
      return
    }
    
    for (let i = 0; i < currentItems.length; i++) {
      for (let j = i + 1; j < currentItems.length; j++) {
        const a = currentItems[i]
        const b = currentItems[j]
        const remaining = currentItems.filter((_, idx) => idx !== i && idx !== j)
        
        for (const op of operators) {
          let results = []
          
          if (op === '+') {
            results.push({
              value: a.value + b.value,
              expression: `(${a.expression} + ${b.expression})`,
              usedNums: [...a.usedNums, ...b.usedNums]
            })
          } else if (op === '-') {
            results.push({
              value: a.value - b.value,
              expression: `(${a.expression} - ${b.expression})`,
              usedNums: [...a.usedNums, ...b.usedNums]
            })
            results.push({
              value: b.value - a.value,
              expression: `(${b.expression} - ${a.expression})`,
              usedNums: [...a.usedNums, ...b.usedNums]
            })
          } else if (op === '*') {
            results.push({
              value: a.value * b.value,
              expression: `(${a.expression} × ${b.expression})`,
              usedNums: [...a.usedNums, ...b.usedNums]
            })
          } else if (op === '/') {
            if (b.value !== 0) {
              results.push({
                value: a.value / b.value,
                expression: `(${a.expression} ÷ ${b.expression})`,
                usedNums: [...a.usedNums, ...b.usedNums]
              })
            }
            if (a.value !== 0) {
              results.push({
                value: b.value / a.value,
                expression: `(${b.expression} ÷ ${a.expression})`,
                usedNums: [...a.usedNums, ...b.usedNums]
              })
            }
          }
          
          for (const result of results) {
            solve([...remaining, result])
          }
        }
      }
    }
  }

  const initialItems = originalNums.map((n, idx) => ({
    value: n,
    expression: formatNum(n),
    usedNums: [idx]
  }))
  
  solve(initialItems)
  return Array.from(solutions)
}

export const useGameStore = defineStore('game', () => {
  const numbers = ref([])
  const usedNumbers = ref([])
  const expression = ref('')
  const isSolved = ref(false)
  const solveTime = ref(0)
  const startTime = ref(null)
  const history = ref([])
  const showRules = ref(false)
  const showAnswer = ref(false)
  const solutions = ref([])

  const generateNumbers = () => {
    let newNumbers = []
    let attempts = 0
    const maxAttempts = 100
    
    do {
      newNumbers = []
      for (let i = 0; i < 4; i++) {
        newNumbers.push(Math.floor(Math.random() * 13) + 1)
      }
      attempts++
    } while (!canMake24(newNumbers) && attempts < maxAttempts)
    
    numbers.value = newNumbers
    usedNumbers.value = [false, false, false, false]
    expression.value = ''
    isSolved.value = false
    solveTime.value = 0
    startTime.value = Date.now()
    showAnswer.value = false
    solutions.value = []
  }

  const addToExpression = (value) => {
    expression.value += value
  }

  const removeLast = () => {
    if (expression.value.length > 0) {
      const lastChar = expression.value[expression.value.length - 1]
      expression.value = expression.value.slice(0, -1)
      if (!isNaN(lastChar) && lastChar !== ' ' && lastChar !== '×' && lastChar !== '÷') {
        const numIndex = numbers.value.indexOf(parseInt(lastChar))
        if (numIndex !== -1) {
          const usedInExpr = expression.value.split(/[\+\-\*\/\(\)×÷（）)]/).filter(s => s.trim() === lastChar)
          const count = usedInExpr.length
          let available = 0
          for (let i = 0; i < numbers.value.length; i++) {
            if (numbers.value[i] === parseInt(lastChar) && !usedNumbers.value[i]) {
              available++
            }
          }
          if (available > count) {
            for (let i = 0; i < numbers.value.length; i++) {
              if (numbers.value[i] === parseInt(lastChar) && usedNumbers.value[i]) {
                const remaining = expression.value.split(/[\+\-\*\/\(\)×÷（）)]/).filter(s => s.trim() === lastChar).length
                const total = numbers.value.filter(n => n === parseInt(lastChar)).length
                if (remaining < total - 1) {
                  usedNumbers.value[i] = false
                  break
                }
              }
            }
          }
        }
      }
    }
  }

  const resetExpression = () => {
    expression.value = ''
    usedNumbers.value = [false, false, false, false]
  }

  const markNumberUsed = (index) => {
    if (index >= 0 && index < usedNumbers.value.length) {
      usedNumbers.value[index] = true
    }
  }

  const checkResult = () => {
    if (!expression.value || numbers.value.length === 0) return false
    
    try {
      const expr = expression.value.replace(/×/g, '*').replace(/÷/g, '/')
      const result = eval(expr)
      const allUsed = usedNumbers.value.every(u => u)
      if (Math.abs(result - 24) < 0.0001 && allUsed) {
        isSolved.value = true
        solveTime.value = Math.floor((Date.now() - startTime.value) / 1000)
        saveToHistory()
        return true
      }
    } catch (e) {
      return false
    }
    return false
  }

  const saveToHistory = () => {
    const record = {
      id: uuidv4(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      numbers: [...numbers.value],
      solution: expression.value,
      solveTime: solveTime.value,
      isSuccess: true
    }
    history.value.unshift(record)
    if (history.value.length > 50) {
      history.value = history.value.slice(0, 50)
    }
    localStorage.setItem('24point_history', JSON.stringify(history.value))
  }

  const loadHistory = () => {
    const saved = localStorage.getItem('24point_history')
    if (saved) {
      history.value = JSON.parse(saved)
    }
  }

  const bestRecord = computed(() => {
    if (history.value.length === 0) return null
    const successes = history.value.filter(r => r.isSuccess)
    if (successes.length === 0) return null
    return successes.reduce((best, current) => 
      current.solveTime < best.solveTime ? current : best
    )
  })

  const averageTime = computed(() => {
    const successes = history.value.filter(r => r.isSuccess)
    if (successes.length === 0) return 0
    const total = successes.reduce((sum, r) => sum + r.solveTime, 0)
    return Math.floor(total / successes.length)
  })

  const totalGames = computed(() => history.value.length)

  return {
    numbers,
    usedNumbers,
    expression,
    isSolved,
    solveTime,
    startTime,
    history,
    showRules,
    showAnswer,
    solutions,
    generateNumbers,
    addToExpression,
    removeLast,
    resetExpression,
    markNumberUsed,
    checkResult,
    saveToHistory,
    loadHistory,
    bestRecord,
    averageTime,
    totalGames,
    showSolutions: () => {
      solutions.value = getAllSolutions([...numbers.value], numbers.value)
      showAnswer.value = true
    },
    hideSolutions: () => {
      showAnswer.value = false
    },
    checkCustomNumbers: (nums) => {
      return getAllSolutions([...nums], nums)
    }
  }
})
