"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";

const MazeGenerationSchema = z.object({
  scarinessLevel: z.number().min(1).max(10),
  theme: z.string().min(1, "Theme is required"),
});

type MazeGenerationInput = z.infer<typeof MazeGenerationSchema>;

export default function MazeInitializationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [characterId, setCharacterId] = useState<string>("default");

  useEffect(() => {
    const id = searchParams.get("characterId");
    setCharacterId(id || "default");
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MazeGenerationInput>({
    resolver: zodResolver(MazeGenerationSchema),
    defaultValues: {
      scarinessLevel: 5,
      theme: "",
    },
  });

  const onSubmit = (data: MazeGenerationInput) => {
    const mazeId = Math.random().toString(36).substr(2, 9); // Generate a random ID for the maze
    toast({
      title: "Generating Maze",
      description: `Creating a ${data.theme} maze with scariness level ${data.scarinessLevel}.`,
    });
    router.push(
      `/maze/${mazeId}/generating?characterId=${characterId}&theme=${encodeURIComponent(data.theme)}&scarinessLevel=${data.scarinessLevel}`,
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Initialize Your Spooky Maze</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="theme">Maze Theme</Label>
              <Input
                id="theme"
                placeholder="e.g., Haunted Forest, Abandoned Asylum"
                {...register("theme")}
              />
              {errors.theme && (
                <p className="text-sm text-red-500">{errors.theme.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scarinessLevel">Scariness Level</Label>
              <Controller
                name="scarinessLevel"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Mild</span>
                      <span>Terrifying</span>
                    </div>
                    <p className="text-center">{field.value}</p>
                  </div>
                )}
              />
              {errors.scarinessLevel && (
                <p className="text-sm text-red-500">
                  {errors.scarinessLevel.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Generate Maze
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
