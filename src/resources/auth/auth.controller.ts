import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';
import authenticated from '@/middleware/authenticated.middleware';
import { HTTPCodes } from '@/utils/helpers/response';
import AuthService from './auth.service';
import { sendMail } from '@/utils/helpers/email';

class AuthController implements Controller {
  public path = '/auth';
  public router = Router();
  private UserService = new UserService();
  private AuthService = new AuthService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    // this.router.get(`${this.path}`, authenticated, this.getUsers);

    this.router.post(
      `${this.path}/login`,
      validationMiddleware(validate.login),
      this.login
    );

    this.router.post(
      `${this.path}/signUp`,
      validationMiddleware(validate.signUp),
      this.signUp
    );
  }

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;

      const { user, token } = await this.AuthService.login(email, password);

      user.password = undefined;
      user.passwordConfirm = undefined;

      res.status(HTTPCodes.OK).json({ user, token });
    } catch (error: any) {
      next(new HttpException(HTTPCodes.BAD_REQUEST, error.message));
    }
  };

  private signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { firstName, lastName, passwordConfirm, email, password } =
        req.body;

      const { user, token, activationToken } = await this.AuthService.signUp(
        firstName,
        lastName,
        email,
        password,
        passwordConfirm
      );

      user.password = undefined;
      user.passwordConfirm = undefined;

      let activationURL = `${req.headers.origin}/confirmMail/${activationToken}`;
      const message = `GO to this link to activate your App Account : ${activationURL} .`;

      sendMail({
        email: user.email,
        message,
        subject: 'Your Account Activation Link for Package App !',
        user,
        template: 'signup.ejs',
        url: activationURL,
      });

      res.status(HTTPCodes.CREATED).json({ user, token });
    } catch (error: any) {
      next(new HttpException(HTTPCodes.BAD_REQUEST, error.message));
    }
  };
}

export default AuthController;
