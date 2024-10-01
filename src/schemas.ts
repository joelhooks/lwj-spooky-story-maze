import { z } from "zod";

// Schema definitions
const NodeTypeSchema = z.enum([
  "start",
  "boss",
  "standard",
  "checkpoint",
] as const);
const EncounterTypeSchema = z.enum([
  "combat",
  "puzzle",
  "dialogue",
  "trap",
  "treasure",
  "event",
  "minigame",
] as const);
const EncounterToneSchema = z.enum([
  "serious",
  "humorous",
  "mysterious",
  "whimsical",
  "spooky",
  "absurd",
] as const);
const CharacterClassSchema = z.enum([
  "warrior",
  "mage",
  "rogue",
  "cleric",
  "ranger",
] as const);
const ItemTypeSchema = z.enum([
  "weapon",
  "armor",
  "potion",
  "key",
  "artifact",
  "miscellaneous",
] as const);
const EffectCategorySchema = z.enum([
  "positive",
  "negative",
  "neutral",
  "silly",
  "unpredictable",
] as const);

// Effect Schema
const EffectSchema = z.object({
  type: z.string(),
  category: EffectCategorySchema,
  value: z.number(),
  duration: z.number(),
  probability: z.number(),
  description: z.string(),
});

// Item Schema
const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: ItemTypeSchema,
  rarity: z.enum(["common", "uncommon", "rare", "epic", "legendary"]),
  effects: z.array(EffectSchema),
  uses: z.number().int(),
  stats: z.object({
    damage: z.number(),
    armor: z.number(),
    healing: z.number(),
  }),
  requiredLevel: z.number().int(),
  value: z.number().int(),
  weight: z.number(),
  quirk: z.string(),
});

// Skill Schema
const SkillSchema = z.object({
  name: z.string(),
  level: z.number().int(),
  experience: z.number().int(),
});

// Character Schema
const CharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  class: z.enum(["warrior", "mage", "rogue"]),
  stats: z.object({
    strength: z.number().int(),
    intelligence: z.number().int(),
    dexterity: z.number().int(),
  }),
  inventory: z.array(z.string()), // Simplified to just item names
  health: z.number().int(),
  maxHealth: z.number().int(),
  backstory: z.string(),
  experience: z.number().int(),
  level: z.number().int(),
});

export type Character = z.infer<typeof CharacterSchema>;

// Action Schema
const ActionSchema = z.object({
  id: z.string(),
  description: z.string(),
  consequenceType: z.enum(["success", "failure", "neutral", "random"]),
  consequence: z.string(),
  probability: z.number().optional(),
});

// Dialogue Option Schema
const DialogueOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  nextDialogueId: z.string().optional(),
  action: ActionSchema.optional(),
});

// Dialogue Schema
const DialogueSchema = z.object({
  id: z.string(),
  npcName: z.string(),
  npcDialogue: z.string(),
  playerOptions: z.array(DialogueOptionSchema),
});

// Combat Enemy Schema
const CombatEnemySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  stats: z.record(z.number()),
  abilities: z.array(z.string()),
  loot: z.array(ItemSchema).optional(),
});

// Puzzle Schema
const PuzzleSchema = z.object({
  description: z.string(),
  solution: z.string(),
  hints: z.array(z.string()).optional(),
  reward: ItemSchema.optional(),
});

// Trap Schema
const TrapSchema = z.object({
  description: z.string(),
  difficulty: z.number().max(10),
  consequenceOnTrigger: z.string(),
  avoidanceMethod: z.string().optional(),
});

// Treasure Schema
const TreasureSchema = z.object({
  description: z.string(),
  items: z.array(ItemSchema),
  guardianMonster: CombatEnemySchema.optional(),
  trap: TrapSchema.optional(),
});

// Event Schema
const EventSchema = z.object({
  description: z.string(),
  choices: z.array(ActionSchema),
});

// Minigame Schema
const MinigameSchema = z.object({
  name: z.string(),
  description: z.string(),
  rules: z.string(),
  winCondition: z.string(),
  reward: ItemSchema.optional(),
});

// Add TurnSchema
const TurnSchema = z.object({
  id: z.string(),
  playerAction: z.string(),
  gameResponse: z.string(),
  effects: z.array(EffectSchema),
  timestamp: z.date(),
});

// Add TextChoiceSchema
const TextChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
  consequence: z.string(),
});

// Add NarrativeEventSchema
const NarrativeEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  choices: z.array(TextChoiceSchema),
  consequences: z.record(z.string()),
});

