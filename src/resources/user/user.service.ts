import UserModel from '@/resources/user/user.model';
import token from '@/utils/token';

class UserService {
  private user = UserModel;

  /**
   * Register a new user
   */

  /**
   * Attempt to login a user
   */

  public async getAllUsers(): Promise<any> {
    try {
      const users = await this.user.find();
      return users;
    } catch (error) {
      throw new Error('Unable to fetch users');
    }
  }

  public async getUser(id: string): Promise<any> {
    const user = await this.user.findById(id);
    return user;
  }

  public async updateUser(id: string, body: Body): Promise<any> {
    const user = await this.user.findByIdAndUpdate(
      id,
      {
        ...body,
      },
      {
        new: true,
      }
    );
    return user;
  }

  public async deleteUser(id: string): Promise<any> {
    const user = await this.user.findByIdAndDelete(id);
    return user;
  }
}

export default UserService;
