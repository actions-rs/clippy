// These functions are copied from the `https://github.com/actions/toolkit` repo,
// as of 2020-05-11 they are not available publicly and there is no API support
// for warnings and errors with parameters.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCommandValue(input: any): string {
    if (input === null || input === undefined) {
        return "";
    } else if (typeof input === "string" || input instanceof String) {
        return input as string;
    }
    return JSON.stringify(input);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function escapeData(s: any): string {
    return toCommandValue(s)
        .replace(/%/g, "%25")
        .replace(/\r/g, "%0D")
        .replace(/\n/g, "%0A");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function escapeProperty(s: any): string {
    return toCommandValue(s)
        .replace(/%/g, "%25")
        .replace(/\r/g, "%0D")
        .replace(/\n/g, "%0A")
        .replace(/:/g, "%3A")
        .replace(/,/g, "%2C");
}
