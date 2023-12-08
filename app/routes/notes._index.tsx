import React from "react";
import { redirect } from "@remix-run/node";
import type {
  LoaderFunction,
  ActionFunction,
  LinksFunction,
  MetaFunction,
} from "@remix-run/node";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import { getStoredNotes, storeNotes, type Note } from "~/data/notes";
import NoteList, { links as noteLinks } from "~/components/NoteList";
import {
  Link,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

export default function NotesPage() {
  const data = useActionData<typeof action>();
  const notes: Note[] = useLoaderData();

  return (
    <main>
      <NewNote data={data} />
      <NoteList notes={notes} />
    </main>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "All notes" },
    { name: "Manage your notes with ease" },
  ];
};

export const links: LinksFunction = () => [...newNoteLinks(), ...noteLinks()];

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const noteData = Object.fromEntries(formData) as Note;

  if (noteData.title.trim().length < 5) {
    return {
      message: "Tamanho do campo 'title' deve ser maior que 5 caracteres",
    };
  }

  noteData.id = new Date().toISOString();
  const existingNotes = await getStoredNotes();
  existingNotes.push(noteData);

  await storeNotes(existingNotes);

  return redirect("/notes");
};

export const loader: LoaderFunction = async () => {
  const notes = await getStoredNotes();

  return notes;
};

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <main className="error">
      <h1>An error related to your notes occurred!</h1>
      {isRouteErrorResponse(error) && <p>{error.statusText}</p>}
      {error instanceof Error ? <p>{error.message}</p> : "Unknown Error"}
      <p>
        Back to <Link to="/">Safety</Link>!
      </p>
    </main>
  );
}
