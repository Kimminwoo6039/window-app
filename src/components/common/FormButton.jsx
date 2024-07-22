// components/FormButton.jsx
import React from 'react';
import {Button} from "../ui/button";

const FormButton = ({ children, className, ...props }) => (
    <Button className={className} {...props}>
        {children}
    </Button>
);

export default FormButton;
