import { mockCharacters } from "@/data/characters/characters";

export async function getCharacterSheet(characterId: string) {
  const character = mockCharacters.find(
    (character) => character.id === characterId,
  );
  return character ?? null;
}
