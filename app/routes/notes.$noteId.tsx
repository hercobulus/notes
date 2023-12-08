import React from 'react'
import styles from '../styles/note-details.css'
import type { MetaFunction, LinksFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { isRouteErrorResponse, Link, useLoaderData, useRouteError } from '@remix-run/react'
import { type Note, getStoredNotes } from '~/data/notes'

export const meta: MetaFunction = ({ data }) => {
  const note = data as Note;
  return [
    { title: note.title },
    { name: "Manage your notes with ease" },
  ];
};

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: styles
  }
]

export default function NotePage() {
  const note = useLoaderData<typeof loader>();

  if(!note) return null

  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to  all notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id="note-details-content">{note.content}</p>
    </main>
  )
}

export const loader: LoaderFunction = async ({params}) => {
  const notes = await getStoredNotes();
  const id = params.noteId;
  const selectedNote = notes.find((note: Note) => note.id === id)

  if(!selectedNote){
    throw json({
      message: "Cound not find note for id " + id
    }, {
      status: 404,
      statusText: "Cound not find note for id " + id
    })
  }

  return selectedNote
}

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