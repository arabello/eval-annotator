interface NotesProps {
  value: string;
  onChange: (notes: string) => void;
  disabled: boolean;
}

export function Notes({ value, onChange, disabled }: NotesProps) {
  return (
    <div className="bg-white border rounded-lg p-4 flex-1 flex flex-col">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Notes</h4>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Add optional notes here..."
        className="flex-1 w-full px-3 py-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
      />
    </div>
  );
}
