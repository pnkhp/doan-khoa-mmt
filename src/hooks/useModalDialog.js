import { useCallback, useEffect, useRef } from 'react';

const OPEN_MODALS = new Set();

function syncBodyScrollLock() {
  if (OPEN_MODALS.size > 0) {
    document.body.classList.add('fe-overlay-open');
  } else {
    document.body.classList.remove('fe-overlay-open');
  }
}

/**
 * Manages native <dialog> showModal()/close(), body scroll lock,
 * and automatic focus restoration to the trigger element on close.
 */
export function useModalDialog(isOpen, onClose, options = {}) {
  const { resetScrollOnOpen = false } = options;
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
      if (resetScrollOnOpen) dialog.scrollTop = 0;
      OPEN_MODALS.add(dialog);
      syncBodyScrollLock();
    } else {
      if (dialog.open) dialog.close();
      OPEN_MODALS.delete(dialog);
      syncBodyScrollLock();
    }

    return () => {
      OPEN_MODALS.delete(dialog);
      syncBodyScrollLock();
    };
  }, [isOpen, resetScrollOnOpen]);

  const rememberTrigger = useCallback(element => {
    triggerRef.current = element;
  }, []);

  const closeAndRestoreFocus = useCallback(() => {
    onClose();
    requestAnimationFrame(() => {
      triggerRef.current?.focus({ preventScroll: true });
    });
  }, [onClose]);

  return {
    dialogRef,
    rememberTrigger,
    closeAndRestoreFocus,
  };
}
