import type { State } from "./state.js";

export async function commandCatch(state: State, ...args: string[]): Promise<void> {
  if (args.length === 0) {
    console.log("Please provide a Pokemon name");
    return;
  }

  const pokemonName = args[0];
  console.log(`Throwing a Pokeball at ${pokemonName}...`);

  const pokemon = await state.pokeapi.fetchPokemon(pokemonName);

  // Higher base experience = harder to catch
  // Base experience ranges from ~50 (easy) to ~600 (legendary)
  // We'll use a formula where catch chance decreases with higher base_experience
  const catchChance = 1 - (pokemon.base_experience / 800);
  const caught = Math.random() < catchChance;

  if (caught) {
    console.log(`${pokemonName} was caught!`);
    state.pokedex[pokemonName] = pokemon;
  } else {
    console.log(`${pokemonName} escaped!`);
  }
}
