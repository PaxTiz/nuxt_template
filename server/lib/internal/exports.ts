import { stringify } from 'csv-stringify/sync';
import { Service } from '../service';

export default class ExporterService extends Service {
  async users() {
    const users = await this.database.query.users.findMany();
    return stringify([
      [
        'id',
        'prenom',
        'nom',
        'email',
        'adresse',
        'complement_adresse',
        'code_postal',
        'ville',
        'role',
        'compte_actif',
      ],
      ...users.map((user) => [
        user.id,
        user.firstname,
        user.lastname,
        user.email,
        user.addressLine1,
        user.addressLine2,
        user.addressPostalCode,
        user.addressCity,
        user.role,
        user.isEnabled ? 'oui' : 'non',
      ]),
    ]);
  }
}
