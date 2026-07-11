import type { CellStatus } from "../types/crossword";

interface CellProps {
  isBlocked: boolean;
  number: number | null;
  value: string;
  status: CellStatus;
  onChange: (letter: string) => void;
}

export function Cell({ isBlocked, number, value, status, onChange }: CellProps) {
  if (isBlocked) {
    return <div className="cell cell-blocked" />;
  }

  const statusClass =
    status === "correct" ? "cell-correct" : status === "incorrect" ? "cell-incorrect" : "";
  
  const isLocked = status === "correct";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const letter = e.target.value.slice(-1);
    onChange(letter);
  }

  return (
    <div className={`cell ${statusClass}`}>
      {number !== null && <span className="cell-number">{number}</span>}
      <input
        className="cell-input"
        maxLength={1}
        value={value}
        onChange={handleChange}
        readOnly={isLocked}
      />
    </div>
  );
}