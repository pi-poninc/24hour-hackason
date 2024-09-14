"use client";

import { useState } from "react";

import { Button, Input } from "@chakra-ui/react";

export const PromptForm = () => {
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    // ここに生成ロジックを実装
    console.log("Generating manga with prompt:", prompt);
  };

  return (
    <>
      <Input
        placeholder="漫画のシーンを描写してください"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        size="lg"
      />
      <Button colorScheme="blue" onClick={handleGenerate} size="lg" w="full">
        漫画を生成
      </Button>
    </>
  );
};
