import * as core from "@actions/core";
import { Cargo } from "@actions-rs/core";
import * as input from "./input";
import * as annotate from "./annotate";

export async function run(actionInput: input.Input): Promise<void> {
    let args: string[] = [];
    args.push("clippy");
    // `--message-format=json` should just right after the `cargo clippy`
    // because usually people are adding the `-- -D warnings` at the end
    // of arguments and it will mess up the output.
    args.push("--message-format=json");
    args = args.concat(actionInput.args);

    let clippyExitCode = 0;
    try {
        const program = await Cargo.get();
        core.startGroup("Executing cargo clippy (JSON output)");
        clippyExitCode = await program.call(args, {
            ignoreReturnCode: true,
            failOnStdErr: false,
            listeners: {
                stdline: (line: string): void => {
                    annotate.process(line);
                },
            },
        });
    } finally {
        core.endGroup();
    }

    core.info(`Clippy exited with ${clippyExitCode} code`);
}

async function main(): Promise<void> {
    try {
        const actionInput = input.get();

        await run(actionInput);
    } catch (error) {
        core.setFailed(error.message);
    }
}

main();
