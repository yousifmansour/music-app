import { useCallback, useState } from "react";

export const useToggle = (initialValue: boolean = false) => {
  const [toggled, setToggled] = useState(initialValue);
  const handleToggle = useCallback(() => setToggled(!toggled), [toggled]);
  return [toggled, handleToggle] as [boolean, () => void];
};
