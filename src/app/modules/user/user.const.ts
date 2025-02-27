export const USER_ROLE = {
  admin: 'admin',
  user: 'user',
} as const;

export type TUserRoles = keyof typeof USER_ROLE;
