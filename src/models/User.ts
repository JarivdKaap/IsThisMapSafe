import { Document, Model, model, Types, Schema, Query } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please enter a full name'],
    unique: true,
    index: true,
  },

  email: {
    type: String,
    lowercase: true,
    unique: true,
    index: true,
  },

  password: String,

  salt: String,

  role: {
    type: String,
    default: 'user',
  },
});

interface IUserSchema extends Document {
  name: string;
  email: string;
  password: string;
  salt: string;
  role: string;
}

// Virtuals and methods

interface IUserBase extends IUserSchema {
  // Add virtuals and methods here
}

export interface IUser extends IUserBase {
  // Add reference properties here
}

// Static methods

export interface IUserModel extends Model<IUser> {
  // Add static models here
}

export default model<IUser & IUserModel>('User', UserSchema);

export interface IUserInputDTO {
  name: IUser['name'];
  email: IUser['email'];
  password: IUser['password'];
}