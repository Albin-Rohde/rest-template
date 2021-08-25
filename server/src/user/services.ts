import { User } from './models/User'
import {BadRequestError, CreateError} from "../error";
import bcrypt from "bcrypt";

export const getUserById = async (id: number) => {
  return User.findOneOrFail({id})
}

export const getUserByEmail = async (email: string) => {
  return User.findOneOrFail({email})
}

interface UserByEmailOrUsernameInput {
  email: string
  username: string
}
export const getUserByEmailOrUsername = async (input: UserByEmailOrUsernameInput) => {
  return User.createQueryBuilder('user')
    .where('user.email = :email', {email: input.email})
    .orWhere('user.username = :username', {username: input.username})
    .getOne()
}

interface CreateUserInput {
  email: string
  password: string
  username: string
}
export async function createUser (input: CreateUserInput) {
  if(!input.email || !input.password || !input.username) {
    throw new BadRequestError(`'email', 'password' and 'username' required on body`)
  }
  const existingUser = await getUserByEmailOrUsername({email: input.email, username: input.username})
  if (existingUser) {
    throw new CreateError('A user with same Email or Username already exist')
  }
  const user = User.create({
    password: await bcrypt.hash(input.password, 10),
    email: input.email,
    username: input.username,
  })
  await user.save()
  return user
}
