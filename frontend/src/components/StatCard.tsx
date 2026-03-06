interface StatCardProps {
  label: string;
  value: number;
  note: string;
  tone: string;
}

const StatCard = ({ label, value, note, tone }: StatCardProps): JSX.Element => (
  <div className={`stat-card stat-card-${tone}`}>
    <span className="stat-label">{label}</span>
    <strong className="stat-value">{value}</strong>
    <small className="stat-note">{note}</small>
  </div>
);

export default StatCard;
