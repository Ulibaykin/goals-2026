'use client'

import { useEffect, useState } from 'react'
import styles from './auth.module.css'

type Step = 'phone' | 'code' | 'goals' | 'add-goal' | 'goal-view'

type Goal = {
  id: number
  title: string
  description: string
  progress: number
  deadline: number
}

const DEFAULT_DEADLINE = new Date('2026-12-31T23:59:59').getTime()

function formatPhone(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 11)
  let r = '+7'
  if (d.length > 1) r += ' (' + d.slice(1, 4)
  if (d.length >= 4) r += ') ' + d.slice(4, 7)
  if (d.length >= 7) r += '-' + d.slice(7, 9)
  if (d.length >= 9) r += '-' + d.slice(9, 11)
  return r
}

/* 🎨 цвет процента: тёмно-жёлтый → золотой */
function percentColor(progress: number) {
  const start = { r: 161, g: 98, b: 7 }   // тёмно-жёлтый
  const end   = { r: 250, g: 204, b: 21 } // золотой

  const p = progress / 100

  const r = Math.round(start.r + (end.r - start.r) * p)
  const g = Math.round(start.g + (end.g - start.g) * p)
  const b = Math.round(start.b + (end.b - start.b) * p)

  return `rgb(${r}, ${g}, ${b})`
}

function timeLeft(deadline: number) {
  const diff = deadline - Date.now()
  if (diff <= 0) return 'Срок истёк'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  return `Осталось: ${days} дн. ${hours} ч.`
}

export default function Page() {
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('+7')
  const [code, setCode] = useState('')
  const [timer, setTimer] = useState(60)
  const [shakeKey, setShakeKey] = useState(0)

  const [goals, setGoals] = useState<Goal[]>([])
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null)

  const [goalTitle, setGoalTitle] = useState('')
  const [goalDescription, setGoalDescription] = useState('')

  const phoneValid = phone.replace(/\D/g, '').length === 11
  const codeValid = code.length === 4

  useEffect(() => {
    if (step !== 'code') return
    setTimer(60)
    const i = setInterval(() => {
      setTimer(t => (t > 0 ? t - 1 : 0))
    }, 1000)
    return () => clearInterval(i)
  }, [step])

  function submitCode() {
    if (!codeValid) {
      setShakeKey(k => k + 1)
      return
    }
    setStep('goals')
  }

  function saveGoal() {
    const g: Goal = {
      id: Date.now(),
      title: goalTitle.trim(),
      description: goalDescription.trim(),
      progress: 0,
      deadline: DEFAULT_DEADLINE,
    }
    setGoals(p => [g, ...p])
    setGoalTitle('')
    setGoalDescription('')
    setStep('goals')
  }

  function updateProgress(delta: number) {
    if (!activeGoal) return
    const v = Math.min(100, Math.max(0, activeGoal.progress + delta))

    setGoals(p =>
      p.map(g => g.id === activeGoal.id ? { ...g, progress: v } : g)
    )
    setActiveGoal({ ...activeGoal, progress: v })
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        {step === 'goals' && (
          <div className={styles.step}>
            <h1 className={styles.title}>Мои цели на 2026</h1>

            {goals.map(goal => (
              <div
                key={goal.id}
                className={styles.goalCard}
                onClick={() => {
                  setActiveGoal(goal)
                  setStep('goal-view')
                }}
              >
                <div className={styles.goalTitle}>{goal.title}</div>
                <div className={styles.goalDescription}>{goal.description}</div>

                <div className={styles.progressRow}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <div
                    className={styles.progressPercent}
                    style={{ color: percentColor(goal.progress) }}
                  >
                    {goal.progress}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* остальные экраны — без изменений */}
      </div>
    </div>
  )
}
