import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

function Modal({ children, open, onClose }) {
  const dialog = useRef();

  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);

  // Burada useEffecti sonsuz bir döngü (infinite loop) olduğu için değil herhangi bir prop valuesu ile senkronize etmek içindir.
  // Burada artık useEffect kullanmak için başka bir neden görüyoruz çünkü useEffect bize bazı prop valuelarına ya da state valuelarını DOM API larına yansıtmamızı sağlar. Burada örnek olarak showModal() ya da close() methodunu gösterebiliriz.
  // Aynı zamanda bu useEffect direkt olarak UI a etki edecktir aşağıdaki JSX koduna değil
  // Yukarıdaki useEffect kullanımında dependencies ", [])" değiştirmeliyiz. Çünkü App componentindeki useEffectte sadece bir kere execute yapıyorduk. Fakat burada her open veya close olduğunda değişmesini istiyoruz.

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {open ? children : null}
    </dialog>,
    document.getElementById("modal")
  );
}

export default Modal;
