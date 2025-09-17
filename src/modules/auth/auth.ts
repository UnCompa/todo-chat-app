import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { openAPI, organization } from 'better-auth/plugins';
import { Env } from 'src/commons/config/envs.config.js';
import { PrismaClient } from 'src/generated/prisma/index.js';
import { getActiveOrganization, sendOrganizationInvitation } from './auth.service.js';
import { ac, admin, member, owner } from './permissions.js';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const organization = (await getActiveOrganization(session.userId)) || { id: null };
          return {
            data: {
              ...session,
              activeOrganizationId: organization.id,
            },
          };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    organization({
      async sendInvitationEmail(data) {
        const domain = Env.BASE_DOMAIN;
        const inviteLink = `${domain}/${data.id}`;
        console.info(inviteLink);
        sendOrganizationInvitation({
          email: data.email,
          invitedByUsername: data.inviter.user.name,
          invitedByEmail: data.inviter.user.email,
          teamName: data.organization.name,
          inviteLink,
        });
      },
      ac: ac,
      roles: {
        owner,
        admin,
        member,
      },
    }),
    openAPI(),
  ],
});
