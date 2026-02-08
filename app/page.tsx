"use client";

import { useState } from "react";
import styles from "./auth.module.css";

export default function Home() {
  const [phone, setPhone] = useState("+7");

  const isValid = phone.length >= 12;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>ТВОИ ЦЕЛИ НА ГОД</h1>
        <p className={styles.subtitle}>трекер целей на год</p>

        <input
          className={styles.input}
          value={phone}
          onChange={(e) => {
            if (!e.target.value.startsWith("+7")) return;
            setPhone(e.target.value);
          }}
          placeholder="+7 ___ ___-__-__"
        />

        <button
          className={`${styles.button} ${
            isValid ? styles.buttonActive : ""
          }`}
          disabled={!isValid}
        >
          Войти
        </button>
      </div>
    </div>
  );
}
