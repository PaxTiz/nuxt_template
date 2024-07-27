import AuthService from './auth';
import ExporterService from './exports';
import UsersService from './users';

export const internal = {
  auth: new AuthService(),

  users: new UsersService(),

  exporter: new ExporterService(),
};
