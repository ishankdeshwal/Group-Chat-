import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import{ChakraProvider} from "@chakra-ui/react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider w="2">
    <App />
    </ChakraProvider>
  </React.StrictMode>
);


