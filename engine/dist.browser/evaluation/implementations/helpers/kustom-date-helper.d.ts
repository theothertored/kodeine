/** A helper for handling Kustom dates. */
export declare const KustomDateHelper: {
    /**
     *  Converts a JS date object to a Kustom date string.
     *  @example
     *  '2022y05M10d12h04m58s'
     */
    toKustomDateString: (date: Date) => string;
    /** Converts a kustom */
    parseKustomDateString: (now: Date, kustomDateString: string) => Date;
};
