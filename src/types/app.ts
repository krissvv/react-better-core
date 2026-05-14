/** Removes the given props from type */
export type OmitProps<T, K extends keyof T> = Omit<T, K>;

/** Removes the given options from type */
export type ExcludeOptions<T, K extends T> = Exclude<T, K>;

/** Picks only the selected values */
export type PickValue<T, K extends T> = K;

/** Makes all object props optional (On the root) */
export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;

/** Makes all object props optional (On the root and nested) */
export type DeepPartialRecord<T> = {
   [K in keyof T]?: T[K] extends object ? DeepPartialRecord<T[K]> : T[K];
};

/** Returns only the required props */
export type PickAllRequired<T, K extends keyof T> = Required<Pick<T, K>>;

export type AnyOtherString = Omit<string & {}, "">;

/** Returns a function that will be used to unsubscribe from a listener or ongoing event */
export type Unsubscribe = () => void;
