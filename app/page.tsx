'use client'

import { useEffect, useState } from 'react'
import styles from './auth.module.css'

type Step = 'phone' | 'code' | 'list' | 'add' | 'goal'

interface Goal {
  id: number
  title: string
  description: string
  progress: number
  completedAt?: string
}

const DEADLINE = new Date('2026-12-31T23:59:59')

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  let r = '+7'
  if (digits.length > 1) r += ' (' + digits.slice(1, 4)
  if (digits.length >= 4) r += ') ' + digits.slice(4, 7)
  if (digits.length >= 7) r += '-' + digits.slice(7, 9)
  if (digits.length >= 9) r += '-' + digits.slice(9, 11)
  return r
}

function timeLeft() {
  const now = new Date()
  const diff = DEADLINE.getTime() - now.getTime()
  if (diff <= 0) return 'Срок истёк'

  const totalMin = Math.floor(diff / 60000)
  const days = Math.floor(totalMin / 1440)
  const hours = Math.floor((totalMin % 1440) / 60)
  const minutes = totalMin % 60

  return `Осталось: ${days} дн ${hours} ч ${minutes} мин`
}

export default function Page() {
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('+7')
  const [code, setCode] = useState('')
  const [shake, setShake] = useState(false)

  const [goals, setGoals] = useState<Goal[]>([])
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null)

  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [deadlineText, setDeadlineText] = useState(timeLeft())

  const phoneValid = phone.replace(/\D/g, '').length === 11
  const codeValid = code.length === 4

  useEffect(() => {
    const t = setInterval(() => {
      setDeadlineText(timeLeft())
    }, 60000)
    return () => clearInterval(t)
  }, [])

  function submitCode() {
    if (!codeValid) {
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }
    setStep('list')
  }

  function saveGoal() {
    if (!newTitle.trim()) return

    setGoals([
      ...goals,
      {
        id: Date.now(),
        title: newTitle,
        description: newDesc,
        progress: 0
      }
    ])

    setNewTitle('')
    setNewDesc('')
    setStep('list')
  }

  function updateProgress(delta: number) {
    if (!activeGoal) return
    const next = Math.min(100, Math.max(0, activeGoal.progress + delta))
    const completedAt =
      next === 100 && !activeGoal.completedAt
        ? new Date().toLocaleDateString('ru-RU')
        : activeGoal.completedAt

    const updated = { ...activeGoal, progress: next, completedAt }

    setActiveGoal(updated)
    setGoals(
      goals
        .map(g => (g.id === updated.id ? updated : g))
        .sort((a, b) => (a.progress === 100 ? 1 : -1))
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.card} ${shake ? styles.shake : ''}`}>

        {step === 'phone' && (
          <div className={styles.center}>
            <h1 className={styles.title}>ТВОИ ЦЕЛИ НА ГОД</h1>
            <p className={styles.subtitle}>трекер целей на год</p>

            <input
              className={styles.input}
              value={phone}
              onChange={e => setPhone(formatPhone(e.target.value))}
            />

            <button
              className={styles.button}
              disabled={!phoneValid}
              onClick={() => setStep('code')}
            >
              Войти
            </button>
          </div>
        )}

        {step === 'code' && (
          <div className={styles.center}>
            <h1 className={styles.title}>Код из SMS</h1>

            <input
              className={styles.input}
              maxLength={4}
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            />

            <button className={styles.button} onClick={submitCode}>
              Подтвердить
            </button>
          </div>
        )}

        {step === 'list' && (
          <div>
            <h1 className={styles.title}>Мои цели на 2026</h1>

            {goals.length === 0 && (
              <p className={styles.subtitle}>
                У тебя пока нет целей на 2026 год
              </p>
            )}

            {goals.map(g => (
              <div
                key={g.id}
                className={styles.goalCard}
                onClick={() => {
                  setActiveGoal(g)
                  setStep('goal')
                }}
              >
                <div className={styles.goalHeader}>
                  <h3>{g.title}</h3>
                  {g.progress === 100 ? '🏆' : (
                    <span className={styles.percent}>{g.progress}%</span>
                  )}
                </div>

                <p className={styles.goalDesc}>{g.description}</p>

                <div className={styles.progress}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${g.progress}%` }}
                  />
                </div>

                {g.progress === 100 ? (
                  <div className={styles.deadline}>
                    Выполнено: {g.completedAt}
                  </div>
                ) : (
                  <div className={styles.deadline}>
                    ⏳ {deadlineText}
                  </div>
                )}
              </div>
            ))}

            <button
              className={styles.button}
              onClick={() => setStep('add')}
            >
              + Добавить цель
            </button>
          </div>
        )}

        {step === 'add' && (
          <div className={styles.center}>
            <h1 className={styles.title}>Новая цель</h1>

            <input
              className={styles.input}
              placeholder="Название цели"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />

            <textarea
              className={styles.input}
              placeholder="Опиши цель подробнее"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
            />

            <button className={styles.button} onClick={saveGoal}>
              Сохранить цель
            </button>
          </div>
        )}

        {step === 'goal' && activeGoal && (
          <div>
            <h1 className={styles.title}>{activeGoal.title}</h1>
            <p className={styles.subtitle}>{activeGoal.description}</p>

            <div className={styles.bigPercent}>
              {activeGoal.progress}%
            </div>

            <div className={styles.controls}>
              <button onClick={() => updateProgress(-10)}>-10</button>
              <button onClick={() => updateProgress(10)}>+10</button>
            </div>

            <div className={styles.deadline}>
              ⏳ {deadlineText}
            </div>

            <button
              className={styles.button}
              onClick={() => setStep('list')}
            >
              ← Назад
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
