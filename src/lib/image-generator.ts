import { z } from "zod";
import * as fal from "@fal-ai/serverless-client";
import { unescape } from "querystring";

fal.config({
  credentials: process.env.FAL_KEY!,
});

export const generateImageForDescription = async (description: string) => {
  const result = z
    .object({ images: z.array(z.object({ url: z.string().url() })) })
    .parse(
      await fal.subscribe("fal-ai/fast-sdxl", {
        input: {
          num_images: 1,
          image_size: "landscape_16_9",
          num_inference_steps: 25,
          prompt: `8-bit asciiart. ${description}`,
          negative_prompt: "high quality, painting, realistic, photo",
        },
      }),
    );

  return result.images[0].url;
};

export const extendImageWithDescription = async (
  imageUrl: string,
  description: string,
) => {
  console.log("extendImageWithDescription", imageUrl, description);
  const result = z
    .object({ images: z.array(z.object({ url: z.string().url() })) })
    .parse(
      await fal.subscribe("fal-ai/fast-sdxl/image-to-image", {
        input: {
          image_url: unescape(imageUrl),
          num_images: 1,
          image_size: "landscape_16_9",
          num_inference_steps: 25,
          prompt: `Update this 8-bit asciiart with the new description: ${description}`,
          negative_prompt: "high quality, painting, realistic, photo",
        },
        logs: true,
      }),
    );

  console.log(result);

  return result.images[0].url;
};
