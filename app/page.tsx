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

type Step = 'phone' | 'code' | 'goals'

export default function Page() {
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('+7')
  const [code, setCode] = useState('')
  const [timer, setTimer] = useState(60)
  const [pulse, setPulse] = useState(false)
  const [shake, setShake] = useState(false)

  const phoneValid = phone.replace(/\D/g, '').length === 11
  const codeValid = code.length === 4

  useEffect(() => {
    if (step !== 'code') return
    setTimer(60)

    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [step])

  useEffect(() => {
    if (code.length === 0) return
    setPulse(true)
    const t = setTimeout(() => setPulse(false), 250)
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
        <div className={`${styles.step} ${step === 'phone' ? styles.active : styles.hidden}`}>
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

        {/* CODE */}
        <div
          className={`${styles.step} ${
            step === 'code' ? styles.active : styles.hidden
          } ${shake ? styles.shake : ''}`}
        >
          <h1 className={styles.title}>Код из SMS</h1>
          <p className={styles.subtitle}>Мы отправили код на {phone}</p>

          <input
            className={`${styles.input} ${styles.codeInput} ${pulse ? styles.pulse : ''}`}
            inputMode="numeric"
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
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

        {/* GOALS */}
        <div className={`${styles.step} ${step === 'goals' ? styles.active : styles.hidden}`}>
          <h1 className={styles.title}>Мои цели на 2026</h1>
          <p className={styles.subtitle}>Пока тут пусто — давай начнём</p>

          <button className={styles.button}>
            + Добавить первую цель
          </button>
        </div>

      </div>
    </div>
  )
}
