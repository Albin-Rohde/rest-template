import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().required(),
  password: yup.string().required(),
})
export interface LoginInput extends yup.Asserts<typeof loginSchema> {}

export const createUserSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
  email: yup.string().required(),
})
export interface CreateUserInput extends yup.Asserts<typeof createUserSchema> {}
