import React from "react";
import { Formik, Form } from "formik";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { toErrorMap } from "../utils/toErrorMap";
import { Box, Button } from "@chakra-ui/react";
import { roundValueToStep } from "@chakra-ui/utils";
import { useLoginMutation } from "../generated/graphql";
import { useRouter } from "next/router";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (value, { setErrors }) => {
          console.log(value);
          const response = await login(value);
          if (response.data?.login.error) {
            setErrors(toErrorMap(response.data.login.error));
          } else if (response.data?.login.user) {
            console.log("here");
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              label="Username"
              placeholder="Type username..."
            />
            <Box mt={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="Type password"
                type="password"
              />
            </Box>
            <Button
              type="submit"
              isLoading={isSubmitting}
              mt={4}
              colorScheme="teal"
            >
              Log in
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
