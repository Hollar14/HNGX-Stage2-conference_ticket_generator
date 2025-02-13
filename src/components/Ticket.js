export default function Ticket({ data }) {
  return (
    <div className="ticket">
      <h2>🎟 Conference Ticket</h2>
      <p>
        <strong>Name:</strong> {data.fullName}
      </p>
      <p>
        <strong>Email:</strong> {data.email}
      </p>
      {data.avatar && <img src={data.avatar} alt="Avatar" width={100} />}
    </div>
  );
}