// Encounter Schema
const EncounterSchema = z.object({
  id: z.string(),
  type: EncounterTypeSchema,
  tone: EncounterToneSchema,
  title: z.string(),
  description: z.string(),
  introNarration: z.string(),
  outroNarration: z.string(),
  content: z.union([
    CombatEnemySchema,
    PuzzleSchema,
    DialogueSchema,
    TrapSchema,
    TreasureSchema,
    EventSchema,
    MinigameSchema,
  ]),
  rewards: z.array(ItemSchema),
  consequences: z.array(EffectSchema),
  requiredItems: z.array(ItemSchema),
  requiredSkills: z.record(z.number()),
  sillyTwist: z.string(),
  difficulty: z.number().max(10),
  timeLimit: z.number().int(), // in seconds, 0 or undefined means no time limit
  textChoices: z.array(TextChoiceSchema),
});

// Node Schema
const NodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: NodeTypeSchema,
  difficulty: z.number(),
  theme: z.string(),
  specialProperties: z.array(z.string()).optional(),
  initialVisitPrompt: z.string(),
  initialVisitImagePrompt: z.string(),
  returnVisitPrompt: z.string(),
  encounter: EncounterSchema.optional(),
  visits: z.array(z.string()),
});

// Node Visit Schema
const NodeVisitSchema = z.object({
  nodeId: z.string(),
  nodeImageUrl: z.string(),
});

export type NodeVisit = z.infer<typeof NodeVisitSchema>;

export const NodeGenerationSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: NodeTypeSchema,
  theme: z.string(),
  initialVisitPrompt: z.string(),
  initialVisitImagePrompt: z.string(),
  returnVisitPrompt: z.string(),
});

const MazeGenerationSchema = z.object({
  id: z.string(),
  name: z.string(),
  seed: z.string(),
  overallDifficulty: z.number(),
  theme: z.string(),
  nodes: z.array(NodeGenerationSchema),
  edges: z.array(
    z.object({
      id: z.string(),
      sourceId: z.string(),
      targetId: z.string(),
      transitionPrompt: z.string(),
    }),
  ),
  metadata: z.object({
    startNodeId: z.string(),
    bossNodeId: z.string(),
    checkpointNodeIds: z.array(z.string()),
  }),
});

// Maze Schema
const MazeSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  modifiedAt: z.date(),
  seed: z.string(),
  overallDifficulty: z.number(),
  theme: z.string(),
  nodes: z.array(NodeSchema),
  edges: z.array(
    z.object({
      id: z.string(),
      sourceId: z.string(),
      targetId: z.string(),
      transitionDescription: z.string(),
      traversalCondition: z.string().optional(),
    }),
  ),
  metadata: z.object({
    totalRooms: z.number(),
    startNodeId: z.string(),
    bossNodeId: z.string(),
    checkpointNodeIds: z.array(z.string()),
  }),
  globalEvents: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      effect: EffectSchema,
      duration: z.number().int(), // -1 for permanent effects
    }),
  ),
  narrativeEvents: z.array(NarrativeEventSchema),
});

// Game State Schema
const GameStateSchema = z.object({
  id: z.string(),
  mazeId: z.string(),
  characterId: z.string(),
  currentNodeId: z.string(),
  visitedNodeIds: z.array(z.string()),
  lastSavedAt: z.date(),
  gameSpecificStats: z.record(z.unknown()),
  playerProgress: z.object({
    completedQuests: z.array(z.string()),
    unlockedAchievements: z.array(z.string()),
    currentObjective: z.string(),
  }),
  gameSettings: z.object({
    difficulty: z.enum(["easy", "normal", "hard", "nightmare"]),
    enablePermadeath: z.boolean(),
    enableFogOfWar: z.boolean(),
  }),
  currentTurn: z.number().int(),
  turnHistory: z.array(TurnSchema),
  availableActions: z.array(z.string()),
});

// Export all schemas and types
export {
  NodeTypeSchema,
  EncounterTypeSchema,
  EncounterToneSchema,
  CharacterClassSchema,
  ItemTypeSchema,
  EffectCategorySchema,
  EffectSchema,
  ItemSchema,
  SkillSchema,
  CharacterSchema,
  ActionSchema,
  DialogueOptionSchema,
  DialogueSchema,
  CombatEnemySchema,
  PuzzleSchema,
  TrapSchema,
  TreasureSchema,
  EventSchema,
  MinigameSchema,
  EncounterSchema,
  NodeSchema,
  NodeVisitSchema,
  MazeGenerationSchema,
  MazeSchema,
  GameStateSchema,
  TurnSchema,
  TextChoiceSchema,
  NarrativeEventSchema,
};
