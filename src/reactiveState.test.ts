/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import { useReactiveState } from "./reactiveState";

// it is unnecessary to have a test for each features, as it is so small and simple
test("simple test for everything", () => {
  type State = {
    count: number;
    text: string | undefined;
    bool: boolean;
  };

  const { result } = renderHook(() =>
    useReactiveState<State>({ count: 0, text: undefined, bool: false }),
  );

  expect(result.current.count).toBe(0);
  expect(result.current.text).toBe(undefined);
  expect(result.current.bool).toBe(false);

  act(() => {
    result.current.setCount(1);
    result.current.setText("Hello");
    result.current.setBool(true);
  });

  // assert by field on the object
  expect(result.current.count).toBe(1);
  expect(result.current.text).toBe("Hello");
  expect(result.current.bool).toBe(true);

  // assert by getValues
  const values = result.current.getValues();
  expect(values.count).toBe(1);
  expect(values.text).toBe("Hello");
  expect(values.bool).toBe(true);
});
