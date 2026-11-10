import { useState, useEffect } from "react";

export const useTypingEffect = (fullText = "", speed = 25, onComplete) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!fullText) {
      setDisplayedText("");
      return;
    }

    let index = 0;
    const words = fullText.split(" ");
    setDisplayedText("");

    const interval = setInterval(() => {
      if (index < words.length) {
        setDisplayedText((prev) => (prev ? `${prev} ${words[index]}` : words[index]));
        index++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [fullText, speed]);

  return displayedText;
};