'use client'

import { useEffect, useState } from 'react'
import styles from './auth.module.css'

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  let result = '+7'
  if (digits.length > 1) result += ' (' + digits.slice(1, 4)
  if (digits.length >= 4) result += ') ' + digits.slice(4, 7)
  if (digits.length >= 7) result += '-' + digits.slice(7, 9)
  if (digits.length >= 9) result += '-' + digits.slice(9, 11)

  return result
}

type Step = 'phone' | 'code' | 'goals' | 'add-goal'

type Goal = {
  id: number
  title: string
  description: string
}

export default function Page() {
  const [step, setStep] = useState<Step>('phone')

  const [phone, setPhone] = useState('+7')
  const [code, setCode] = useState('')
  const [timer, setTimer] = useState(60)
  const [shakeKey, setShakeKey] = useState(0)

  const [goals, setGoals] = useState<Goal[]>([])
  const [goalTitle, setGoalTitle] = useState('')
  const [goalDescription, setGoalDescription] = useState('')

  const phoneValid = phone.replace(/\D/g, '').length === 11
  const codeValid = code.length === 4

  useEffect(() => {
    if (step !== 'code') return

    setTimer(60)
    const i = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0))
    }, 1000)

    return () => clearInterval(i)
  }, [step])

  function submitCode() {
    if (!codeValid) {
      setShakeKey((k) => k + 1)
      return
    }

    setStep('goals')
  }

  function saveGoal() {
    const newGoal: Goal = {
      id: Date.now(),
      title: goalTitle.trim(),
      description: goalDescription.trim(),
    }

    setGoals((prev) => [newGoal, ...prev])

    setGoalTitle('')
    setGoalDescription('')
    setStep('goals')
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        {/* PHONE */}
        {step === 'phone' && (
          <div className={styles.step}>
            <h1 className={styles.title}>ТВОИ ЦЕЛИ НА ГОД</h1>
            <p className={styles.subtitle}>трекер целей на год</p>

            <input
              className={styles.input}
              type="tel"
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
          </div>
        )}

        {/* CODE */}
        {step === 'code' && (
          <div className={styles.step}>
            <h1 className={styles.title}>Код из SMS</h1>
            <p className={styles.subtitle}>Мы отправили код на {phone}</p>

            <input
              key={shakeKey}
              className={`${styles.input} ${styles.codeInput}`}
              inputMode="numeric"
              maxLength={4}
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, ''))
              }
            />

            <div className={styles.timer}>
              {timer > 0
                ? <>Отправить код повторно через <span>{timer} сек</span></>
                : <span>Отправить код ещё раз</span>
              }
            </div>

            <button className={styles.button} onClick={submitCode}>
              Подтвердить
            </button>
          </div>
        )}

        {/* GOALS LIST */}
        {step === 'goals' && (
          <div className={styles.step}>
            <h1 className={styles.title}>Мои цели на 2026</h1>

            {goals.length === 0 ? (
              <p className={styles.subtitle}>
                Пока тут пусто — давай начнём
              </p>
            ) : (
              goals.map((goal) => (
                <div key={goal.id} className={styles.goalCard}>
                  <div style={{ fontWeight: 600 }}>
                    {goal.title}
                  </div>
                  {goal.description && (
                    <div style={{ fontSize: 14, opacity: 0.8 }}>
                      {goal.description}
                    </div>
                  )}
                </div>
              ))
            )}

            <button
              className={styles.button}
              onClick={() => setStep('add-goal')}
            >
              + Добавить цель
            </button>
          </div>
        )}

        {/* ADD GOAL */}
        {step === 'add-goal' && (
          <div className={styles.step}>
            <h1 className={styles.title}>Новая цель</h1>

            <input
              className={styles.input}
              placeholder="Название цели"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
            />

            <textarea
              className={styles.input}
              style={{ height: 100, paddingTop: 12 }}
              placeholder="Более развернуто опиши свою цель"
              value={goalDescription}
              onChange={(e) => setGoalDescription(e.target.value)}
            />

            <button
              className={styles.button}
              disabled={!goalTitle.trim()}
              onClick={saveGoal}
            >
              Сохранить цель
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
