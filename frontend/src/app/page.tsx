'use client';
// pages/index.js
import styles from './page.module.css';
import MallCanvas from './_components/mall';

export default function Home() {
  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <h1 className={styles.title}>Mall 3D</h1>
        <p className={styles.description}>
          A 3D mall simulation built with React Three Fiber
        </p>
      </header>
      <MallCanvas />
    </div>
  );
}
