import { AnchorButton, Button, ButtonGroup, Divider } from "@blueprintjs/core";

import styles from "./Repl.module.scss";

interface ReplActionsProps {
  onResetSession: () => void;
}

export default function ReplActions(props: ReplActionsProps) {
  return (
    <ButtonGroup className={styles.replActions}>
      <Button
        minimal={true}
        text="Reset Session"
        icon="reset"
        onClick={props.onResetSession}
        intent="warning"
        small={true}
      />
      <Divider />
      <AnchorButton
        href="https://ae04d9fe-19fc-41ab-a709-91816ad49dbc-00-1i6iw8qsyrty4.worf.repl.co/api-docs/"
        target="_blank"
        minimal={true}
        rightIcon="share"
        intent="primary"
        text="Visit API documentation"
        small={true}
      />
    </ButtonGroup>
  );
}
