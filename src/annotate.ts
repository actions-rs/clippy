import * as core from "@actions/core";
import { annotations } from "@actions-rs/core";

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
    // TODO: Should it just use `is_primary = true`?
    return spans.reduce(function (a, b) {
        return a.line_start < b.line_start ? a : b;
    });
}

function render(message: Message): void {
    let level: annotations.AnnotationLevel;
    switch (message.level) {
        case "help":
        case "note":
            level = "notice";
            break;
        case "warning":
            level = "warning";
            break;
        case "error":
        case "error: internal compiler error":
        // Unreachable unless rustc introduces another severity level
        default:
            level = "failure";
            break;
    }

    const span = findFirstSpan(message.spans);

    annotations.annotate({
        title: message.message,
        path: span.file_name,
        annotation_level: level,
        message: message.rendered,
        start_line: span.line_start,
        end_line: span.line_end,
        start_column: span.column_start,
        end_column: span.column_end,
    });
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
