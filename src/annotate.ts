import * as core from "@actions/core";
import * as compat from "./compat";

/**
 * `cargo clippy` JSON-parsed output line.
 */
interface Line {
    reason: string;
    message: Message;
}

interface Message {
    code: string;
    level: string;
    message: string;
    rendered: string;
    spans: DiagnosticSpan[];
}

interface DiagnosticSpan {
    file_name: string;
    is_primary: boolean;
    line_start: number;
    line_end: number;
    column_start: number;
    column_end: number;
}

/**
 * Search for the top one span in the message.
 *
 * We will need that to point annotation to that line.
 *
 * Returns `[line, column]` tuple.
 */
function findFirstSpan(spans: DiagnosticSpan[]): DiagnosticSpan {
    return spans.reduce(function (a, b) {
        return a.line_start < b.line_start ? a : b;
    });
}

function render(message: Message): void {
    let level: "warning" | "error";
    switch (message.level) {
        case "help":
        case "note":
        case "warning":
            level = "warning";
            break;
        case "error":
        case "error: internal compiler error":
            level = "error";
            break;
        default:
            // Unreachable unless rustc introduces another severity level
            level = "error";
            break;
    }

    const span = findFirstSpan(message.spans);

    const file = compat.escapeProperty(span.file_name);
    const line = span.line_start;
    const col = span.column_start;
    const text = compat.escapeData(message.rendered);

    console.log(`::${level} file=${file},line=${line},col=${col}::${text}`);
}

export function process(line: string): void {
    let contents: Line;
    try {
        contents = JSON.parse(line);
    } catch (error) {
        core.debug("Not a JSON, ignoring it");
        return;
    }

    if (contents.reason != "compiler-message") {
        core.debug(`Unexpected reason field, ignoring it: ${contents.reason}`);
        return;
    }

    if (contents.message.code === null) {
        core.debug("Message code is missing, ignoring it");
        return;
    }

    render(contents.message);
}
