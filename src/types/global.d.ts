import 'express-session'; // 在单独的d.ts中需要加上这行
import { Role } from 'src/modules/user-rbac/entities/role.entity';

// 扩展下Session中的数据类型
declare module 'express-session' {
  // 利用同名interface会自动合并的特性来扩展Session
  interface Session {
    user: {
      username: string;
    };
  }
}

type LoginUser = {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
};
type UserRBAC = { username: string; roles: Role[] };
// declare global {
//   namespace Express {
//     interface Request {
//       user: LoginUser;
//       userRbac: UserRBAC;
//     }
//   }
// }

declare module 'express' {
  interface Request {
    user: LoginUser;
    userRbac: UserRBAC;
  }
}
