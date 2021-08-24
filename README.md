# Rest express server template
This is a perfect template to use in order to spin up a simple yet structured express rest server.
This template is complete with docker-compose file and Docker file. To make it easy to 
extend this service with a client. 

There are two ways to start this server, either with docker through the docker-compose. Or locally 
on the machine. (requires npm and postgres installed on the machine)

In both cases a `.env` file has to be created/altered.


## with docker-compose
```bash
cp .env.schema .env
docker-compose build
docker-compose up
```

## on machine
```bash
cp /server/.env.schema /server/.env
```
make sure the `.env` looks correct, particularly the db configs. Then start your postgres instance, followed by
```bash
cd server &&
npm run migrate:latest &&
npm run dev
```


## Migrations
Run all migrations:
- `npm run migrate:latest`

Add new migration
- Alter Models in source code
- Build `npm run build`
- Create migration `npm run typeorm migration:generate -- -n <NameOfMigration>`
- Migrations are created in .ts, so we need to build `npm run build`
- Now we can run our new migration `npm run migrate:latest`


## Continue developing
We will follow an example to implement a new Domain, lets say we want to be able to add Posts.
Well first off we will have to create the Domain itself. All terminal input will be from the `/server` directory
```bash
cd src
mkdir post &&
cd post &&
mkdir models &&
touch controller.ts &&
touch services.ts &&
cd models &&
touch Post.ts
```
There we go, we've now created all necessary files and folders for our new Domain, according to the following structure
```bash
/post
  /models
    /Post.ts
  /controller.ts
  /services.ts
```
We will try to contain logic touching and regarding the post inside this "post" domain.
- controller.ts - will be where we keep our express routes and rest-logic
- services.ts - will be where we keep logic regarding retrieving updating and deleting from the db layer.
- models - will be where we keep orm-models/entities strongly coupled with a post.
- models/Post.ts - The orm entity for the post.

we will start by defining our Post model.
```typescript
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm"

export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  text: string

  @CreateDateColumn()
  created_at: string

  @DeleteDateColumn()
  deleted_at: string
}
```

Now we have to create a new Migration in order to add it to the db. There is a section
in here on how to make new migrations.

Now lets go to our services.ts file and create some simple crud methods.
```typescript
import {Post} from "./models/Post";
import {NotFoundError} from "../error";

export const getPost = async (id: number): Promise<Post> => {
  try {
    return Post.findOneOrFail(id)
  } catch (err) {
    throw new NotFoundError(err);
  }
}

export const getPosts = async (ids: number[]): Promise<Post[]> => {
  return Post.findByIds(ids)
}

interface createPostData {
  title: string
  text: string
}
export const createPost = async (data: createPostData): Promise<Post> => {
  const post = Post.create(data)
  await post.save()
  return post
}

export const deletePost = async (id: number): Promise<void> => {
  const res = await Post.delete({id: id})
  if (res.affected <= 0) {
    throw new NotFoundError(`Could not delete post with id ${id} since it does not exist in db`)
  }
}
```
Some basic crud methods for our new post.

Now let's create our endpoints to retrieve and create posts. This is done in the controller.ts file.

```typescript
const postRouter = Router()

postRouter.get('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  if (!id) {
    throw new BadRequestError('id is required to get post')
  }
  return res.json({
    ok: true,
    data: await getPost(id)
  } as RestResponse<Post>)
}))
```
we'll use the express Router method to create a router for this domain. Then we use our method `getPost` from 
`services.ts` to get the post. We keep add all the rest methods we want to in this file. Note that we use the 
`RestResponse` type as our value to `res.json` this is a dynamic type found in `globalTypes.ts` in the `/src` 
root. Also note that we're using `asyncHandler` from `middlewares.ts` to make sure any errors thrown bubble up
to the error handler middleware.

As a last step we register the new postRouter to the express app in `app.ts`.

```typescript
function registerRoutes(app: Application) {
  app.use('/user', userRoute)
  app.use('/post', postRouter)
}
```

That's it, a new Domain implemented, A complete example of this integration can be found in the branch `example/implement-post-domain`
