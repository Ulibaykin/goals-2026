'use client'

import { useState } from 'react'
import styles from './auth.module.css'

export default function Page() {
  const [phone, setPhone] = useState('+7')

  const isValid = phone.length >= 12

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
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

        <button className={styles.button} disabled={!isValid}>
          Войти
        </button>
      </div>
    </div>
  )
}
