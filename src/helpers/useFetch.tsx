import * as React from "react";

// useFetch custom hook, fetch response template, takes in an async function as parameter
export default function useFetch<P extends unknown[], R = null, E = null>(
  asyncFunction: (...params: P) => Promise<R>
): {
  // type annotation
  run: (...params: P) => void;
  response: R | null;
  error: E | null;
} {
  // initialise response and error state and initially set to null
  const [response, setResponse] = React.useState<R | null>(null);
  const [error, setError] = React.useState<E | null>(null);

  // cache response
  const run = React.useCallback(
    (...params: P) => {
      setResponse(null);
      setError(null);
      // set to state
      asyncFunction(...params)
        .then((response) => setResponse(response))
        .catch((error) => setError(error));
    },
    // Rerun on parameter change
    [asyncFunction, response, error]
  );

  return { run, response, error };
}
