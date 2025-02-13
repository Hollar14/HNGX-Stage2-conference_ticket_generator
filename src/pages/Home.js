import { useState } from "react";
import TicketForm from "../components/TicketForm";
import Ticket from "../components/Ticket";

export default function Home() {
  const [ticketData, setTicketData] = useState(null);

  return (
    <div className="container">
      <h1>Conference Ticket Generator</h1>
      {!ticketData ? (
        <TicketForm onTicketGenerated={setTicketData} />
      ) : (
        <Ticket data={ticketData} />
      )}
    </div>
  );
}
