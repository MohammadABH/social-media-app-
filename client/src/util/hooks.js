import { from } from "@apollo/react-hooks";
import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [values, setValues] = useState(initialState);

  const onSubmit = (e) => {
    e.preventDefault();
    callback();
  };

  return {
    onChange,
    onSubmit,
    values
  };
};
