import { ChakraProvider } from "@chakra-ui/react";
import { createClient, Provider } from "urql";

import theme from "../theme";
import { AppProps } from "next/app";

const client = createClient({
  url: "http://localhost:5000/graphql",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
