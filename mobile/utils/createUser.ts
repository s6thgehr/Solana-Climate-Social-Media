// This is an example function for calling the SocialProtocol instance and creating a new user
import { useSocialProtocol } from "./socialProtocolProvider";
import { FileUriData, User } from "@spling/social-protocol";

export const createNewUser = async (
  nickname: string,
  avatar: FileUriData | null,
  biography: string | null,
  metadata: any | null
) => {
  const { SocialProtocol } = useSocialProtocol();

  if (!SocialProtocol) {
    alert("Please connect your wallet first!");
    return;
  }

  const user: User = await SocialProtocol?.createUser(
    nickname,
    avatar,
    biography,
    metadata
  );
  console.log("Created new user: " + user);
};
