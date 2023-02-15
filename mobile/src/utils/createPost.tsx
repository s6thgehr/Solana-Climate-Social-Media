// This is an example function for calling the SocialProtocol instance and creating a new post
import {FileUriData, Post, SocialProtocol} from '@spling/social-protocol';

export const createPost = async (
  socialProtocol: SocialProtocol,
  title: string | null,
  text: string | null,
  files: FileUriData[] | null,
  tag: string | null,
  metadata: any | null,
) => {
  console.log('Creating new post');
  const post: Post = await socialProtocol.createPost(
    1,
    title,
    text,
    files,
    tag,
    metadata,
  );

  console.log('Created new post: ' + post);
  return post;
};
