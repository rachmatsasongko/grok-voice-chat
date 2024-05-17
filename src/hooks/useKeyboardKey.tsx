import { useEffect } from "react";

interface UseKeyboardKeyProps {
  key: string
  onKeyPressed: () => void;
}

export function useKeyboardKey({
  key,
  onKeyPressed
}: UseKeyboardKeyProps) {
  useEffect(() => {
    function keyDownHandler(e: KeyboardEvent) {
      if (e.key === key) {
        e.preventDefault();
        onKeyPressed();
      }
    }

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);
}