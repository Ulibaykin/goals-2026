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

export default function Page() {
  const [step, setStep] = useState<Step>('phone')

  const [phone, setPhone] = useState('+7')
  const [code, setCode] = useState('')
  const [timer, setTimer] = useState(60)

  const [pulse, setPulse] = useState(false)
  const [shake, setShake] = useState(false)

  const [goal, setGoal] = useState('')

  const phoneValid = phone.replace(/\D/g, '').length === 11
  const codeValid = code.length === 4

  // Таймер для SMS
  useEffect(() => {
    if (step !== 'code') return

    setTimer(60)
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [step])

  // Pulse при вводе кода
  useEffect(() => {
    if (!code) return
    setPulse(true)
    const t = setTimeout(() => setPulse(false), 200)
    return () => clearTimeout(t)
  }, [code])

  function submitCode() {
    if (!codeValid) {
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }

    setStep('goals')
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        {/* PHONE */}
        {step === 'phone' && (
          <div className={`${styles.step} ${styles.active}`}>
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
          <div
            className={`${styles.step} ${styles.active} ${
              shake ? styles.shake : ''
            }`}
          >
            <h1 className={styles.title}>Код из SMS</h1>
            <p className={styles.subtitle}>Мы отправили код на {phone}</p>

            <input
              className={`${styles.input} ${styles.codeInput} ${
                pulse ? styles.pulse : ''
              }`}
              inputMode="numeric"
              maxLength={4}
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, ''))
              }
            />

            <div className={styles.timer}>
              {timer > 0 ? (
                <>
                  Отправить код повторно через <span>{timer} сек</span>
                </>
              ) : (
                <span>Отправить код ещё раз</span>
              )}
            </div>

            <button className={styles.button} onClick={submitCode}>
              Подтвердить
            </button>
          </div>
        )}

        {/* GOALS */}
        {step === 'goals' && (
          <div className={`${styles.step} ${styles.active}`}>
            <h1 className={styles.title}>Мои цели на 2026</h1>
            <p className={styles.subtitle}>
              Пока тут пусто — давай начнём
            </p>

            <button
              className={styles.button}
              onClick={() => setStep('add-goal')}
            >
              + Добавить первую цель
            </button>
          </div>
        )}

        {/* ADD GOAL */}
        {step === 'add-goal' && (
          <div className={`${styles.step} ${styles.active}`}>
            <h1 className={styles.title}>Новая цель</h1>
            <p className={styles.subtitle}>
              Сформулируй цель коротко и понятно
            </p>

            <input
              className={styles.input}
              placeholder="Например: Запустить свой проект"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />

            <button
              className={styles.button}
              disabled={goal.trim().length < 3}
              onClick={() => {
                alert(`Цель добавлена: ${goal}`)
                setGoal('')
                setStep('goals')
              }}
            >
              Сохранить цель
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
