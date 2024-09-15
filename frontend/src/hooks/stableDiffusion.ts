"use client";

import { useState } from "react";
import useSWRMutation from "swr/mutation";

import { REQUEST_CONTENT_TYPE } from "@/constants/http";
import http, { HttpError } from "@/utils/http";

type StableDiffusionRequest = {
  prompt: string;
};

type StableDiffusionResponse = {
  images: string[];
};

export const useStableDiffusion = () => {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const { trigger, isMutating } = useSWRMutation<
    StableDiffusionResponse,
    HttpError,
    string,
    StableDiffusionRequest
  >(
    "/stableDiffusion",
    async (url: string, { arg }) => {
      return http.post(url, {
        body: arg,
        contentType: REQUEST_CONTENT_TYPE.APPLICATION_JSON,
      });
    },
    {
      throwOnError: false,
      onError: (error: HttpError) => {
        console.error(error);
      },
    }
  );

  const onSubmit = async () => {
    await trigger(
      { prompt },
      {
        onSuccess: (data) => {
          if (!data) {
            return;
          }
          const { images = [] } = data;
          setImages(images);
        },
      }
    );
  };

  const handleChangePrompt = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setPrompt(e.target.value);

  return {
    prompt,
    handleChangePrompt,
    onSubmit,
    images,
    isMutating,
  };
};
