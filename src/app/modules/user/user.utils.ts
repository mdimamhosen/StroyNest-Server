import { USER_ROLE } from './user.const';
import { User } from './user.model';

const findLastUserId = async () => {
  const lastUser = await User.findOne(
    {
      role: USER_ROLE.user,
    },
    { id: 1, _id: 0 },
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastUser?.id ? lastUser.id.substring(2) : undefined;
};

export const genarateUserId = async () => {
  let currentUserId = (0).toString().padStart(4, '0');
  const lastUserId = await findLastUserId();
  if (lastUserId) {
    currentUserId = (Number(lastUserId) + 1).toString().padStart(4, '0');
  } else {
    currentUserId = (1).toString().padStart(4, '0');
  }

  const userId = `U-${currentUserId}`;
  return userId;
};
