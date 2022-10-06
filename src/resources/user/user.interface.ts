import { Document } from 'mongoose';

export default interface User extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm: string;
  role: string;

  isValidPassword(password: string): Promise<Error | boolean>;
}
