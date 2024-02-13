import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { NewNoteCard } from "./components/NewNote";
import { NoteCard } from "./components/NoteCard";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");
    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }
    return [];
  });

  function OnNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function onNoteDeleted(id: string) {
    const NotesArray = notes.filter((note) => {
      return note.id != id;
    });

    setNotes(NotesArray);
    localStorage.removeItem("notes");
    localStorage.setItem("notes", JSON.stringify(NotesArray));
    toast.success("Nota apagada com sucesso!");
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSearch(query);
  }

  const filteredNotes =
    search != ""
      ? notes.filter((note) =>
          note.content.toLowerCase().includes(search.toLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 ">
      <form className="w-full ">
        <input
          type="text"
          placeholder="Busque em suas notas"
          className="w-full bg-transparent text-3xl font-semibold tracking-tight
          outline-none
          placeholder:text-slate-500"
          onChange={handleSearch}
        />
      </form>
      <div className="h-px bg-slate-700"></div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px] ">
        <NewNoteCard onNoteCreated={OnNoteCreated} />

        {filteredNotes.map((note) => {
          return (
            <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
          );
        })}
      </div>
      <footer className="flex py-18 relative mt-auto justify-center text-slate-500 m-4">
        <h1 className="py-4">Gabriel Souza© 2024</h1>{" "}
      </footer>
    </div>
  );
}
