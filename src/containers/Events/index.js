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
  
  // Récupérer et trier les événements par mois (de janvier à décembre)
  const events = data?.events 
    ? [...data.events].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getMonth() - dateB.getMonth();
      }) 
    : [];
  
  // Filtrer par type
  let filteredByType = events;
  if (type) {
    filteredByType = events.filter(event => event.type === type);
  }
  
  // Appliquer la pagination
  const startIndex = (currentPage - 1) * PER_PAGE;
  const endIndex = startIndex + PER_PAGE;
  const filteredEvents = filteredByType.slice(startIndex, Math.min(endIndex, filteredByType.length));
  
  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };
  
  const pageNumber = Math.ceil(filteredByType.length / PER_PAGE);
  const typeList = new Set(events.map(event => event.type));
  
  // Fonction pour formater correctement les dates
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date;
  };
  
  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={formatEventDate(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;