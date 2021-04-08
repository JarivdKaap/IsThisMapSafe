
import { IUserModel, IUser } from '../models/User';

declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser;
    }
  }

  namespace Models {
    export type UserModel = IUserModel;
  }
}