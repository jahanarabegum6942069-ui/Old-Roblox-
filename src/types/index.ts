export type AvatarType = 'guest_boy' | 'guest_girl' | 'bacon_hair' | 'noob' | 'rthro';

export type PoseType = 'idle' | 'wave' | 'cheer' | 'jump' | 'dance';

export interface GuestProfile {
  id: string; // e.g. "Guest 1337"
  avatarType: AvatarType;
  role: 'Guest'; // Strictly role = Guest
  guestNumber: number;
  robux: number; // Always 0 for guests!
  badges: string[];
  selectedPose: PoseType;
  phoneVerified?: boolean;
  phoneNumber?: string;
  phoneQuickCode?: string;
}

export type GameCategory = 'all' | 'popular' | 'action' | 'simulation' | 'obby';

export type GameType = 
  | 'fortnite_battle_bus'
  | 'animal_hospital'
  | 'rainbow_obby'
  | 'tilted_box_fight'
  | 'disaster_survival'
  | 'speed_run';

export interface GameItem {
  id: string;
  title: string;
  creator: string;
  category: 'action' | 'simulation' | 'obby';
  playingCount: string;
  rating: number; // Percentage thumbs up (e.g. 96)
  image: string;
  description: string;
  type: GameType;
  featured?: boolean;
  tags: string[];
  serverRegion?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  avatarType: AvatarType;
  role: 'Guest';
  text: string;
  timestamp: string;
  isSelf?: boolean;
}
