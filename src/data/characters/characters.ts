import { z } from "zod";
import lyra from "./lyra-stormweaver.json";
import thorne from "./thorne-ironheart.json";
import zephyr from "./zephyr-shadowstep.json";
import { CharacterSchema } from "@/schemas";

export const mockCharacters = z
  .array(CharacterSchema)
  .parse([lyra, thorne, zephyr]);
