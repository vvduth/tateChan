import React from "react";
import { Formik, Form } from "formik";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import {useMutation} from "urql" ;
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

interface registerProps {}

const REGISTER_MUT = `mutation Register($username: String!, $password: String!){
  register(options: {username: $username, password:$password}) {
    error {
      field
      message
    }
    user {
      createdAt
      id
      username
    }
  }
}`

const Register: React.FC<registerProps> = ({}) => {
  const [,register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (value, {setErrors}) => {
          console.log(value);
          const response =  await register(value);
          if (response.data?.register.error){
              setErrors({
                username: "hey I am an error"
              })
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
            <Button type="submit" isLoading={isSubmitting} mt={4} colorScheme="teal">
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;


