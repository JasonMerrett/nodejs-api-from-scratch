import UserModel from '@/resources/user/user.model';
import token from '@/utils/token';

class AuthService {
  private user = UserModel;

  public async login(email: string, password: string): Promise<any | Error> {
    try {
      const user = await this.user.findOne({ email }).select('+password');

      if (!user) {
        throw new Error('Unable to find user with that email address');
      }

      if (await user.isValidPassword(password)) {
        return { token: token.createToken(user), user };
      } else {
        throw new Error(`Password doesn't match`);
      }
    } catch (error: any) {
      console.log('error', error);
      throw new Error(error.message || 'Unable to login');
    }
  }

  public async signUp(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    passwordConfirm: string
  ): Promise<any> {
    const user = await this.user.create({
      email,
      password,
      firstName,
      lastName,
      passwordConfirm,
    });

    const accessToken = token.createToken(user);

    const activationToken = user.createAccountActivationLink();

    return { user, token: accessToken, activationToken };
  }
}

export default AuthService;
