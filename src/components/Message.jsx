import React from "react";
import { HStack, Avatar, Text, VStack, useColorModeValue } from "@chakra-ui/react";

function Message({ text, uri, user = "other", displayName }) {
  const messageBg = useColorModeValue(
    user === "me" ? "red.100" : "gray.100",
    user === "me" ? "red.900" : "gray.700"
  );
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <VStack
      alignSelf={user === "me" ? "flex-end" : "flex-start"}
      spacing={1}
      maxW="70%"
    >
      {user === "me" && (
        <Text
          fontSize="xs"
          color="gray.500"
          alignSelf="flex-end"
        >
          You
        </Text>
      )}
      <HStack
        bg={messageBg}
        borderRadius="lg"
        paddingX={4}
        paddingY={2}
        boxShadow="sm"
      >
        {user === "other" && (
          <Avatar
            src={uri}
            size="sm"
            name={displayName}
          />
        )}
        <Text color={textColor}>{text}</Text>
        {user === "me" && (
          <Avatar
            src={uri}
            size="sm"
            name={displayName}
          />
        )}
      </HStack>
    </VStack>
  );
}

export default Message;
