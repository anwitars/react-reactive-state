import { Dispatch, SetStateAction, useMemo, useState } from "react";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

type StateFields<T extends Record<string, any>> = {
  [K in keyof T]: T[K];
};

type Setters<T extends Record<string, any>> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: Dispatch<
    SetStateAction<T[K]>
  >;
};

/**
 * A state with setters using the useState hooks. It inherits the state fields from the initial state's type
 * and adds setters for each field, as well as a getValues method to get the current state (without the setters).
 * */
export type ReactiveState<T extends Record<string, any>> = StateFields<T> &
  Setters<T> & {
    getValues: () => T;
  };

/**
 * Returns a state with setters using the useState hooks. See {@link ReactiveState} for more details about the type.
 *
 * @param initialState The initial state to use
 * @returns The state with the fields, setters, and getValues method
 *
 * @example
   import React from 'react';
   import { useReactiveState } from 'reactive-state';

   const toSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

   const YourComponent = () => {
       const state = useReactiveState({
           username: "",
           password: "",
           rememberMe: false
           // more state here...
       });

       const submit = async () => {
           const payload = Object.keys(state.getValues()).reduce((acc, key) => {
               acc[toSnakeCase(key)] = state[key];
               return acc;
           }, {});

           const response = await fetch('https://your-api.com/login', {
               method: 'POST',
               body: JSON.stringify(payload)
           });
           // ...
       }

       return (
           <div>
               <input
                   type="text"
                   value={state.username}
                   onChange={(e) => state.setUsername(e.target.value)}
               />
               <input
                   type="password"
                   value={state.password}
                   onChange={(e) => state.setPassword(e.target.value)}
               />
               <input
                   type="checkbox"
                   checked={state.rememberMe}
                   onChange={(e) => state.setRememberMe(e.target.checked)}
               />
           </div>
       );
   }
 * */
export function useReactiveState<T extends Record<string, any>>(
  initialState: T,
): ReactiveState<T> {
  const [state, setState] = useState(initialState);

  const setters = useMemo(
    () =>
      Object.keys(initialState).reduce((acc, key) => {
        const setterKey = `set${capitalize(key)}` as keyof Setters<T>;

        const setter = <K extends keyof T>(
          value: K | ((prev: T[K]) => T[K]),
        ) => {
          let newValue = value;
          if (typeof value === "function") {
            newValue = value(state[key]);
          }

          setState((prev) => ({ ...prev, [key]: newValue }));
        };

        acc[setterKey] = setter as Setters<T>[keyof Setters<T>];

        return acc;
      }, {} as Setters<T>),
    [initialState],
  );

  return { ...state, ...setters, getValues: () => state };
}
