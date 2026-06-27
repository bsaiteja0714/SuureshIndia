import "./TeamCard.css";

function TeamCard({ name, qualification, expertise, photo }) {
  const initials = name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="team-card">
      {photo ? (
        <img className="team-card__photo" src={photo} alt={name} />
      ) : (
        <div className="team-card__avatar">{initials}</div>
      )}
      <h2 className="team-card__name">{name}</h2>
      <div className="team-card__fields">
        <div>
          <span className="team-card__label">Qualification</span>
          <p className="team-card__value">{qualification}</p>
        </div>
        <div>
          <span className="team-card__label">Expertise</span>
          <p className="team-card__value">{expertise}</p>
        </div>
      </div>
    </div>
  );
}

export default TeamCard;
