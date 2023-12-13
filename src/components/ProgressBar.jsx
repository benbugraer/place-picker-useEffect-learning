import { useState, useEffect } from "react";

export default function ProgressBar({ timer }) {
  const [remainingTime, setRemainingTime] = useState(timer);
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 10);
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Yukarıdaki useEffect kullanımında dependencies ", [])" değiştirmedik çünkü buradaki useEffect kullanımı bir infinite loop oluşumunu engellemek üzere kullanıldı.

  return <progress value={remainingTime} max={timer} />;
}
