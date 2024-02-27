import { faker } from "@faker-js/faker";
import { useEffect, useState } from "react";

export type Suggestion = string;

export interface UseReplSuggestionsReturnValue {
  isLoading: boolean;
  suggestions: Suggestion[];
}

export async function fetchReplSuggestions(_userInput: string): Promise<Suggestion[]> {
  return new Promise((resolve, _reject) => {
    // simulate a server request
    setTimeout(() => {
      const newSuggestions = getRandomSuggestions();
      resolve(newSuggestions);
    }, 500);
  });
}

export default function useReplSuggestions(userInput: string): UseReplSuggestionsReturnValue {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userInput.trim() === "") {
      setSuggestions([]);
    }

    setIsLoading(true);

    // simulate a server request
    setTimeout(() => {
      setIsLoading(false);

      if (userInput.trim() === "") {
        return;
      }

      const newSuggestions = getRandomSuggestions();
      setSuggestions(newSuggestions);
    }, 500);
  }, [userInput]);

  return {
    isLoading,
    suggestions,
  };
}

function getRandomSuggestions(): Suggestion[] {
  return new Array(10).fill("").map(() => faker.lorem.word());
}
