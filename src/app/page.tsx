import GameInterface from "@/components/game-interface";
import { generateMaze } from "@/lib/maze";
import characterSheet from "@/data/characters/lyra-stormweaver.json";
import CharacterSelection from "@/components/character-selection";

export default async function Home() {
  // const maze = await generateMaze(
  //   "neverwinter woods werewolf",
  //   CharacterSchema.parse(characterSheet)
  // );
  // console.log(maze);
  return (
    <div>
      <CharacterSelection />
    </div>
  );
}
