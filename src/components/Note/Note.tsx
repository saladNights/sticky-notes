import React, { useState, useEffect, useRef } from 'react';

import Button from '@uiKit/Button';

import styles from './Note.module.scss';

interface Props {
  isEdit?: boolean;
  handleOnCancel?: () => void;
  handleOnSave?: (note: string) => void;
  handleOnDeleteNode?: (id: number) => void;
  id?: number;
  noteContent?: string;
  deskEl?: HTMLDivElement | null;
  trashZoneEl?: HTMLDivElement | null;
}

const Note = (props: Props) => {
  const { id, isEdit, handleOnCancel, handleOnSave, handleOnDeleteNode, noteContent, deskEl, trashZoneEl } = props;

  const [content, setContent] = useState('');
  const [randomBackground, setRandomBackground] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [shifts, setShifts] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ x: 250, y: 200 });

  const noteRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLSpanElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const minNodeWidth = 100;
  const minNodeHeight = 100;

  const getOffset = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  };

  useEffect(() => {
    setRandomBackground(Math.floor(Math.random() * 16777215).toString(16));

    if (id) {
      setPos({ x: id * 10, y: id * 10 });
    }

    if (isEdit) {
      textareaRef.current && textareaRef.current.focus();
    }
  }, []);

  const onMouseDownNote = (e: MouseEvent) => {
    if (!noteRef.current || !deskEl) return;

    const noteOffset = getOffset(noteRef.current);

    setShifts({
      x: e.pageX - noteOffset.left,
      y: e.pageY - noteOffset.top,
    });

    setIsDragging(true);

    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseDownResize = (e: MouseEvent) => {
    if (!resizeRef.current) return;

    setIsResizing(true);

    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseMoveNote = (e: MouseEvent) => {
    if (!isDragging || !noteRef.current || !deskEl || !trashZoneEl) return;

    const deskOffset = getOffset(deskEl);
    const trashZoneOffset = getOffset(trashZoneEl);
    const noteOffset = getOffset(noteRef.current);
    const deskMaxRight = deskOffset.left + deskEl.offsetWidth;
    const deskMaxBottom = deskOffset.top + deskEl.offsetHeight;

    const noteWidth = noteRef.current.offsetWidth;
    const noteHeight = noteRef.current.offsetHeight;

    const noteMaxRight = noteOffset.left + noteWidth;
    const noteMaxBottom = noteOffset.top + noteHeight;

    if (noteMaxRight > trashZoneOffset.left && noteMaxBottom > trashZoneOffset.top) {
      setIsDeleting(true);
    } else {
      setIsDeleting(false);
    }

    setPos((currentPos) => {
      const newX = currentPos.x + e.movementX;
      const newY = currentPos.y + e.movementY;

      let nextPos = { x: newX, y: newY };

      if (newX < 0) {
        nextPos = {
          ...nextPos,
          x: 0,
        };
      }

      if (newY < 0) {
        nextPos = {
          ...nextPos,
          y: 0,
        };
      }

      if (e.pageX + (noteWidth - shifts.x) > deskMaxRight) {
        nextPos = {
          ...nextPos,
          x: deskMaxRight - noteWidth - deskOffset.left,
        };
      }

      if (e.pageY + (noteHeight - shifts.y) > deskMaxBottom) {
        nextPos = {
          ...nextPos,
          y: deskMaxBottom - noteHeight - deskOffset.top,
        };
      }

      return nextPos;
    });

    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseMoveResize = (e: MouseEvent) => {
    if (!isResizing || !resizeRef.current || !deskEl) return;

    setSize((currentSize) => {
      const newSizeX = currentSize.x + e.movementX;
      const newSizeY = currentSize.y + e.movementY;

      const deskOffset = getOffset(deskEl);
      const noteOffset = noteRef.current && getOffset(noteRef.current);
      const deskMaxRight = deskOffset.left + deskEl.offsetWidth;
      const deskMaxBottom = deskOffset.top + deskEl.offsetHeight;

      let nextSize = { x: newSizeX, y: newSizeY };

      if (newSizeX < minNodeWidth) {
        nextSize = { ...nextSize, x: minNodeWidth };
      }

      if (newSizeY < minNodeHeight) {
        nextSize = { ...nextSize, y: minNodeHeight };
      }

      if (e.pageX >= deskMaxRight && noteOffset) {
        nextSize = { ...nextSize, x: deskMaxRight - noteOffset.left };
      }

      if (e.pageY >= deskMaxBottom && noteOffset) {
        nextSize = { ...nextSize, y: deskMaxBottom - noteOffset.top };
      }

      return nextSize;
    });

    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseUpNote = (e: MouseEvent) => {
    setShifts({ x: 0, y: 0 });
    setIsDragging(false);

    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseUpResize = (e: MouseEvent) => {
    setIsResizing(false);

    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    if (!isEdit) {
      noteRef.current?.addEventListener('mousedown', onMouseDownNote);

      return () => {
        noteRef.current?.removeEventListener('mousedown', onMouseDownNote);
      };
    }
  }, [noteRef.current]);

  useEffect(() => {
    resizeRef.current?.addEventListener('mousedown', onMouseDownResize);

    return () => {
      resizeRef.current?.removeEventListener('mousedown', onMouseDownResize);
    };
  }, [resizeRef.current]);

  useEffect(() => {
    if (!isDragging && isDeleting) {
      id && handleOnDeleteNode && handleOnDeleteNode(id);
    }
    if (isDragging) {
      document.addEventListener('mouseup', onMouseUpNote);
      document.addEventListener('mousemove', onMouseMoveNote);
    }

    return () => {
      document.removeEventListener('mouseup', onMouseUpNote);
      document.removeEventListener('mousemove', onMouseMoveNote);
    };
  }, [isDragging]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mouseup', onMouseUpResize);
      document.addEventListener('mousemove', onMouseMoveResize);
    }

    return () => {
      document.removeEventListener('mouseup', onMouseUpResize);
      document.removeEventListener('mousemove', onMouseMoveResize);
    };
  }, [isResizing]);

  return (
    <div
      ref={noteRef}
      className={styles.noteWrapper}
      style={{
        opacity: isDragging ? 0.5 : 1,
        left: pos.x + 'px',
        top: pos.y + 'px',
        zIndex: isEdit ? 999999 : 'auto',
        width: size.x,
        height: size.y,
        boxShadow: isDeleting ? '0px 0px 20px 0px rgba(255, 0, 0, 1)' : 'none',
      }}
    >
      <div className={styles.note}>
        {isEdit ? (
          <textarea ref={textareaRef} onChange={(e) => setContent(e.target.value)} />
        ) : (
          <div className={styles.noteContent} style={{ backgroundColor: '#' + randomBackground }}>
            {noteContent}
          </div>
        )}
        {!isEdit && (
          <span ref={resizeRef} className={styles.drag}>
            {'\u2198'}
          </span>
        )}
      </div>
      {isEdit && (
        <div className={styles.actions}>
          <Button appearance='danger' onClick={handleOnCancel}>
            Cancel
          </Button>
          <Button appearance='primary' onClick={() => handleOnSave && handleOnSave(content)}>
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default Note;
