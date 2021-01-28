import { useCallback, useState } from "react";

export const useToggle = (initialValue: boolean = false) => {
  const [toggled, setToggled] = useState(initialValue);
  const handleToggle = useCallback(() => setToggled(!toggled), [toggled]);
  return [toggled, handleToggle] as [boolean, () => void];
};

export const useMultipleToggles = (size: number, initialValue: boolean) => {
  const [state, setState] = useState<boolean[]>(
    [...Array(size).keys()].map(() => initialValue)
  );
  const setToggled = useCallback(
    (targetIndex: number) =>
      setState(
        state.map((value, index) => (index === targetIndex ? !value : value))
      ),
    [state]
  );
  return [state, setToggled] as [boolean[], (targetIndex: number) => void];
};
