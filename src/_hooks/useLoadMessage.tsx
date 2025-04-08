import { useState, useEffect, useMemo } from "react";
import { League, SimCHL } from "../_constants/constants";
import { GenerateNumberFromRange } from "../_helper/utilHelper";
import { CHLRecruitLockedMessages } from "../_constants/loadMessages";

export const useLoadMessage = (
  messages: string[],
  intervalMs: number = 2000
) => {
  const [lockMessage, setLockMessage] = useState(() => {
    const randomIndex = GenerateNumberFromRange(0, messages.length - 1);
    return messages[randomIndex];
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = GenerateNumberFromRange(0, messages.length - 1);
      setLockMessage(messages[randomIndex]);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, messages]);

  return lockMessage;
};
