import React, { useEffect, useState, useRef } from 'react';

import Button from '@uiKit/Button';

import Note from '@components/Note';

import { INote } from '@components/Note/types';

import styles from './App.module.scss';

const App = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [notes, setNotes] = useState<INote[]>([]);
  const [deskRefVisible, setDeskRefVisible] = useState(false);
  const [trashZoneRefVisible, setTrashZoneRefVisible] = useState(false);
  const deskRef = useRef<HTMLDivElement>(null);
  const trashZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    deskRef.current && setDeskRefVisible(true);
  }, [deskRef]);

  useEffect(() => {
    trashZoneRef.current && setTrashZoneRefVisible(true);
  }, [trashZoneRef]);

  const handlerAddNote = () => {
    setIsCreating(true);
  };

  const handleCancelCreating = () => {
    setIsCreating(false);
  };

  const handleSaveNote = (note: string) => {
    setIsCreating(false);
    setNotes([...notes, { id: notes.length + 1, content: note }]);
  };

  const handleDeleteNode = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Sticky Notes</h1>
        <div className={styles.actions}>
          <Button appearance='primary' onClick={handlerAddNote}>
            Add note
          </Button>
        </div>
      </header>
      <div className={styles.desk} ref={deskRef}>
        {isCreating && <Note isEdit handleOnCancel={handleCancelCreating} handleOnSave={handleSaveNote} />}
        {deskRefVisible &&
          trashZoneRefVisible &&
          notes.map((note) => (
            <Note
              key={note.id}
              id={note.id}
              noteContent={note.content}
              deskEl={deskRef.current}
              trashZoneEl={trashZoneRef.current}
              handleOnDeleteNode={handleDeleteNode}
            />
          ))}
        <div ref={trashZoneRef} className={styles.trashZone}>
          Drag here to delete
        </div>
      </div>
    </div>
  );
};

export default App;
