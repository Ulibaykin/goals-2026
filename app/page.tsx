'use client'

import { useState } from 'react'
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

export default function Page() {
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [phone, setPhone] = useState('+7')
  const [code, setCode] = useState('')

  const phoneValid = phone.replace(/\D/g, '').length === 11
  const codeValid = code.length === 4

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
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

        <div className={`${styles.step} ${step === 'code' ? styles.active : styles.hidden}`}>
          <h1 className={styles.title}>Код из SMS</h1>
          <p className={styles.subtitle}>Мы отправили код на {phone}</p>

          <input
            className={styles.input}
            inputMode="numeric"
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          />

          <button
            className={styles.button}
            disabled={!codeValid}
            onClick={() => alert('Дальше — Supabase Auth')}
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  )
}
