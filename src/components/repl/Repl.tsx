import { Button, Classes, Code, Section, SectionCard } from "@blueprintjs/core";
import clsx from "clsx";
import { useCallback, useRef, useState } from "react";

import { API_URL_BASE } from "../../common/constants";
import { type EvalResponse } from "../../common/evalTypes";
import { getSessionId, resetSession } from "../../common/sessionId";
import styles from "./Repl.module.scss";
import ReplActions from "./ReplActions";
import ReplInputWithMonaco, { type ReplInputHandle } from "./ReplInputWithMonaco";
import { ReplOutput } from "./ReplOutput";

interface ReplHistoryEntry {
  input: string;
  output: EvalResponse;
}

const INITIAL_REPL_HISTORY: ReplHistoryEntry[] = [
  {
    input: "console.log('Hello, world!')",
    output: {
      root: "example",
      serialized: {
        example: {
          type: "string",
          value: "Hello, world!",
        },
      },
    },
  },
];

export default function Repl() {
  const inputRef = useRef<ReplInputHandle | null>(null);
  const handleContentsClick = useCallback(() => {
    inputRef.current?.focusInput();
  }, []);

  const [history, setHistory] = useState<ReplHistoryEntry[]>(INITIAL_REPL_HISTORY);
  const latestCommand = useRef(history.at(-1));

  const [sessionId, setSessionId] = useState(getSessionId);
  const handleResetSession = useCallback(() => {
    const newSessionId = resetSession();
    setSessionId(newSessionId);
    setHistory(INITIAL_REPL_HISTORY);
  }, []);

  const [invalidInput, setInvalidInput] = useState<string | null>(null);
  const isInputEmpty = useCallback(() => {
    const currentInput = inputRef.current?.getInputValue();
    return currentInput === undefined || currentInput.trim() === "";
  }, []);

  const handleEval = useCallback(async () => {
    const inputValue = inputRef.current?.getInputValue();

    if (inputValue === undefined || inputValue.trim() === "") {
      // nothing to evaluate
      return;
    }

    const evalRequest = {
      sessionId,
      code: inputValue,
    };

    console.info("evaluating:", evalRequest);

    const result = await fetch(`${API_URL_BASE}/eval`, {
      method: "POST",
      // mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(evalRequest),
    });

    if (result.ok) {
      const evalResponse = (await result.json()) as EvalResponse;
      console.log("eval response:", evalResponse);

      setInvalidInput(null);
      const newHistoryEntry = {
        input: inputValue,
        output: evalResponse,
      };
      setHistory((prevHistory) => [...prevHistory, newHistoryEntry]);
      latestCommand.current = newHistoryEntry;
    } else {
      setInvalidInput(inputValue);
    }
  }, [sessionId]);

  const handleEvalInteraction = useCallback(() => {
    void handleEval();
  }, [handleEval]);

  // HACKHACK: useCallback isn't interacting well with monaco-editor here
  const handleArrowUpKey = () => {
    if (isInputEmpty()) {
      // get the previous history entry
      const lastHistoryEntry = latestCommand.current;
      if (lastHistoryEntry !== undefined) {
        inputRef.current?.setInputValue(lastHistoryEntry.input);
      }
    }
  };

  const handleArrowDownKey = useCallback(() => {
    // TODO
    console.log("arrow down");
  }, []);

  return (
    <Section
      title="Simple REPL"
      className={styles.repl}
      subtitle={
        <span>
          sessionId: <code>{sessionId}</code>
        </span>
      }
      compact={true}
      rightElement={<ReplActions onResetSession={handleResetSession} />}
    >
      {history.map((entry, idx) => (
        <SectionCard className={styles.historyEntry} key={idx} title={entry.input}>
          <ReplOutput entry={entry.output} />
        </SectionCard>
      ))}
      <SectionCard padded={false}>
        <div
          className={clsx(Classes.CODE_BLOCK, styles.replContentsAndRun)}
          onClick={handleContentsClick}
        >
          <ReplInputWithMonaco
            ref={inputRef}
            onEnterKeyDown={handleEvalInteraction}
            onArrowDownKeyDown={handleArrowDownKey}
            onArrowUpKeyDown={handleArrowUpKey}
          />
          <div className={styles.evalContainer}>
            <Button
              intent="success"
              small={true}
              icon="play"
              onClick={handleEvalInteraction}
              text="Eval"
            />
          </div>
        </div>
      </SectionCard>
      {invalidInput && (
        <SectionCard className={styles.replErrorCard} title="Error">
          <p>Syntax Error while evaluating input:</p>
          <pre className={Classes.CODE_BLOCK}>{invalidInput}</pre>
        </SectionCard>
      )}
    </Section>
  );
}
