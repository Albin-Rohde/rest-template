import * as yup from "yup"

export const postIdSchema = yup.object({
  id: yup.number().required()
})
export interface PostIdInput extends yup.Asserts<typeof postIdSchema> {}

export const postIdsSchema = yup.object({
  ids: yup.array().of(
    yup.number().required()
  )
})
export interface PostIdsInput extends yup.Asserts<typeof postIdsSchema> {}

export const createPostSchema = yup.object({
  title: yup.string().required(),
  text: yup.string().required(),
})
export interface CreatePostInput extends yup.Asserts<typeof createPostSchema> {}
