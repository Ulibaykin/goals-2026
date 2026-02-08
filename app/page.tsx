'use client'

import { useState } from 'react'
import styles from './auth.module.css'

export default function Page() {
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [phone, setPhone] = useState('+7')
  const [code, setCode] = useState('')

  const phoneValid = phone.length >= 12
  const codeValid = code.length === 4

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {step === 'phone' && (
          <>
            <div className={styles.title}>ТВОИ ЦЕЛИ НА ГОД</div>
            <div className={styles.subtitle}>трекер целей на год</div>

            <input
              className={styles.input}
              type="tel"
              value={phone}
              onChange={(e) => {
                if (!e.target.value.startsWith('+7')) {
                  setPhone('+7')
                } else {
                  setPhone(e.target.value)
                }
              }}
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

        {step === 'code' && (
          <>
            <div className={styles.title}>Код из SMS</div>
            <div className={styles.subtitle}>
              Мы отправили код на {phone}
            </div>

            <input
              className={styles.input}
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, ''))
              }
            />

            <button
              className={styles.button}
              disabled={!codeValid}
              onClick={() => alert('Авторизация дальше')}
            >
              Подтвердить
            </button>
          </>
        )}
      </div>
    </div>
  )
}
