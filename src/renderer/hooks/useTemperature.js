import { useEffect, useState } from "react";

export function useTemperature() {
  const [temp, setTemp] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    window.api.onTemperature((data) => {
      setTemp(data.temp);
      setHistory((prev) => [...prev.slice(-300), ...data.history.slice(-1)]);
    });
  }, []);

  return { temp, history };
}
