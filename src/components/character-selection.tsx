"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Character, CharacterSchema } from "@/schemas";
import { mockCharacters } from "@/data/characters/characters";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function CharacterSelection() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>(mockCharacters);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );

  const charactersConvex = useQuery(api.characters.get);

  console.log(charactersConvex);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Character>({
    resolver: zodResolver(CharacterSchema),
    defaultValues: {
      id: "",
      name: "",
      class: "warrior",
      stats: { strength: 10, intelligence: 10, dexterity: 10 },
      inventory: [],
      health: 100,
      maxHealth: 100,
      backstory: "",
      experience: 0,
      level: 1,
    },
  });

  const onSubmit = (data: Character) => {
    const newCharacter = { ...data, id: Date.now().toString() };
    setCharacters([...characters, newCharacter]);
    reset();
    toast({
      title: "Character Created",
      description: `${newCharacter.name} has been added to your roster.`,
    });
  };

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
    toast({
      title: "Character Selected",
      description: `You've chosen ${character.name} for your adventure.`,
    });
    router.push(`/maze/init?characterId=${character.id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Spooky Story Maze Character Selection
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Character</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label>Class</Label>
                <Controller
                  name="class"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="warrior" id="warrior" />
                        <Label htmlFor="warrior">Warrior</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mage" id="mage" />
                        <Label htmlFor="mage">Mage</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rogue" id="rogue" />
                        <Label htmlFor="rogue">Rogue</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="strength">Strength</Label>
                <Input
                  id="strength"
                  type="number"
                  {...register("stats.strength", { valueAsNumber: true })}
                />
                {errors.stats?.strength && (
                  <p className="text-red-500">
                    {errors.stats.strength.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="intelligence">Intelligence</Label>
                <Input
                  id="intelligence"
                  type="number"
                  {...register("stats.intelligence", { valueAsNumber: true })}
                />
                {errors.stats?.intelligence && (
                  <p className="text-red-500">
                    {errors.stats.intelligence.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="dexterity">Dexterity</Label>
                <Input
                  id="dexterity"
                  type="number"
                  {...register("stats.dexterity", { valueAsNumber: true })}
                />
                {errors.stats?.dexterity && (
                  <p className="text-red-500">
                    {errors.stats.dexterity.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="health">Health</Label>
                <Input
                  id="health"
                  type="number"
                  {...register("health", { valueAsNumber: true })}
                />
                {errors.health && (
                  <p className="text-red-500">{errors.health.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="backstory">Backstory</Label>
                <Textarea id="backstory" {...register("backstory")} />
                {errors.backstory && (
                  <p className="text-red-500">{errors.backstory.message}</p>
                )}
              </div>

              <Button type="submit">Create Character</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Existing Character</CardTitle>
          </CardHeader>
          <CardContent>
            {characters.length === 0 ? (
              <p>No characters created yet. Create one to get started!</p>
            ) : (
              <ul className="space-y-2">
                {characters.map((character) => (
                  <li
                    key={character.id}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {character.name} - Level {character.level}{" "}
                      {character.class}
                    </span>
                    <Button onClick={() => handleSelectCharacter(character)}>
                      Select
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedCharacter && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Selected Character</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Name: {selectedCharacter.name}</p>
            <p>Class: {selectedCharacter.class}</p>
            <p>Level: {selectedCharacter.level}</p>
            <p>
              Health: {selectedCharacter.health}/{selectedCharacter.maxHealth}
            </p>
            <p>Strength: {selectedCharacter.stats.strength}</p>
            <p>Intelligence: {selectedCharacter.stats.intelligence}</p>
            <p>Dexterity: {selectedCharacter.stats.dexterity}</p>
            <p>Backstory: {selectedCharacter.backstory}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
