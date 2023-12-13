import { useEffect, useRef, useState, useCallback } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

const storeIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const storedPlaces = storeIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

// Yukarıdaki kodda useEffect kullanılarak sonuç elde edilebilir fakat gereksiz bir useEffect kullanımı olur. Çünkü yukarıdaki kodda bağımlılık listesi boş durumdadır "[]" bu nedenle kod sadece bir kere çalıştırılır.
// Ayrıca bu function u App componentinin dışarısında yazmamız daha efektif olacaktır çünkü bu function ı biz sadece bir kere execute edeceğiz. Bu function App componentinin içerisinde bulunursa eğer her App component execute olduğunda bu function da tekrar ve tekrar execute olacaktır ve biz bunun olmasını istemiyoruz.

function App() {
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );

      setAvailablePlaces(sortedPlaces);
    });
  }, []);
  /*Yukarıdaki empty array([]) sayesinde yukarıdaki function sadece bir kere yüklecektir bu empty array olmasaydı her App component yüklendiğinde yukarıdaki function tekrar tekrar yüklenecekti.*/

  // Yukarıdaki navigator.geolocaiton function ı eğer useEffect içerisinde yazılmasaydı bir sonsuz döngüye girmiş olacaktı ve bu da yaptığımız projenin çökmesine neden olacaktı.
  // Aynı zamanda useEffect sayesinde önce App componentimiz yüklenecek ve ardından React otomatik olarak useEffecti yükleyecektir

  // Temel olarak useEffect sadece sürekli döngüye girilmesi istenmeyen veya componentten sonra execute olmasını istediğimiz functionlarda kullanılır.

  // Ayrıca buradan çıkartacağımız en önemli ders her side effectin useEffecte ihtiyaç duymadığı. Bu yüzden useEffect'i nerede kullanacağımızı iyi bilmemiz lazım.

  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    const storeIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (storeIds.indexOf(id) === -1) {
      localStorage.setItem("selectedPlaces", JSON.stringify([id, ...storeIds]));
    }
  }

  // Yukarıdaki functionda useEffect kullanamayız bunun ana temel nedeni react hookları seperate functionlar veya if statemıntları içerisinde kullanılamaz
  // Yuukarıdaki function aynı zamanda bir side effect örneğidir useEffect kullanılmamasının bir diğer nedeni ise sürekli yüklenen(execute) olan bir function değildir sadece kullanıcı tıklamasında execute olur.

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalIsOpen(false);

    const storeIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storeIds.filter((id) => id !== selectedPlace.current))
    );
  }, []);

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
