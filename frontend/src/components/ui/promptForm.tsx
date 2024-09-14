"use client";

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
  Skeleton,
} from "@chakra-ui/react";

import { useStableDiffusion } from "@/hooks/stableDiffusion";

export const PromptForm = () => {
  const cardBgColor = useColorModeValue("white", "gray.700");

  const { prompt, handleChangePrompt, onSubmit, images, isMutating } =
    useStableDiffusion();

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
            <Button
              isLoading={isMutating}
              colorScheme="blue"
              onClick={onSubmit}
              size="lg"
              w="full"
            >
              漫画を生成
            </Button>
          </VStack>
          <Card w="full" bg={cardBgColor} boxShadow="md">
            <CardHeader>
              <Heading size="md">生成結果</Heading>
            </CardHeader>
            <CardBody>
              <Skeleton isLoaded={!isMutating}>
                <Box
                  w="full"
                  h="300px"
                  borderRadius="md"
                  overflow="hidden"
                  position="relative"
                >
                  {images.map((image, idx) => (
                    <Image
                      key={idx}
                      src={`data:image/png;base64, ${image}`}
                      alt="Generated Manga"
                      objectFit="cover"
                      w="full"
                      h="full"
                    />
                  ))}
                  {images.length === 0 && (
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
                  )}
                </Box>
              </Skeleton>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};
