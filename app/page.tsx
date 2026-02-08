'use client'

import { useState } from 'react'
import styles from './auth.module.css'

type Step = 'phone' | 'code' | 'goals'

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
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('+7')
  const [code, setCode] = useState('')
  const [goals, setGoals] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [newGoal, setNewGoal] = useState('')

  const phoneValid = phone.replace(/\D/g, '').length === 11
  const codeValid = code.length === 4

  function submitCode() {
    if (!codeValid) return
    setStep('goals')
  }

  function addGoal() {
    if (!newGoal.trim()) return
    setGoals([...goals, newGoal.trim()])
    setNewGoal('')
    setShowModal(false)
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
        <div className={`${styles.step} ${step === 'code' ? styles.active : styles.hidden}`}>
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

        {/* GOALS */}
        <div className={`${styles.step} ${step === 'goals' ? styles.active : styles.hidden}`}>
          <h1 className={styles.title}>Мои цели на 2026</h1>
          <p className={styles.subtitle}>
            {goals.length === 0
              ? 'Пока тут пусто — давай начнём'
              : 'Твои цели на этот год'}
          </p>

          {goals.map((goal, index) => (
            <div key={index} className={styles.goalCard}>
              {goal}
            </div>
          ))}

          <button
            className={styles.button}
            onClick={() => setShowModal(true)}
          >
            + Добавить цель
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.title}>Новая цель</h2>

            <input
              className={styles.input}
              placeholder="Например: Купить дом"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
            />

            <button className={styles.button} onClick={addGoal}>
              Сохранить
            </button>

            <button
              className={styles.button}
              onClick={() => setShowModal(false)}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
