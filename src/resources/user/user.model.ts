import { Schema, model, SchemaType } from 'mongoose';
import bcrypt from 'bcrypt';
import User from '@/resources/user/user.interface';
import validator from 'validator';
import crypto from 'crypto';

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First Name is required!'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last Name is required!'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'PasswordConfirm is required'],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    activationLink: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  if (!(this.password === this.passwordConfirm)) {
    throw Error('Password and Confirm password did not match');
  }

  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  this.passwordConfirm = '';

  next();
});

UserSchema.methods.createAccountActivationLink = function (): string {
  const activationToken = crypto.randomBytes(32).toString('hex');
  // console.log(activationToken);
  this.activationLink = crypto
    .createHash('sha256')
    .update(activationToken)
    .digest('hex');
  // console.log({ activationToken }, this.activationLink);
  return activationToken;
};

UserSchema.methods.isValidPassword = async function (
  password: string
): Promise<Error | boolean> {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  console.log(resetToken);
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

export default model<User>('User', UserSchema);
