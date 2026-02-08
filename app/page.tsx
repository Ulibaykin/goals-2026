'use client'

import { useEffect, useState } from 'react'
import styles from './auth.module.css'

type Screen = 'phone' | 'code' | 'list' | 'new' | 'card'

type Goal = {
  id: number
  title: string
  description: string
  progress: number
  doneAt?: string
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  let res = '+7 '
  if (digits.length > 0) res += `(${digits.slice(0, 3)}`
  if (digits.length >= 4) res += `)${digits.slice(3, 6)}`
  if (digits.length >= 7) res += `-${digits.slice(6, 8)}`
  if (digits.length >= 9) res += `-${digits.slice(8, 10)}`
  return res
}

export default function Page() {
  const [screen, setScreen] = useState<Screen>('phone')
  const [phone, setPhone] = useState('+7 ')
  const [code, setCode] = useState('')
  const [shake, setShake] = useState(false)

  const [goals, setGoals] = useState<Goal[]>([])
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null)

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  function addGoal() {
    if (!title.trim()) return
    setGoals([...goals, {
      id: Date.now(),
      title,
      description: desc,
      progress: 0,
    }])
    setTitle('')
    setDesc('')
    setScreen('list')
  }

  function updateProgress(delta: number) {
    if (!activeGoal) return
    const next = Math.min(100, Math.max(0, activeGoal.progress + delta))
    const updated = {
      ...activeGoal,
      progress: next,
      doneAt: next === 100 ? new Date().toLocaleDateString() : undefined,
    }
    setGoals(goals.map(g => g.id === updated.id ? updated : g))
    setActiveGoal(updated)
  }

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.card} ${shake ? styles.shake : ''}`}>

        {screen === 'phone' && (
          <div className={styles.column}>
            <h1 className={styles.title}>ТВОИ ЦЕЛИ НА ГОД</h1>

            <input
              className={styles.input}
              value={phone}
              onChange={e => setPhone(formatPhone(e.target.value))}
              inputMode="numeric"
            />

            <button
              className={styles.button}
              onClick={() => phone.length < 16 ? triggerShake() : setScreen('code')}
            >
              Войти
            </button>
          </div>
        )}

        {screen === 'code' && (
          <div className={styles.column}>
            <h2 className={styles.title}>Код из SMS</h2>

            <input
              className={styles.input}
              value={code}
              maxLength={4}
              inputMode="numeric"
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            />

            <button
              className={styles.button}
              onClick={() => code.length < 4 ? triggerShake() : setScreen('list')}
            >
              Подтвердить
            </button>
          </div>
        )}

        {screen === 'list' && (
          <div className={styles.list}>
            <h2 className={styles.title}>Мои цели на 2026</h2>

            {goals.map(g => (
              <div
                key={g.id}
                className={styles.goal}
                onClick={() => {
                  setActiveGoal(g)
                  setScreen('card')
                }}
              >
                <div className={styles.goalHeader}>
                  <span className={styles.goalTitle}>{g.title}</span>
                  {g.progress === 100
                    ? <span className={styles.trophy}>🏆</span>
                    : <span className={styles.goalPercent} style={{ '--p': g.progress } as any}>{g.progress}%</span>}
                </div>

                <p className={styles.goalDesc}>{g.description}</p>

                <div className={styles.progress}>
                  <div className={styles.progressFill} style={{ width: `${g.progress}%` }} />
                </div>

                {g.doneAt
                  ? <div className={styles.done}>Выполнено: {g.doneAt}</div>
                  : <div className={styles.timer}>⏳ Осталось: 326 д 8 ч</div>}
              </div>
            ))}

            <button className={styles.button} onClick={() => setScreen('new')}>
              + Добавить цель
            </button>
          </div>
        )}

        {screen === 'new' && (
          <div className={styles.column}>
            <h2 className={styles.title}>Новая цель</h2>

            <input
              className={styles.input}
              placeholder="Название цели"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <textarea
              className={styles.textarea}
              placeholder="Описание цели"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />

            <button className={styles.button} onClick={addGoal}>
              Сохранить
            </button>
          </div>
        )}

        {screen === 'card' && activeGoal && (
          <div className={styles.column}>
            <h2 className={styles.title}>{activeGoal.title}</h2>
            <p className={styles.cardText}>{activeGoal.description}</p>

            <div className={styles.bigPercent} style={{ '--p': activeGoal.progress } as any}>
              {activeGoal.progress}%
            </div>

            <div className={styles.controls}>
              <button onClick={() => updateProgress(-10)}>-10</button>
              <button onClick={() => updateProgress(10)}>+10</button>
            </div>

            <div className={styles.timer}>⏳ Осталось: 326 д 8 ч</div>

            <button className={styles.button} onClick={() => setScreen('list')}>
              ← Назад
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
