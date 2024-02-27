import { AnchorButton, Button, ButtonGroup, Divider } from "@blueprintjs/core";

import { API_URL_BASE } from "../../common/constants";
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
        href={`${API_URL_BASE}/api-docs/`}
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
