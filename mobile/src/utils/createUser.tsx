// This is an example function for calling the SocialProtocol instance and creating a new user
import {FileUriData, SocialProtocol, User} from '@spling/social-protocol';

export const createUser = async (
  socialProtocol: SocialProtocol,
  nickname: string,
  avatar: FileUriData | null,
  biography: string | null,
  metadata?: any,
) => {
  console.log('Creating new user...');
  const user: User = await socialProtocol.createUser(
    nickname,
    avatar,
    biography,
    metadata,
  );
  console.log('Created new user: ' + user);
  return user;
};
