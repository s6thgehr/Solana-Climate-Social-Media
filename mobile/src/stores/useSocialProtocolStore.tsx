import {SocialProtocol} from '@spling/social-protocol';
import {create} from 'zustand';

interface SocialProtocolState {
  socialProtocol: SocialProtocol | null;
  setSocialPotocol: (socialProtocol: SocialProtocol) => void;
}

const useSocialProtocolStore = create<SocialProtocolState>(set => ({
  socialProtocol: null,
  setSocialPotocol: socialProtocol => set({socialProtocol: socialProtocol}),
}));

export default useSocialProtocolStore;
