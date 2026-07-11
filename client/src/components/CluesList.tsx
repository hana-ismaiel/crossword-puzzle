import type { UserWordSlot } from "../types/crossword";

interface CluesListProps {
  slots: UserWordSlot[];
  completedSlots: Set<string>;
  onClueClick: (slot: UserWordSlot) => void;
}

export function CluesList({ slots, completedSlots, onClueClick }: CluesListProps) {
  const acrossSlots = slots
    .filter((s) => s.direction === "across")
    .sort((a, b) => a.number - b.number);

  const downSlots = slots
    .filter((s) => s.direction === "down")
    .sort((a, b) => a.number - b.number);

  return (
    <div className="clues-list">
      <div className="clues-column">
        <h3>Across</h3>
        <ul>
          {acrossSlots.map((slot) => {
            const isComplete = completedSlots.has(`${slot.number}-across`);
            return (
              <li
                key={slot.number}
                className={isComplete ? "clue-complete" : ""}
                onClick={() => onClueClick(slot)}
              >
                <strong>{slot.number}.</strong> {slot.clue}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="clues-column">
        <h3>Down</h3>
        <ul>
          {downSlots.map((slot) => {
            const isComplete = completedSlots.has(`${slot.number}-down`);
            return (
              <li
                key={slot.number}
                className={isComplete ? "clue-complete" : ""}
              >
                <strong>{slot.number}.</strong> {slot.clue}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}