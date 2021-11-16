import { Document } from 'mongoose';

export default interface Post extends Document {
    title: string;
    body: string;
}
