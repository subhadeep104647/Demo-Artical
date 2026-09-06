import {
  useEffect,
  useState
} from "react";

import {
  RotateCcw,
  Trash2,
  FileText
} from "lucide-react";

import { supabase } from "../services/supabase";

function Trash({ user }) {
  const [notes, setNotes] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const getTrash = async () => {
    setLoading(true);

    const { data, error } =
      await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_deleted", true)
        .order("updated_at", {
          ascending: false
        });

    if (!error) {
      setNotes(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    getTrash();
  }, []);

  const restoreNote = async (id) => {
    await supabase
      .from("notes")
      .update({
        is_deleted: false
      })
      .eq("id", id);

    getTrash();
  };

  const deleteForever = async (id) => {
    const confirmed =
      window.confirm(
        "Delete permanently? This cannot be undone."
      );

    if (!confirmed) return;

    await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    getTrash();
  };

  return (
    <div>

      <div className="notes-header">

        <div>
          <h1>Trash</h1>

          <p>
            Restore notes or delete
            them permanently.
          </p>
        </div>

      </div>

      {loading ? (

        <p>Loading trash...</p>

      ) : notes.length === 0 ? (

        <div className="empty-state">

          <Trash2 size={50} />

          <h2>Trash is empty</h2>

        </div>

      ) : (

        <div className="notes-grid">

          {notes.map((note) => (

            <div
              className="note-card"
              key={note.id}
            >

              <div className="note-card-top">

                <div className="note-icon">
                  <FileText />
                </div>

              </div>

              <h3>
                {note.title}
              </h3>

              <p>
                {note.content}
              </p>

              <div className="trash-actions">

                <button
                  className="restore-btn"
                  onClick={() =>
                    restoreNote(note.id)
                  }
                >
                  <RotateCcw size={17} />

                  Restore
                </button>

                <button
                  className="delete-forever-btn"
                  onClick={() =>
                    deleteForever(note.id)
                  }
                >
                  <Trash2 size={17} />

                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Trash;