import { Dispatch, SetStateAction, useState } from "react";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

type StateFields<T extends Record<string, any>> = {
  [K in keyof T]: T[K];
};

type Setters<T extends Record<string, any>> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: Dispatch<
    SetStateAction<T[K]>
  >;
};

export type ReactiveState<T extends Record<string, any>> = StateFields<T> &
  Setters<T> & {
    getValues: () => T;
  };

export function useReactiveState<T extends Record<string, any>>(
  initialState: T,
): ReactiveState<T> {
  const [state, setState] = useState(initialState);

  const setters = Object.keys(initialState).reduce((acc, key) => {
    const setterKey = `set${capitalize(key)}` as keyof Setters<T>;

    const setter = <K extends keyof T>(value: K | ((prev: T[K]) => T[K])) => {
      let newValue = value;
      if (typeof value === "function") {
        newValue = value(state[key]);
      }

      setState((prev) => ({ ...prev, [key]: newValue }));
    };

    acc[setterKey] = setter as Setters<T>[keyof Setters<T>];

    return acc;
  }, {} as Setters<T>);

  return { ...state, ...setters, getValues: () => state };
}
