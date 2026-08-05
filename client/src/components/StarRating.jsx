export default function StarRating({ rating = 0, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5" title={`${rating}/${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`text-sm transition-all duration-200 ${
            i < rating
              ? 'opacity-100 scale-100'
              : 'opacity-30 scale-90'
          }`}
          style={{
            color: i < rating ? 'var(--accent-yellow)' : 'var(--text-muted)',
            animationDelay: `${i * 50}ms`,
          }}
        >
          ★
        </span>
      ))}
      <span className="text-xs text-[var(--text-muted)] ml-1">
        {rating}/{max}
      </span>
    </div>
  );
}
