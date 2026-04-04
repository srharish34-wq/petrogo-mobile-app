export default function RatingCard({ rating = 0 }) {
  return (
    <div className="card">
      <h3>Rating</h3>
      <div className="text-4xl font-bold">{rating.toFixed(1)}</div>
    </div>
  );
}