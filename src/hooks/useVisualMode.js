import { useState } from "react";


export default function useVisualMode(initial) {
  
  const [history, setHistory] = useState([initial]);

  const transition = function(newMode, replace = false) {
    if(replace === true) {
      setHistory([...history.slice(-2, -1), newMode])
    } else {
      setHistory([...history, newMode])
    } 

  }
  const back = function() {
    if(history.length > 1) {
      setHistory(prev => {
        return [...prev.slice(0, prev.length - 1)];
      })
    }
  }
  const mode = history.slice(-1)[0];
  return { mode, transition, back };
}


