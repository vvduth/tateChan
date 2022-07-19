import React from "react";
import { Formik, Form } from "formik";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { toErrorMap } from "../utils/toErrorMap";
import { useMutation } from "urql";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { roundValueToStep } from "@chakra-ui/utils";
import { useRegisterMutation } from "../generated/graphql";
import { useRouter } from "next/router";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (value, { setErrors }) => {
          console.log(value);
          const response = await register(value);
          if (response.data?.register.error) {
            setErrors(toErrorMap(response.data.register.error));
          } else if (response.data?.register.user) {
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
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
