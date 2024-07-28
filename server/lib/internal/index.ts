import AuthService from './auth';
import ExporterService from './exports';
import DataExtracter from './import/extracter';
import DataImporter from './import/importer';
import UsersService from './users';

export const internal = {
  auth: new AuthService(),

  users: new UsersService(),

  exporter: new ExporterService(),

  extracter: new DataExtracter(),

  importer: new DataImporter(),
};
