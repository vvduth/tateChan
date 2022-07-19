import { Box } from "@chakra-ui/react";
import React from "react";

interface WrapperProps {
  variant?: "small" | "regular";
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = (props) => {
  return (
    <Box
      mt={8}
      mx="auto"
      maxW={props.variant === "regular" ? "800px" : "400px"}
      w="100%"
    >
      {props.children}
    </Box>
  );
};

export default Wrapper;
