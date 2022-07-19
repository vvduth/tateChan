import React, { InputHTMLAttributes } from "react";
import {useField} from 'formik'
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
  } from "@chakra-ui/react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string ;
    placeholder: string ; 
    label: string ;
    type?: string; 
} ;
// ' => false
// "errre" => false
const InputField: React.FC<InputFieldProps> = (props) => {
  const [field, {error}] = useField(props) ; 
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <Input {...field} type={props.type} id={field.name} placeholder={props.placeholder} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default InputField;
