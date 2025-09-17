import { ResendAdapter } from '@lib/emails/adapters/resend.adapter.js';
import { EmailService } from '@lib/emails/email.service.js';
import { prisma } from '@lib/prisma.js';
import fs from 'fs';
import path from 'path';
import { Env } from 'src/commons/config/envs.config.js';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getActiveOrganization = async (userId: string) => {
  const organization = await prisma.organization.findFirst({
    where: {
      members: {
        some: {
          userId: userId,
        },
      },
    },
  });
  return organization;
};

export const sendOrganizationInvitation = async ({
  email,
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteLink,
}: {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}) => {
  const templatePath = path.resolve(__dirname, '../../lib/emails/templates/sendInvitationOrganization.hbs');

  const source = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(source);

  const html = template({
    email,
    invitedByUsername,
    invitedByEmail,
    teamName,
    inviteLink,
  });

  const service = new EmailService(new ResendAdapter(Env.RESEND_API_KEY));

  await service.send(email, `Invitación a ${teamName} - Saberium`, html);
};
