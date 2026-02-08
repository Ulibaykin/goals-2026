'use client'

import { useState } from 'react'
import styles from './auth.module.css'

type Screen = 'phone' | 'code' | 'list' | 'new' | 'card'

type Goal = {
  id: number
  title: string
  description: string
  progress: number
  doneAt?: string
}

export default function Page() {
  const [screen, setScreen] = useState<Screen>('phone')
  const [goals, setGoals] = useState<Goal[]>([])
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null)

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  function addGoal() {
    if (!title.trim()) return
    setGoals([
      ...goals,
      { id: Date.now(), title, description: desc, progress: 0 },
    ])
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
    setGoals(goals.map(g => (g.id === updated.id ? updated : g)))
    setActiveGoal(updated)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        {screen === 'phone' && (
          <div className={styles.column}>
            <h1 className={styles.title}>ТВОИ ЦЕЛИ НА ГОД</h1>
            <input className={styles.input} placeholder="+7 (___) ___-__-__" />
            <button className={styles.button} onClick={() => setScreen('code')}>
              Войти
            </button>
          </div>
        )}

        {screen === 'code' && (
          <div className={styles.column}>
            <h1 className={styles.title}>Код из SMS</h1>
            <input className={styles.input} placeholder="••••" />
            <button className={styles.button} onClick={() => setScreen('list')}>
              Подтвердить
            </button>
          </div>
        )}

        {screen === 'list' && (
          <div className={styles.list}>
            <h2 className={styles.title}>Мои цели на 2026</h2>

            {goals.length === 0 && (
              <p className={styles.empty}>У тебя пока нет целей на 2026 год</p>
            )}

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
                  <span
                    className={styles.goalPercent}
                    style={{ '--p': g.progress } as any}
                  >
                    {g.progress}%
                  </span>
                </div>

                <div className={styles.progress}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${g.progress}%` }}
                  />
                </div>

                {g.doneAt ? (
                  <div className={styles.done}>Выполнено: {g.doneAt}</div>
                ) : (
                  <div className={styles.timer}>
                    ⏳ Осталось: 326 д 8 ч 38 мин
                  </div>
                )}
              </div>
            ))}

            <button
              className={styles.button}
              onClick={() => setScreen('new')}
            >
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
            <p className={styles.text}>{activeGoal.description}</p>

            <div
              className={styles.bigPercent}
              style={{ '--p': activeGoal.progress } as any}
            >
              {activeGoal.progress}%
            </div>

            <div className={styles.controls}>
              <button onClick={() => updateProgress(-10)}>-10</button>
              <button onClick={() => updateProgress(10)}>+10</button>
            </div>

            <div className={styles.timer}>
              ⏳ Осталось: 326 д 8 ч 38 мин
            </div>

            <button
              className={styles.button}
              onClick={() => setScreen('list')}
            >
              ← Назад
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
