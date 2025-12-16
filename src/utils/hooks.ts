import { useCallback, useEffect, useState } from "react";

export function useBooleanState(initialValue = false): [
   state: boolean,
   actions: {
      setState: React.Dispatch<React.SetStateAction<boolean>>;
      setTrue: () => void;
      setFalse: () => void;
      toggle: () => void;
   },
] {
   const [state, setState] = useState<boolean>(initialValue);

   const setTrue = useCallback(() => setState(true), []);
   const setFalse = useCallback(() => setState(false), []);
   const toggle = useCallback(() => setState((oldValue) => !oldValue), []);

   return [
      state,
      {
         setState,
         setTrue,
         setFalse,
         toggle,
      },
   ];
}

export function useDebounceState<Value>(
   initialValue: Value,
   delay = 0.5,
): [value: Value, debouncedValue: Value, setValue: React.Dispatch<React.SetStateAction<Value>>, isLoading: boolean] {
   const [value, setValue] = useState<Value>(initialValue);
   const [debouncedValue, setDebouncedValue] = useState<Value>(initialValue);
   const [isLoading, setIsLoading] = useBooleanState();

   useEffect(() => {
      setIsLoading.setTrue();

      const timer = setTimeout(() => {
         setDebouncedValue(value);
         setIsLoading.setFalse();
      }, delay * 1000);

      return () => {
         clearTimeout(timer);
      };
   }, [value, delay]);

   return [value, debouncedValue, setValue, isLoading];
}
