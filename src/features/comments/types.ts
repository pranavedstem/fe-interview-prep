export type CommentStatus = 'sending' | 'failed' | 'confirmed';

export interface Comment {
  clientId: string;
  author: string;
  body: string;
  status: CommentStatus;
  serverId: string | null;
  createdAt: number;
}

export interface ServerComment {
  serverId: string;
  clientId: string;
  author: string;
  body: string;
}
