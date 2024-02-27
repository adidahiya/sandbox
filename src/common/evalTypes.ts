export interface EvalResponse {
  root: string;
  serialized: Record<string, Serialized>;
}

export type Serialized =
  | ObjectSerialized
  | ArraySerialized
  | StringSerialized
  | NumberSerialized
  | BooleanSerialized
  | ErrorSerialized;

export interface ObjectSerialized {
  type: "object";
  value: { key: string; value: string }[];
}

export interface ArraySerialized {
  type: "array";
  value: string[];
}

export interface StringSerialized {
  type: "string";
  value: string;
}

export interface NumberSerialized {
  type: "number";
  value: number;
}

export interface BooleanSerialized {
  type: "boolean";
  value: boolean;
}

export interface ErrorSerialized {
  type: "error";
  value: {
    name: string;
    message: string;
    stack: string | undefined;
  };
}
