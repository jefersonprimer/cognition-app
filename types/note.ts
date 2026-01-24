export type Note = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  createdAt: string;
  is_deleted: boolean;
  deleted_at: string | null;
  is_favorite: boolean;
  parentId?: string | null;
};

