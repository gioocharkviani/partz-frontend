import { Star } from 'lucide-react';

interface Props {
  rating: number;
  max?: number;
  size?: number;
  showNumber?: boolean;
}

export default function StarRating({ rating, max = 5, size = 14, showNumber = true }: Props) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(rating) ? 'text-teal fill-teal' : 'text-teal-border fill-teal-border'}
        />
      ))}
      {showNumber && (
        <span className="text-xs font-semibold text-muted ml-0.5">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}

