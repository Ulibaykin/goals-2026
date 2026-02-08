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
        {step === 'pho
