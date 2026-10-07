import type { ComponentType } from 'react';
import HomePage from '@/pages/HomePage';
import CartPage from '@/pages/CartPage';
import FeedPage from '@/pages/FeedPage';
import PostDetailPage from '@/pages/PostDetailPage';
import KanbanPage from '@/pages/KanbanPage';
import DashboardPage from '@/pages/DashboardPage';
import CommentsPage from '@/pages/CommentsPage';

export interface AppRoute {
  /** URL path, used by <Route> and <NavLink>. */
  path: string;
  /** Label shown in the top navigation. */
  label: string;
  /** The question number this route ships for, or null for the home page. */
  question: number | null;
  /** The feature branch this route is built on. */
  branch?: string;
  hidden?: boolean;
  element: ComponentType;
}

/**
 * Single source of truth for the app's pages. The nav bar and the router are both
 * generated from this list, so adding a feature route means editing one array.
 */
export const routes: AppRoute[] = [
  { path: '/', label: 'Home', question: null, element: HomePage },
  { path: '/cart', label: 'Cart', question: 1, branch: 'feature/q1-cart', element: CartPage },
  { path: '/feed', label: 'Feed', question: 2, branch: 'feature/q2-feed', element: FeedPage },
  {
    path: '/feed/:postId',
    label: 'Feed Post',
    question: 2,
    branch: 'feature/q2-feed',
    hidden: true,
    element: PostDetailPage,
  },
  {
    path: '/kanban',
    label: 'Kanban',
    question: 3,
    branch: 'feature/q3-kanban',
    element: KanbanPage,
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
    question: 4,
    branch: 'feature/q4-dashboard',
    element: DashboardPage,
  },
  {
    path: '/comments',
    label: 'Comments',
    question: 5,
    branch: 'feature/q5-comments',
    element: CommentsPage,
  },
];
