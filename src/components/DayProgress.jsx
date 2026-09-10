import { WEEK_LENGTH } from '../garden/garden-logic.js';

export function DayProgress({ currentDay }) {
  const days = Array.from({ length: WEEK_LENGTH }, (_, index) => index + 1);

  return (
    <div className="day-progress" role="list" aria-label="Seven day ritual progress">
      {days.map((day) => {
        const completed = day <= currentDay;
        const isCurrent = day === currentDay + 1 && currentDay < WEEK_LENGTH;

        return (
          <span
            key={day}
            role="listitem"
            className={`day-mark${completed ? ' is-complete' : ''}${isCurrent ? ' is-current' : ''}`}
            aria-label={`Day ${day}${completed ? ', completed' : isCurrent ? ', current' : ''}`}
          />
        );
      })}
    </div>
  );
}
