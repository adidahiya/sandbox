import { Classes, H3 } from "@blueprintjs/core";

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
      <p>
        Special queries:
        <br />
        <em>Image URL strings will be displayed as images</em>
        <br />
        <pre>
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/New_Replit_Logo.svg/1200px-New_Replit_Logo.svg.png"
        </pre>
      </p>
    </div>
  );
}