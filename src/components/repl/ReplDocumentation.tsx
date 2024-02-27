import { Classes, H3, H4 } from "@blueprintjs/core";
import dedent from "dedent";

const MULTILINE_CODE_SNIPPET = dedent`
  const students = ["Alice", "Bob", "Charlie"];

  function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function getRandomName(array) {
    return array[randomNumber(0, array.length)];
  }

  getRandomName(students);
`;

export default function ReplDocumentation() {
  return (
    <div className={Classes.RUNNING_TEXT}>
      <H3>Documentation</H3>
      <p>
        This is a simple REPL. Try typing in some code and pressing enter.
      </p>
      <p>
        The last command can be retrieved by pressing the up arrow key once.
      </p>
      <H4>
        Preset queries
      </H4>
      <p>
        <em>Image URL strings will be displayed as images</em>
      </p>
      <pre className={Classes.CODE_BLOCK}>
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/New_Replit_Logo.svg/1200px-New_Replit_Logo.svg.png"
      </pre>
      <p>
        <em>Try this code snippet</em>
      </p>
      <pre className={Classes.CODE_BLOCK}>
        {MULTILINE_CODE_SNIPPET}
      </pre>
    </div>
  );
}