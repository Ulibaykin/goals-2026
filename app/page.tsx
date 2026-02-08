'use client'

import { useState } from 'react'
import styles from './auth.module.css'

type Step = 'phone' | 'code' | 'goals' | 'add' | 'view'

type Goal = {
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
  const diff = DEADLINE.getTime() - Date.now()
  if (diff <= 0) return 'Срок истёк'

  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)

  return `Осталось: ${d} д ${h} ч ${m} мин`
}

export default function Page() {
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('+7')
  const [code, setCode] = useState('')
  const [shake, setShake] = useState(false)

  const [goals, setGoals] = useState<Goal[]>([])
  const [current, setCurrent] = useState<Goal | null>(null)

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

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
    setGoals([
      ...goals,
      { id: Date.now(), title, description: desc, progress: 0 }
    ])
    setTitle('')
    setDesc('')
    setStep('goals')
  }

  function updateProgress(delta: number) {
    if (!current) return

    let next = Math.min(100, Math.max(0, current.progress + delta))
    let completedAt = current.completedAt

    if (next === 100 && !completedAt) {
      completedAt = new Date().toLocaleDateString('ru-RU')
    }

    const updated = { ...current, progress: next, completedAt }

    setGoals((g) =>
      [...g.filter((x) => x.id !== updated.id), updated].sort(
        (a, b) => (a.progress === 100 ? 1 : -1)
      )
    )

    setCurrent(updated)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        {/* PHONE */}
        {step === 'phone' && (
          <div className={styles.center}>
            <h1 className={styles.title}>ТВОИ ЦЕЛИ НА ГОД</h1>
            <p className={styles.subtitle}>трекер целей на год</p>
            <input className={styles.input} value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} />
            <button className={styles.button} disabled={!phoneValid} onClick={() => setStep('code')}>Войти</button>
          </div>
        )}

        {/* CODE */}
        {step === 'code' && (
          <div className={`${styles.center} ${shake ? styles.shake : ''}`}>
            <h1 className={styles.title}>Код из SMS</h1>
            <input className={styles.input} value={code} maxLength={4} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} />
            <button className={styles.button} onClick={submitCode}>Подтвердить</button>
          </div>
        )}

        {/* GOALS */}
        {step === 'goals' && (
          <>
            <h1 className={styles.title}>Мои цели на 2026</h1>

            {goals.length === 0 && (
              <p className={styles.subtitle}>У тебя пока нет целей на 2026 год</p>
            )}

            {goals.map((g) => (
              <div key={g.id} className={styles.goalCard} onClick={() => { setCurrent(g); setStep('view') }}>
                <div className={styles.goalHeader}>
                  <strong>{g.title}</strong>
                  {g.progress === 100 ? '🏆' : <span className={styles.percent}>{g.progress}%</span>}
                </div>

                <p className={styles.goalDesc}>{g.description}</p>

                <div className={styles.progress}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${g.progress}%`,
                      background: g.progress === 100
                        ? '#00ff6a'
                        : 'linear-gradient(90deg,#1e90ff,#00ff6a)'
                    }}
                  />
                </div>

                {g.progress === 100 ? (
                  <div className={styles.deadline}>Выполнено: {g.completedAt}</div>
                ) : (
                  <div className={styles.deadline}>⏳ {timeLeft()}</div>
                )}
              </div>
            ))}

            <button className={styles.button} onClick={() => setStep('add')}>
              + Добавить цель
            </button>
          </>
        )}

        {/* ADD */}
        {step === 'add' && (
          <div className={styles.center}>
            <h1 className={styles.title}>Новая цель</h1>
            <input className={styles.input} placeholder="Название цели" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className={styles.input} placeholder="Описание цели" value={desc} onChange={(e) => setDesc(e.target.value)} />
            <button className={styles.button} onClick={addGoal}>Сохранить</button>
          </div>
        )}

        {/* VIEW */}
        {step === 'view' && current && (
          <>
            <h1 className={styles.title}>{current.title}</h1>
            <p className={styles.subtitle}>{current.description}</p>

            {current.progress === 100 ? (
              <>
                <div className={styles.bigPercent}>🏆</div>
                <div className={styles.deadline}>Выполнено: {current.completedAt}</div>
              </>
            ) : (
              <>
                <div className={styles.bigPercent}>{current.progress}%</div>
                <div className={styles.controls}>
                  <button onClick={() => updateProgress(-10)}>-10</button>
                  <button onClick={() => updateProgress(10)}>+10</button>
                </div>
                <div className={styles.deadline}>⏳ {timeLeft()}</div>
              </>
            )}

            <button className={styles.button} onClick={() => setStep('goals')}>
              ← Назад
            </button>
          </>
        )}

      </div>
    </div>
  )
}
