import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!text.trim()) return;

    const note = {
      id: Date.now(),
      text,
      date: new Date().toLocaleDateString("en-IN"),
    };

    setNotes([note, ...notes]);
    setText("");
  };

  const removeNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const startEdit = (note) => {
    setEditId(note.id);
    setEditText(note.text);
  };

  const saveEdit = () => {
    setNotes(
      notes.map((n) =>
        n.id === editId ? { ...n, text: editText } : n
      )
    );
    setEditId(null);
    setEditText("");
  };

  const exportNotes = () => {
    const data = new Blob([JSON.stringify(notes, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(data);

    const link = document.createElement("a");
    link.href = url;
    link.download = "notes.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addNote();
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>My Notes</h1>
        <span className="count">{notes.length}</span>
      </div>

      <div className="input-area">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a note..."
        />

        <button className="add-btn" onClick={addNote}>
          Add Note
        </button>

        <button className="export-btn" onClick={exportNotes}>
          Export Notes
        </button>
      </div>

      <div className="list">
        {notes.length === 0 && (
          <p className="empty">No notes yet</p>
        )}

        {notes.map((n) => (
          <div key={n.id} className="item">
            {editId === n.id ? (
              <div className="edit-mode">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div className="edit-actions">
                  <button className="save-btn" onClick={saveEdit}>
                    Save
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setEditId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="note-text">{n.text}</p>
                <div className="item-footer">
                  <span className="date">{n.date}</span>
                  <div className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => startEdit(n)}
                    >
                      ✏️
                    </button>
                    <button
                      className="del-btn"
                      onClick={() => removeNote(n.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;