import { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  HStack,
  Text,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import { getAuth, updateProfile } from "firebase/auth";

function Profile({ user, onBack }) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();
  const auth = getAuth();
  const cardBg = useColorModeValue("white", "gray.700");

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName,
      });
      toast({
        title: "Profile updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Profile Settings</Heading>
          <Button onClick={onBack} variant="ghost">
            Back to Chat
          </Button>
        </HStack>

        <Box
          p={8}
          bg={cardBg}
          borderRadius="lg"
          boxShadow="lg"
        >
          <VStack spacing={6}>
            <Box textAlign="center">
              <Avatar
                size="2xl"
                name={displayName}
                mb={4}
              />
              <Text fontSize="xl" fontWeight="bold">
                {displayName}
              </Text>
            </Box>

            {isEditing ? (
              <VStack spacing={4} w="full">
                <FormControl>
                  <FormLabel>Display Name</FormLabel>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </FormControl>

                <HStack spacing={4} w="full">
                  <Button
                    colorScheme="red"
                    onClick={handleUpdateProfile}
                    w="full"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    w="full"
                  >
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            ) : (
              <Button
                colorScheme="red"
                onClick={() => setIsEditing(true)}
                w="full"
              >
                Edit Profile
              </Button>
            )}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default Profile; 