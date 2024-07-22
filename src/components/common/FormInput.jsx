// components/FormInput.jsx
import React from 'react';
import {Input} from "../ui/input";


const FormInput = ({ type, placeholder, value, onChange, className, ...props }) => (
    <Input type={type} placeholder={placeholder} value={value} onChange={onChange} className={className} {...props} />
);

export default FormInput;
