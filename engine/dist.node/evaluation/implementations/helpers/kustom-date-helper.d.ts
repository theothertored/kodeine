/** A helper for handling Kustom dates. */
export declare const KustomDateHelper: {
    /**
     *  Converts a JS date object to a Kustom date string.
     *  @example
     *  '2022y05M10d12h04m58s'
     */
    toKustomDateString: (date: Date) => string;
    /** Converts a kustom date string into a JS date object. */
    parseKustomDateString: (date: Date, kustomDateString: string) => Date;
};
