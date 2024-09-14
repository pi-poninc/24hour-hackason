"use client";

import {
  Box,
  Heading,
  Text,
  Image,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
} from "@chakra-ui/react";

export const ImageCard = () => {
  const cardBgColor = useColorModeValue("white", "gray.700");

  return (
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
                <Text color="gray.500">あなたの漫画がここに表示されます</Text>
              </Box>
            }
          />
        </Box>
      </CardBody>
    </Card>
  );
};
