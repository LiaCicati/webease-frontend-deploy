export interface User {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  userType?: string;
  accountStatus?: string;
  isTokenExpired?: boolean;
}
