import { Box, Button, Flex } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import React from "react";
import NextLink from "next/link";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();
  let body: any = null;

  if (fetching) {
  } else if (!data?.me) {
    // user not log in
    body = (
      <>
        <NextLink href="/login">
          <Link color="white" mr={2}>
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          Log out
        </Button>
      </Flex>
    );
  }
  return (
    <Flex bg="tomato" p={4} ml={"auto"}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};

export default NavBar;
