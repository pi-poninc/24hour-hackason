import { Box, Container, Heading, VStack } from "@chakra-ui/react";

import { PromptForm } from "@/components/ui/promptForm";
import { ImageCard } from "@/components/ui/imageCard";

function App() {
  return (
    <Box minH="100vh" py={10}>
      <Container maxW="container.md">
        <VStack spacing={8}>
          <Heading as="h1" size="xl" textAlign="center">
            マンガクリエイター
          </Heading>
          <VStack w="full" spacing={4}>
            <PromptForm />
          </VStack>
          <ImageCard />
        </VStack>
      </Container>
    </Box>
  );
}

export default App;
