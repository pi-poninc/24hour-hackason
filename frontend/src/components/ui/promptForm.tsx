"use client";

import { useState } from "react";

import {
  Box,
  Container,
  Heading,
  VStack,
  Button,
  Input,
  Text,
  Image,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
} from "@chakra-ui/react";

import { useStableDiffusion } from "@/hooks/stableDiffusion";

export const PromptForm = () => {
  const cardBgColor = useColorModeValue("white", "gray.700");

  const { prompt, handleChangePrompt, onSubmit } = useStableDiffusion();

  return (
    <Box minH="100vh" py={10}>
      <Container maxW="container.md">
        <VStack spacing={8}>
          <Heading as="h1" size="xl" textAlign="center">
            マンガクリエイター
          </Heading>
          <VStack w="full" spacing={4}>
            <Input
              placeholder="漫画のシーンを描写してください"
              value={prompt}
              onChange={handleChangePrompt}
              size="lg"
            />
            <Button colorScheme="blue" onClick={onSubmit} size="lg" w="full">
              漫画を生成
            </Button>
          </VStack>
          <Card w="full" bg={cardBgColor} boxShadow="md">
            <CardHeader>
              <Heading size="md">生成結果</Heading>
            </CardHeader>
            <CardBody>
              <Box
                w="full"
                h="300px"
                borderRadius="md"
                overflow="hidden"
                position="relative"
              >
                <Image
                  src="/api/placeholder/400/300"
                  alt="Generated Manga"
                  objectFit="cover"
                  w="full"
                  h="full"
                  fallback={
                    <Box
                      w="full"
                      h="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg="gray.100"
                    >
                      <Text color="gray.500">
                        あなたの漫画がここに表示されます
                      </Text>
                    </Box>
                  }
                />
              </Box>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};
