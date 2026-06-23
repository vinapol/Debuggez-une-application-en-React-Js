import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";
import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const changeType = (evtType) => {
    console.log("Valeur reçue par le Select :", evtType);
    setCurrentPage(1);
    setType(evtType === "" ? null : evtType);
  };

  const eventsByType = !type
    ? data?.events
    : data?.events.filter((event) => {
      const eventTypeClean = event.type.toString().toLowerCase().trim();
      const selectedTypeClean = type.toString().toLowerCase().trim();
      return eventTypeClean === selectedTypeClean;
    });
  const pageNumber = Math.ceil((eventsByType?.length || 0) / PER_PAGE);
  const filteredEvents = (eventsByType || []).slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );
  const typeList = data?.events
    ? Array.from(new Set(data.events.map((event) => event.type)))
    : [];
  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={typeList}
            onChange={(value) => changeType(value)}
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => {
              const pageIndex = n + 1;
              return (
                <a
                  key={`page-${pageIndex}`}
                  href="#events"
                  onClick={(event) => {
                    event.preventDefault();
                    setCurrentPage(pageIndex);
                  }}
                  className = { currentPage === pageIndex ? "active" : ""}
                >
            {pageIndex}
          </a>
          );
            })}
        </div>
    </>
  )
}
    </>
  );

};

export default EventList;
