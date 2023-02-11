// @flow
import { useMemo } from "use-memo-one";

let count = 0;

export function reset() {
  count = 0;
}

export default function useInstanceCount(): string {
  return useMemo(() => `${count++}`, []);
}
