"use client";

import {
  Box,
  Container,
  Heading,
  VStack,
  Button,
  Textarea,
  Text,
  Image,
  useColorModeValue,
  Card,
  CardBody,
  Flex,
} from "@chakra-ui/react";

import { useStableDiffusion } from "@/hooks/stableDiffusion";

export const PromptForm = () => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");

  const { prompt, handleChangePrompt, onSubmit, images, isMutating } =
    useStableDiffusion();

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">
            AI漫画ジェネレーター
          </Heading>
          <Flex direction={{ base: "column", md: "row" }} gap={6}>
            <Card minHeight="80vh" flex={1} bg={cardBgColor} boxShadow="md">
              <CardBody>
                <VStack spacing={4}>
                  <Textarea
                    placeholder="アイデアを入力"
                    value={prompt}
                    minHeight="65vh"
                    onChange={handleChangePrompt}
                    _placeholder={{ opacity: 0.4, color: "inherit" }}
                    size="lg"
                    h="full"
                  />
                  <Button
                    isLoading={isMutating}
                    colorScheme="blue"
                    onClick={onSubmit}
                    size="lg"
                    w="full"
                  >
                    生成開始
                  </Button>
                </VStack>
              </CardBody>
            </Card>
            <Card minHeight="80vh" flex={1} bg={cardBgColor} boxShadow="md">
              <CardBody>
                <Box
                  w="full"
                  h="full"
                  borderRadius="md"
                  position="relative"
                  overflowY="auto"
                  css={{
                    "&::-webkit-scrollbar": {
                      width: "10px",
                    },
                    "&::-webkit-scrollbar-track": {
                      width: "100px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      borderRadius: "24px",
                    },
                  }}
                >
                  {images.map((image, idx) => (
                    <VStack key={idx} w="full" h="full">
                      <Image
                        src={`data:image/png;base64, ${image}`}
                        alt="Generated Manga"
                        objectFit="cover"
                        w="full"
                        h="full"
                      />
                    </VStack>
                  ))}
                  {images.length === 0 && (
                    <Flex
                      w="full"
                      h="full"
                      align="center"
                      justify="center"
                      bg="gray.100"
                    >
                      <Text color="gray.500">結果表示エリア</Text>
                    </Flex>
                  )}
                </Box>
              </CardBody>
            </Card>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};
