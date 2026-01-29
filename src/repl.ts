import type { State } from "./state.js";

export function cleanInput(input: string): string[] {
  return input.toLowerCase().trim().split(/\s+/)
}

export function startREPL(state: State): void {
  state.rl.prompt();

  state.rl.on("line", async (input) => {
    const words = cleanInput(input);

    if (words.length === 0 || words[0] === "") {
      state.rl.prompt();
      return;
    }

    const commandName = words[0];
    const command = state.commands[commandName];

    if (command) {
      try {
        command.callback(state);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Unknown command");
    }

    state.rl.prompt();
  });
}
