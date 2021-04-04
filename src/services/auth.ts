import { Service, Container } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser, IUserInputDTO } from '../models/User';
import winston from 'winston';

@Service()
export default class AuthService {
  private userModel: Models.UserModel;
  private logger: winston.Logger;

  constructor() {
    this.userModel = Container.get('userModel');
    this.logger = Container.get('logger');
  }

  public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {
    try {
      if (await this.userModel.findOne({ email: userInputDTO.email })) {
        throw new Error('Email already in use');
      }
      if (await this.userModel.findOne({ name: userInputDTO.name })) {
        throw new Error('Username already in use');
      }
      const salt = randomBytes(32);

      this.logger.silly('Hashing password');
      const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
      this.logger.silly('Creating user db record');
      const userRecord = await this.userModel.create({
        ...userInputDTO,
        salt: salt.toString('hex'),
        password: hashedPassword,
        role: undefined, // ? Do we really need to do this here? No other way to stop TS complaining?
      });
      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      if (!userRecord) {
        throw new Error('User cannot be created');
      }
      this.logger.silly('Sending welcome email');

      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      return { user: user as IUser, token };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async SignIn(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const userRecord = await this.userModel.findOne({ email });
    if (!userRecord) {
      throw new Error('User not registered');
    }
    this.logger.silly('Checking password');
    const validPassword = await argon2.verify(userRecord.password, password);
    if (validPassword) {
      this.logger.silly('Password is valid!');
      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      return { user: user as IUser, token };
    } else {
      throw new Error('Invalid Password');
    }
  }

  private generateToken(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);


    this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        _id: user._id, // We are gonna use this in the middleware 'isAuth'
        role: user.role,
        name: user.name,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret,
    );
  }
}