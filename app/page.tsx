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
  const digits = value.replace(/\D/g, '').slice(0, 11)
  let r = '+7'
  if (digits.length > 1) r += ' (' + digits.slice(1, 4)
  if (digits.length >= 4) r += ') ' + digits.slice(4, 7)
  if (digits.length >= 7) r += '-' + digits.slice(7, 9)
  if (digits.length >= 9) r += '-' + digits.slice(9, 11)
  return r
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

    const newValue = Math.min(
      100,
      Math.max(0, activeGoal.progress + delta)
    )

    setGoals(p =>
      p.map(g =>
        g.id === activeGoal.id ? { ...g, progress: newValue } : g
      )
    )

    setActiveGoal({ ...activeGoal, progress: newValue })
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        {step === 'phone' && (
          <div className={styles.step}>
            <h1 className={styles.title}>ТВОИ ЦЕЛИ НА ГОД</h1>
            <p className={styles.subtitle}>трекер целей на год</p>
            <input className={styles.input} value={phone} onChange={e => setPhone(formatPhone(e.target.value))} />
            <button className={styles.button} disabled={!phoneValid} onClick={() => setStep('code')}>Войти</button>
          </div>
        )}

        {step === 'code' && (
          <div className={styles.step}>
            <h1 className={styles.title}>Код из SMS</h1>
            <input key={shakeKey} className={`${styles.input} ${styles.codeInput}`} value={code} maxLength={4} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} />
            <div className={styles.timer}>Отправить код повторно через <span>{timer} сек</span></div>
            <button className={styles.button} onClick={submitCode}>Подтвердить</button>
          </div>
        )}

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
                    <div className={styles.progressFill} style={{ width: `${goal.progress}%` }} />
                  </div>
                  <div className={styles.progressPercent}>{goal.progress}%</div>
                </div>
              </div>
            ))}

            <button className={styles.button} onClick={() => setStep('add-goal')}>
              + Добавить цель
            </button>
          </div>
        )}

        {step === 'add-goal' && (
          <div className={styles.step}>
            <h1 className={styles.title}>Новая цель</h1>
            <input className={styles.input} placeholder="Название цели" value={goalTitle} onChange={e => setGoalTitle(e.target.value)} />
            <textarea className={styles.input} style={{ height: 100 }} placeholder="Более развернуто опиши свою цель" value={goalDescription} onChange={e => setGoalDescription(e.target.value)} />
            <button className={styles.button} disabled={!goalTitle.trim()} onClick={saveGoal}>Сохранить</button>
          </div>
        )}

        {step === 'goal-view' && activeGoal && (
          <div className={styles.step}>
            <h1 className={styles.title}>{activeGoal.title}</h1>
            <p className={styles.subtitle}>{activeGoal.description}</p>

            <div className={styles.progressBig}>{activeGoal.progress}%</div>

            <div className={styles.progressButtons}>
              <button className={styles.button} onClick={() => updateProgress(-10)}>-10%</button>
              <button className={styles.button} onClick={() => updateProgress(10)}>+10%</button>
            </div>

            <div className={styles.deadline}>
              {timeLeft(activeGoal.deadline)}
            </div>

            <button className={styles.button} onClick={() => setStep('goals')}>
              Назад
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
