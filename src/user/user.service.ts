import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly users = [
    {
      id: 1,
      username: 'zhangsan',
      password: '123',
    },
    {
      id: 2,
      username: 'lisi',
      password: '456',
    },
    {
      id: 3,
      username: 'wangwu',
      password: '789',
    },
  ];
  async findOne(username: string) {
    await Promise.resolve(1);
    return this.users.find((user) => user.username === username);
  }
}
