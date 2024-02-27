import { Collapse, type Intent, Tag } from "@blueprintjs/core";
import { More } from "@blueprintjs/icons";
import React, { Fragment, useCallback, useState } from "react";

import {
  type ArraySerialized,
  type BooleanSerialized,
  type ErrorSerialized,
  type EvalResponse,
  type NumberSerialized,
  type ObjectSerialized,
  type Serialized,
  type StringSerialized,
} from "../../common/evalTypes";
import styles from "./Repl.module.scss";

export interface ReplOutputProps {
  entry: EvalResponse;
}

// accessible visual output of the REPL response
export function ReplOutput({ entry }: ReplOutputProps) {
  let typeIntent: Intent = "none";

  const root = entry.root;
  const rootValue = entry.serialized[root];

  switch (rootValue.type) {
    case "object":
      break;
    case "array":
      break;
    case "string":
      typeIntent = "success";
      break;
    case "number":
      typeIntent = "primary";
      break;
    case "boolean":
      typeIntent = "warning";
      break;
    case "error":
      typeIntent = "danger";
      break;
    default:
    // TODO
  }

  const typeTag = (
    <Tag className={styles.replOutputTypeTag} minimal={true} intent={typeIntent}>
      {rootValue.type}
    </Tag>
  );

  return (
    <div className={styles.replOutput}>
      {typeTag}
      <pre>
        <ReplOutputValue depth={0} evalResponse={entry} serialized={rootValue} />
      </pre>
    </div>
  );
}

interface ReplOutputValueProps {
  /** The serialized value to display */
  serialized: Serialized;
  /** The whole EvalResponse object, necessary so that we can look up symbols */
  evalResponse: EvalResponse;
  /** The depth of the nested data structure we are in, if any */
  depth: number;
}

function ReplOutputValue({ depth, evalResponse, serialized }: ReplOutputValueProps) {
  switch (serialized.type) {
    case "object":
      return (
        <ReplOutputObjectPreview
          depth={depth}
          evalResponse={evalResponse}
          serialized={serialized}
        />
      );
    case "array":
      return (
        <ReplOutputArrayPreview depth={depth} evalResponse={evalResponse} serialized={serialized} />
      );
    case "string":
      return <ReplOutputString serialized={serialized} />;
    case "number":
      return <ReplOutputNumber serialized={serialized} />;
    case "boolean":
      return <ReplOutputBoolean serialized={serialized} />;
    case "error":
      return <ReplOutputError serialized={serialized} />;
    default:
      // TODO
      return null;
  }
}

function ReplOutputString({ serialized }: { serialized: StringSerialized }) {
  const [didValidateImage, setDidValidateImage] = useState(false);
  const [isImageValid, setIsImageValid] = useState(false);

  const isImageDataString = serialized.value.startsWith("data:image/");
  const isImageURL = serialized.value.startsWith("http") && hasImageFileExtension(serialized.value);
  const shouldCheckIfStringIsImage = isImageDataString || isImageURL;

  const handleImageLoad = useCallback(() => {
    setIsImageValid(true);
    setDidValidateImage(true);
  }, []);

  const handleImageError = useCallback(() => {
    setIsImageValid(false);
    setDidValidateImage(true);
  }, []);

  if (didValidateImage && isImageValid) {
    return <img src={serialized.value} />;
  }

  if (shouldCheckIfStringIsImage && !didValidateImage) {
    // validate the image src
    return (
      <span>
        Loading...
        <img src={serialized.value} onLoad={handleImageLoad} onError={handleImageError} />
      </span>
    );
  }

  return <span>"{serialized.value}"</span>;
}

const COMMON_IMAGE_FORMATS = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "ico", "svg", "tiff"];

function hasImageFileExtension(url: string): boolean {
  for (const format of COMMON_IMAGE_FORMATS) {
    if (url.endsWith("." + format)) {
      return true;
    }
  }
  return false;
}

function ReplOutputNumber({ serialized }: { serialized: NumberSerialized }) {
  return String(serialized.value);
}

function ReplOutputBoolean({ serialized }: { serialized: BooleanSerialized }) {
  return String(serialized.value);
}

function ReplOutputError({ serialized }: { serialized: ErrorSerialized }) {
  const hasStack = serialized.value.stack != null && serialized.value.stack !== "";

  return (
    <div>
      <span>
        {serialized.value.name}: {serialized.value.message}
      </span>
      {hasStack && (
        <Collapse>
          <pre>{serialized.value.stack}</pre>
        </Collapse>
      )}
    </div>
  );
}

function ReplOutputArrayPreview({
  depth,
  evalResponse,
  serialized,
}: ReplOutputValueProps & {
  serialized: ArraySerialized;
}) {
  const [expanded, setExpanded] = useState(depth === 0);
  const arrayValues = serialized.value.map((v, idx) => (
    <Fragment key={idx}>
      <ReplOutputValue
        depth={depth + 1}
        evalResponse={evalResponse}
        serialized={evalResponse.serialized[v]}
      />
      {", "}
      {depth > 0 && <br />}
    </Fragment>
  ));
  const handleClick = useCallback((event: React.MouseEvent) => {
    // HACKHACK: prevent propagation to parent Tags
    event.stopPropagation();
    setExpanded((e) => !e);
  }, []);

  return (
    <Tag minimal={true} intent="none" interactive={true} onClick={handleClick}>
      {"["}
      {expanded ? <div className={styles.replOutputArrayValues}>{arrayValues}</div> : <More />}
      {"]"}
    </Tag>
  );
}

function ReplOutputObjectPreview({
  depth,
  evalResponse,
  serialized,
}: ReplOutputValueProps & {
  serialized: ObjectSerialized;
}) {
  const [expanded, setExpanded] = useState(depth === 0);
  const objectEntries = serialized.value.map((entry) => (
    <Fragment key={entry.key}>
      <span className={styles.replOutputObjectKey}>
        <ReplOutputValue
          depth={depth + 1}
          evalResponse={evalResponse}
          serialized={evalResponse.serialized[entry.key]}
        />
      </span>
      {": "}
      <ReplOutputValue
        depth={depth + 1}
        evalResponse={evalResponse}
        serialized={evalResponse.serialized[entry.value]}
      />
      {", "}
      <br /> {/* object entries always get newlines */}
    </Fragment>
  ));
  const handleClick = useCallback((event: React.MouseEvent) => {
    // HACKHACK: prevent propagation to parent Tags
    event.stopPropagation();
    setExpanded((e) => !e);
  }, []);

  return (
    <Tag minimal={true} intent="none" interactive={true} onClick={handleClick}>
      {"{"}
      {expanded ? <div className={styles.replOutputObjectEntries}>{objectEntries}</div> : <More />}
      {"}"}
    </Tag>
  );
}
