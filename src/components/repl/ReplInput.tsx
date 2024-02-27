import { Classes, Menu, MenuItem, Popover } from "@blueprintjs/core";
import clsx from "clsx";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import styles from "./Repl.module.scss";
import useReplSuggestions from "./useReplSuggestions";

export interface ReplInputHandle {
  getInputValue: () => string;
  focusInput: () => void;
}

const ENABLE_SUGGESTIONS = false;

export interface ReplInputProps {
  onEnterKeyDown: () => void;
}

const ReplInput = forwardRef<ReplInputHandle, ReplInputProps>((props, ref) => {
  const [userInput, setUserInput] = useState("");
  const [hasFocus, setHasFocus] = useState(false);
  const popoverRef = useRef<Popover | null>(null);

  const cursor = <span className={clsx(styles.cursor, { [styles.cursorIsBlinking]: hasFocus })} />;

  const inputRef = useRef<HTMLInputElement>(null);
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  }, []);
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        props.onEnterKeyDown();

        // HACKHACK: wait until next frame to clear the input
        setTimeout(() => {
          if (inputRef.current != null) {
            inputRef.current.value = "";
            setUserInput("");
          }
        });
      }
    },
    [props.onEnterKeyDown],
  );

  const invisibleInput = (
    <input
      className={styles.invisibleInput}
      ref={inputRef}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
    />
  );

  const focusInput = useCallback(() => {
    if (inputRef.current != null && !hasFocus) {
      inputRef.current.focus();
      setHasFocus(true);
    }
  }, [hasFocus]);

  const handleDocumentMouseDown = useCallback(() => {
    setHasFocus(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleDocumentMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, []);

  // TODO: uncomment to capture focus on mount
  // useEffect(focusInput, []);

  useEffect(() => {
    // reposition popover as cursor moves
    void popoverRef.current?.reposition();
  }, [userInput]);

  useImperativeHandle(ref, () => {
    return {
      focusInput,
      getInputValue: () => userInput,
    };
  });

  const { isLoading, suggestions } = useReplSuggestions(userInput);

  const suggestionsMenu = (
    <Menu className={styles.autoSuggestions}>
      {isLoading ? (
        <MenuItem text="Loading..." className={Classes.SKELETON} />
      ) : (
        suggestions.map((s) => (
          <MenuItem
            // active={highlightedIndex === idx}
            // selected={s === selectedItem}
            text={s}
          />
        ))
      )}
    </Menu>
  );

  return (
    <div className={styles.replContents}>
      <span className={styles.userInput}>
        <label>{userInput}</label>
      </span>
      <Popover
        autoFocus={false}
        content={suggestionsMenu}
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        disabled={!ENABLE_SUGGESTIONS || suggestions.length === 0}
        isOpen={suggestions.length > 0 && hasFocus}
        enforceFocus={false}
        placement="right-start"
        minimal={true}
        ref={popoverRef}
      >
        {cursor}
      </Popover>
      {invisibleInput}
    </div>
  );
});

export default ReplInput;
