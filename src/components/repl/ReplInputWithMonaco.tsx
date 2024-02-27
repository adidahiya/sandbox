import Editor from "@monaco-editor/react";
import { type editor, KeyCode } from "monaco-editor";
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";

import styles from "./Repl.module.scss";

const MONACO_EDITOR_OPTIONS: editor.IEditorOptions = {
  automaticLayout: true,
  contextmenu: false,
  folding: false,
  glyphMargin: false,
  lineDecorationsWidth: 0,
  lineNumbers: "off",
  lineNumbersMinChars: 0,
  minimap: { enabled: false },
  inlineSuggest: { enabled: false },
  quickSuggestions: false,
  inlayHints: { enabled: "off" },
};

export interface ReplInputHandle {
  /** Set the input value explicitly, overriding any existing value */
  setInputValue: (value: string) => void;
  /** Get the input value from the editor */
  getInputValue: () => string;
  /** Focus the editor */
  focusInput: () => void;
}

export interface ReplInputProps {
  onEnterKeyDown: () => void;
  onArrowUpKeyDown: () => void;
  onArrowDownKeyDown: () => void;
}

const ReplInputWithMonaco = forwardRef<ReplInputHandle, ReplInputProps>((props, ref) => {
  const [editorHeightInRem, setEditorHeightInRem] = useState(5);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEnterCommand = useCallback(() => {
    // services available in `ctx`
    props.onEnterKeyDown();

    // HACKHACK: wait until next frame to clear the input
    setTimeout(() => {
      editorRef.current?.setValue("");
    });
  }, [props.onEnterKeyDown]);

  // TODO: fix, this callback is not being called
  const handleShiftEnterCommand = useCallback(() => {
    setEditorHeightInRem((prevHeight) => prevHeight + 1);
  }, []);

  const focusInput = useCallback(() => {
    editorRef.current?.focus();
  }, []);

  const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.addCommand(KeyCode.Enter & KeyCode.Shift, handleShiftEnterCommand);
    editor.addCommand(KeyCode.Enter, handleEnterCommand);
    editor.addCommand(KeyCode.UpArrow, props.onArrowUpKeyDown);
    editor.addCommand(KeyCode.DownArrow, props.onArrowDownKeyDown);
  };

  // TODO: uncomment to capture focus on mount
  // useEffect(focusInput, []);

  useImperativeHandle(ref, () => {
    return {
      focusInput,
      getInputValue: () => editorRef.current?.getValue() ?? "",
      setInputValue: (value: string) => {
        if (editorRef.current == null) {
          return;
        }

        editorRef.current.setValue(value);

        // move cursor to end of input
        const lineCount = editorRef.current.getModel()?.getLineCount() ?? 1;
        const lineLength = editorRef.current.getModel()?.getLineMaxColumn(lineCount) ?? 1;
        editorRef.current.setPosition({
          lineNumber: lineCount,
          column: lineLength,
        });
      },
    };
  });

  return (
    <div className={styles.replContents}>
      <Editor
        defaultLanguage="javascript"
        defaultValue=""
        height={`${editorHeightInRem}rem`}
        onMount={handleEditorMount}
        options={MONACO_EDITOR_OPTIONS}
      />
    </div>
  );
});
ReplInputWithMonaco.displayName = "ReplInputWithMonaco";

export default ReplInputWithMonaco;
