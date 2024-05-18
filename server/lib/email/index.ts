import { Edge } from 'edge.js';
import { join } from 'node:path';
import { createTransport } from 'nodemailer';
import type { Address } from 'nodemailer/lib/mailer';

export type Email = {
  from?: Address;
  to: string | Address | Array<Address>;
  replyTo?: string | Address | Array<Address>;
  pragmeaHiddenCopy?: true;
  subject: string;
  template: string;
  data?: Record<string, unknown>;
};

const config = useRuntimeConfig();
const transport = createTransport({
  pool: true,
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.username,
    pass: config.email.password,
  },
});

const edge = Edge.create({
  cache: process.env.NUXT_PUBLIC_ENVIRONMENT === 'production',
});
edge.mount(join(process.cwd(), './server/lib/email/templates'));

export const sendEmail = async (data: Email) => {
  if (!config.email.enabled) {
    return Promise.resolve();
  }

  const from = data.from ?? config.email.defaultFrom;
  const htmlContent = await edge.render(data.template, {
    ...data.data,
    applicationName: config.public.applicationName,
  });

  return await transport.sendMail({
    to: data.to,
    subject: data.subject,
    bcc: data.pragmeaHiddenCopy ? 'contact@pragmea.fr' : undefined,
    replyTo: data.replyTo,
    html: htmlContent,
    from,
  });
};
