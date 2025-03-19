import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  
  // Tri du plus ancien au plus récent
  const byDateAsc = data?.focus
    ? [...data.focus].sort((evtA, evtB) =>
        new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
      )
    : [];

  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (byDateAsc.length === 0) return;
        setIndex(index < byDateAsc.length - 1 ? index + 1 : 0);
      },
      5000
    );
    return () => clearTimeout(timer);
  }, [index, byDateAsc]);

  if (!byDateAsc || byDateAsc.length === 0) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="SlideCardList">
      {byDateAsc.map((event, idx) => (
        <div
          key={event.id || event.title || `event-${idx}`}
          className={`SlideCard SlideCard--${
            index === idx ? "display" : "hide"
          }`}
        >
          <img src={event.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateAsc.map((event) => (
            <input
              key={`radio-${event.id || event.title}`}
              type="radio"
              name="radio-button"
              checked={index === byDateAsc.indexOf(event)}
              readOnly
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;