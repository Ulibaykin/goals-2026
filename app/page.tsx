'use client'

import { useEffect, useState } from 'react'
import styles from './auth.module.css'

type Step = 'phone' | 'code' | 'goals' | 'new-goal'

type Goal = {
  id: number
  title: string
  description: string
  progress: number
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  let result = '+7'
  if (digits.length > 1) result += ' (' + digits.slice(1, 4)
  if (digits.length >= 4) result += ') ' + digits.slice(4, 7)
  if (digits.length >= 7) result += '-' + digits.slice(7, 9)
  if (digits.length >= 9) result += '-' + digits.slice(9, 11)
  return result
}

function getPercentColor(percent: number) {
  const start = { r: 120, g: 83, b: 0 }     // тёмно-жёлтый
  const end = { r: 250, g: 204, b: 21 }    // золотой
  const p = Math.min(Math.max(percent / 100, 0), 1)
  const r = Math.round(start.r + (end.r - start.r) * p)
  const g = Math.round(start.g + (end.g - start.g) * p)
  const b = Math.round(start.b + (end.b - start.b) * p)
  return `rgb(${r}, ${g}, ${b})`
}

export default function Page() {
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('+7')
  const [code, setCode] = useState('')
  const [shake, setShake] = useState(false)

  const [goals, setGoals] = useState<Goal[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const phoneValid = phone.replace(/\D/g, '').length === 11
  const codeValid = code.length === 4

  function submitCode() {
    if (!codeValid) {
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }
    setStep('goals')
  }

  function addGoal() {
    if (!title.trim()) return
    setGoals([
      ...goals,
      {
        id: Date.now(),
        title,
        description,
        progress: 0,
      },
    ])
    setTitle('')
    setDescription('')
    setStep('goals')
  }

  function updateProgress(id: number, delta: number) {
    setGoals(goals.map(g =>
      g.id === id
        ? { ...g, progress: Math.min(100, Math.max(0, g.progress + delta)) }
        : g
    ))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        {/* PHONE */}
        {step === 'phone' && (
          <>
            <h1 className={styles.title}>ТВОИ ЦЕЛИ НА ГОД</h1>
            <p className={styles.subtitle}>трекер целей на год</p>

            <input
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
            />

            <button
              className={styles.button}
              disabled={!phoneValid}
              onClick={() => setStep('code')}
            >
              Войти
            </button>
          </>
        )}

        {/* CODE */}
        {step === 'code' && (
          <div className={shake ? styles.shake : ''}>
            <h1 className={styles.title}>Код из SMS</h1>
            <p className={styles.subtitle}>Мы отправили код на {phone}</p>

            <input
              className={styles.input}
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />

            <button className={styles.button} onClick={submitCode}>
              Подтвердить
            </button>
          </div>
        )}

        {/* GOALS */}
        {step === 'goals' && (
          <>
            <h1 className={styles.title}>Мои цели на 2026</h1>

            {goals.map(goal => (
              <div key={goal.id} className={styles.goalCard}>
                <div className={styles.goalHeader}>
                  <strong>{goal.title}</strong>
                  <span
                    className={styles.percent}
                    style={{ color: getPercentColor(goal.progress) }}
                  >
                    {goal.progress}%
                  </span>
                </div>

                <p className={styles.goalDesc}>{goal.description}</p>

                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>

                <div className={styles.actions}>
                  <button onClick={() => updateProgress(goal.id, -10)}>-10</button>
                  <button onClick={() => updateProgress(goal.id, 10)}>+10</button>
                </div>
              </div>
            ))}

            <button className={styles.button} onClick={() => setStep('new-goal')}>
              + Добавить цель
            </button>
          </>
        )}

        {/* NEW GOAL */}
        {step === 'new-goal' && (
          <>
            <h1 className={styles.title}>Новая цель</h1>

            <input
              className={styles.input}
              placeholder="Название цели"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className={styles.textarea}
              placeholder="Описание цели"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button className={styles.button} onClick={addGoal}>
              Сохранить
            </button>
          </>
        )}

      </div>
    </div>
  )
}
