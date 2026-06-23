import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  const byDateDesc = data?.focus
    ? [...data.focus].sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];

  useEffect(() => {
    let timer;

    if (byDateDesc && byDateDesc.length > 0) {
      timer = setTimeout(() => {
        setIndex((prev) => (prev + 1) % byDateDesc.length);
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [index, byDateDesc]);

  if (!data?.focus) return null;
  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <div
          key={event.title || idx}
          className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}
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
          {byDateDesc.map((_, radioIdx) => (
            <input
              key={`radio-${byDateDesc[radioIdx].title}`}
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              onChange={() => setIndex(radioIdx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
