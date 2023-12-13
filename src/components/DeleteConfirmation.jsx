import { useEffect } from "react";
import ProgressBar from "./Progressbar";

// setTimeout'ta verdiğimiz time ın aynısını burada global bir değer olarak yazıyoruz.
const TIMER = 3000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onConfirm();
    }, TIMER);

    return () => {
      clearTimeout(timer);
    };
  }, [onConfirm]);
  // Bu useEffect kullanımında kısace önce Componentimizin execute olmasını ve her execute olduğunda aynı zamanda open olduğunda functionımızın da execute olmasını istiyoruz

  // Bu useEffectin kullanım amacı infinite loop(sonsuz döngü) değildir. Burada useEffect kullanmamızın amacı bu DeleteConfirmation componenti ekrandan çıktığı anda setTimeout function ı çalıştırmak
  // Kısaca useEffect burada bir temizlik işlemi yapıyoru
  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <ProgressBar timer={TIMER} />
    </div>
  );
}
