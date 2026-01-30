export interface User {
  username: string;
  name: string;
  role: 'admin' | 'customer';
  // password is in json but we might not need to type it in the session user object
}
