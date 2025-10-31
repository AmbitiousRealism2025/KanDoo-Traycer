import React, { useState } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Board from './components/Board/Board';
import CodeRain from './components/CodeRain/CodeRain';
import styles from './App.module.css';

function App() {
  const [headerComplete, setHeaderComplete] = useState(false);

  const handleHeaderComplete = () => {
    setHeaderComplete(true);
  };

  return (
    <div className={styles.app}>
      <CodeRain />
      <Header onComplete={handleHeaderComplete} />
      <main className={styles.main}>
        <Board />
      </main>
      <Footer startAnimation={headerComplete} />
    </div>
  );
}

export default App;
