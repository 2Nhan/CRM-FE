interface Props {
  note: string;
  onChange?: (note: string) => void;
  editable?: boolean;
}

const LeadNote = ({ note, onChange, editable = false }: Props) => {
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-2 w-2 rounded-full bg-blue-500" />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          Lead Note
        </span>
      </div>

      {editable ? (
        <textarea
          value={note}
          onChange={handleNoteChange}
          placeholder="Add a note for this lead..."
          className="w-full text-[13px] leading-relaxed text-gray-700 border-none outline-none resize-none min-h-[60px] bg-transparent"
          rows={3}
        />
      ) : (
        <p className="text-[13px] leading-relaxed text-gray-700">
          {note || "No note added yet."}
        </p>
      )}
    </div>
  );
};

export default LeadNote;
