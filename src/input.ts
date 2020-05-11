import { input } from "@actions-rs/core";

import stringArgv from "string-argv";

export interface Input {
    args: string[];
    cargoBinary: string;
}

export function get(): Input {
    const args = stringArgv(input.getInput("args"));
    const cargoBinary = input.getInput("cargo-binary") || "cargo";

    return {
        args,
        cargoBinary,
    };
}
