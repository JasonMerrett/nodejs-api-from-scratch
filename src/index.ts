import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import PostController from '@/resources/post/post.controller';

validateEnv();

const app = new App([new PostController()], Number(process.env.PORT));

app.listen();
