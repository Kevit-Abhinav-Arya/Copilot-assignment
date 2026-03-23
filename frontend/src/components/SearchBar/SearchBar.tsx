import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <label className="search-bar__label" htmlFor="search-input">Search</label>
      <input
        id="search-input"
        className="search-bar__input"
        type="text"
        placeholder="Search tasks…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search tasks by title"
      />
    </div>
  );
}
