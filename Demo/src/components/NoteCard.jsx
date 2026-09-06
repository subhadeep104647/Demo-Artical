import {
  MoreVertical,
  Edit3,
  Download,
  Trash2,
  FileText
} from "lucide-react";

function NoteCard({ note }) {
  return (
    <div className="note-card">

      <div className="note-card-top">

        <div className="note-icon">
          <FileText size={24} />
        </div>

        <button className="more-btn">
          <MoreVertical size={20} />
        </button>

      </div>

      <h3>{note.title}</h3>

      <p>
        {note.content}
      </p>

      <div className="note-footer">

        <span>{note.date}</span>

        <div className="note-actions">

          <button title="Edit">
            <Edit3 size={17} />
          </button>

          <button title="Download">
            <Download size={17} />
          </button>

          <button title="Delete">
            <Trash2 size={17} />
          </button>

        </div>

      </div>

    </div>
  );
}

export default NoteCard;