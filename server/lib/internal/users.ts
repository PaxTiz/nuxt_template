import type { Paginated, UserResource, Users } from '#shared/types';
import { and, count, desc, eq, like, or, SQL } from 'drizzle-orm';
import { users } from '~~/server/database';
import { Service } from '../service';

export class UsersService extends Service {
  async findById(id: string): Promise<UserResource | null> {
    const user = await this.database.query.users.findFirst({
      columns: {
        password: false,
        validationCode: false,
      },
      where: eq(users.id, id),
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isEnabled: user.isEnabled,
      role: user.role,
      address: {
        line1: user.addressLine1,
        line2: user.addressLine2,
        postalCode: user.addressPostalCode,
        city: user.addressCity,
      },
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }

  async update(id: string, body: Users['Update']) {
    const [response] = await this.database
      .update(users)
      .set({
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        addressLine1: body.address.line1,
        addressLine2: body.address.line2,
        addressPostalCode: body.address.postalCode,
        addressCity: body.address.city,
        role: body.role,
        isEnabled: body.isEnabled,
      })
      .where(eq(users.id, id));

    if (response.affectedRows !== 1) {
      throw createError({ statusCode: 404 });
    }
  }

  async search(query: Users['Search']): Promise<Paginated<UserResource>> {
    const conditions: Array<SQL | undefined> = [];
    if (query.isEnabled !== undefined) {
      conditions.push(eq(users.isEnabled, query.isEnabled));
    }
    if (query.query !== undefined) {
      conditions.push(
        or(
          like(users.firstname, `%${query.query}%`),
          like(users.lastname, `%${query.query}%`),
          like(users.email, `%${query.query}%`),
        ),
      );
    }

    const conditionsGroup = and(...conditions);
    const total = await this.database
      .select({ count: count(users.id) })
      .from(users)
      .where(conditionsGroup)
      .limit(1);

    const usersList = await this.database
      .select()
      .from(users)
      .where(conditionsGroup)
      .orderBy(desc(users.isEnabled), desc(users.role))
      .offset((query.page - 1) * query.perPage)
      .limit(query.perPage);

    return {
      total: total[0]!.count,
      items: usersList.map((user) => ({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isEnabled: user.isEnabled,
        role: user.role,
        address: {
          line1: user.addressLine1,
          line2: user.addressLine2,
          postalCode: user.addressPostalCode,
          city: user.addressCity,
        },
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      })),
    };
  }
}
