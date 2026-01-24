export type User = {
  id: string;
  email: string;
  displayName: string | null;
};

export type SavedAccount = {
  id: string;
  email: string;
  displayName: string | null;
  lastUsed: string; 
};
