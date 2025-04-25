import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Box, Button, Container, HStack, Input, VStack, Heading, Text, Image, useColorModeValue, keyframes } from "@chakra-ui/react";
import Message from "./components/Message"; // Corrected import path
import Profile from "./components/Profile";
import { app } from "./firebase";
import { signOut, onAuthStateChanged, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {query,orderBy,onSnapshot, getFirestore, addDoc, collection, serverTimestamp } from "firebase/firestore";

const db = getFirestore(app);
const auth = getAuth(app);

const LogOutHandler = () => {
  signOut(auth);
}

const LogInHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
}

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const divForScroll = useRef(null);
  
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.700");
  const messageBg = useColorModeValue("gray.50", "gray.800");
  const inputBg = useColorModeValue("white", "gray.700");

  const gradientAnimation = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `;

  const floatAnimation = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  `;

  useEffect(() => {
    const qm=query(collection(db, "Messages"),orderBy("createdAt","asc"))
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });

    const unsubscribeForMessage = onSnapshot(qm, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });
if (divForScroll.current) {
  divForScroll.current.scrollIntoView({behavior:"smooth"})
}
    return () => {
      unsubscribe();
      unsubscribeForMessage();
    }
  }, [messages]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp()
      });
      setMessage("");
     
    } catch (error) {
      alert(error);
    }
  }

  if (showProfile) {
    return <Profile user={user} onBack={() => setShowProfile(false)} />;
  }

  return (
    <Box bg={bgColor}>
      {
        user ? (
          <Container maxW="container.xl" h="100vh" p={0}>
            <VStack h="full" spacing={0}>
              <Box
                w="full"
                p={4}
                bg={cardBg}
                boxShadow="sm"
                position="relative"
                zIndex={1}
              >
                <HStack justify="space-between" align="center">
                  <HStack spacing={4} cursor="pointer" onClick={() => setShowProfile(true)}>
                    <Image
                      src={user.photoURL}
                      alt="Profile"
                      boxSize="40px"
                      borderRadius="full"
                    />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold">{user.displayName}</Text>
                      <Text fontSize="sm" color="gray.500">You</Text>
                    </VStack>
                  </HStack>
                  <Button
                    onClick={LogOutHandler}
                    colorScheme="red"
                    variant="ghost"
                    size="sm"
                    _hover={{
                      bg: "red.50",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s"
                  >
                    Log Out
                  </Button>
                </HStack>
              </Box>

              <VStack
                h="full"
                w="full"
                overflowY="auto"
                spacing={4}
                p={4}
                bg={messageBg}
                css={{
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "gray.300",
                    borderRadius: "24px",
                  },
                }}
              >
                {messages.map(item => (
                  <Message
                    key={item.id}
                    user={item.uid === user.uid ? "me" : "other"}
                    text={item.text}
                    uri={item.uri}
                    displayName={item.displayName || "Anonymous"}
                  />
                ))}
                <div ref={divForScroll} />
              </VStack>

              <Box
                w="full"
                p={4}
                bg={cardBg}
                boxShadow="sm"
                position="relative"
                zIndex={1}
              >
                <form onSubmit={submitHandler}>
                  <HStack spacing={4}>
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      size="lg"
                      bg={inputBg}
                      borderWidth={2}
                      _focus={{
                        borderColor: "red.400",
                        boxShadow: "0 0 0 1px var(--chakra-colors-red-400)",
                      }}
                      _hover={{
                        borderColor: "red.300",
                      }}
                    />
                    <Button
                      type="submit"
                      colorScheme="red"
                      size="lg"
                      px={8}
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      }}
                      transition="all 0.2s"
                    >
                      Send
                    </Button>
                  </HStack>
                </form>
              </Box>
            </VStack>
          </Container>
        ) :
          <Box
            position="relative"
            h="100vh"
            overflow="hidden"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96c93d)",
              backgroundSize: "400% 400%",
              animation: `${gradientAnimation} 15s ease infinite`,
              opacity: 0.1,
              zIndex: 0,
            }}
            _after={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
              opacity: 0.1,
              zIndex: 0,
            }}
          >
            <Container maxW="container.xl" h="100vh" position="relative" zIndex={1}>
              <VStack h="full" justifyContent="center" spacing={8}>
                <VStack spacing={4} textAlign="center">
                  <Box
                    animation={`${floatAnimation} 6s ease-in-out infinite`}
                  >
                    <Image
                      src="https://cdn-icons-png.flaticon.com/512/2111/2111615.png"
                      alt="Chat Logo"
                      boxSize={{ base: "100px", md: "150px" }}
                      mb={4}
                    />
                  </Box>
                  <Heading
                    fontSize={{ base: "4xl", md: "6xl" }}
                    bgGradient="linear(to-r, red.400, red.600)"
                    bgClip="text"
                    fontWeight="extrabold"
                    textShadow="2px 2px 4px rgba(0,0,0,0.1)"
                  >
                    Welcome to Group Chat
                  </Heading>
                  <Text 
                    fontSize={{ base: "lg", md: "xl" }} 
                    color="gray.500"
                    maxW="600px"
                    lineHeight="tall"
                  >
                    Connect with friends and family in real-time. Share moments, exchange ideas, and stay connected with those who matter most.
                  </Text>
                </VStack>
                
                <Box
                  p={8}
                  maxWidth="400px"
                  borderWidth={1}
                  borderRadius={8}
                  boxShadow="2xl"
                  bg={cardBg}
                  backdropFilter="blur(10px)"
                  transition="all 0.3s"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "3xl",
                  }}
                >
                  <VStack spacing={4}>
                    <Button
                      onClick={LogInHandler}
                      size="lg"
                      w="full"
                      colorScheme="red"
                      variant="solid"
                      leftIcon={<Image src="https://cdn-icons-png.flaticon.com/512/2111/2111615.png" boxSize="20px" />}
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      }}
                      transition="all 0.2s"
                    >
                      Sign in with Google
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            </Container>
          </Box>
      }
    </Box>
  );
}

export default App;
