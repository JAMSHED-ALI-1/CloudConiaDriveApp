import * as yup from 'yup'
import strings from '../../helper/Language/LocalizedStrings';

export const LoginInitialValue = {
    email : '',
    password : ''
}

export const loginValidtionSchema = yup.object().shape({
    email:yup.string().required(strings.Emailisrequired),
    password:yup.string().required(strings.Passwordisrequired)
})
export const profileInitialValue = {
    first_name : '',
    last_name : '',
    email : '',
    mobile : ''
}


export const profileValidationSchema = yup.object().shape({
    first_name: yup.string().required('First Name is required'),
    last_name: yup.string().required('Last Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    mobile: yup
        .string()
        .matches(/^[0-9]+$/, 'Mobile number must contain only digits')
        .min(10, 'Mobile number must be at least 10 digits')
        .max(15, 'Mobile number cannot exceed 15 digits')
        .nullable(),
    company: yup.string().nullable(),
    designation: yup.string().nullable(),
    country: yup.string().nullable(),
    zipcode: yup.string().nullable(),
    address: yup.string().nullable(),
    city: yup.string().nullable(),
});
export const updatepasswordValidtionSchema = yup.object().shape({
    current_password:yup.string().required('Current password is required'),
    new_password:yup.string().required('New password is required'),
    new_password_confirmation:yup.string().required('Confirm password is required'),
   
})

export const SignupInitialValue = {
    firstname : '',
    Lastname : '',
    email : '',
    password : '',
    
}

export const SignupValidtionSchema = yup.object().shape({
    firstname : yup.string().required('Name is required'),
    Lastname : yup.string().required('Name is required'),
    email : yup.string().required('Email is required'),
    password:yup.string().required('Password is required')
})