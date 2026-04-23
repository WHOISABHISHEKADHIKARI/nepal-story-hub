import { Route as rootRouteImport } from './routes/__root';
import { Route as LoginRouteImport } from './routes/login';
import { Route as DashboardRouteImport } from './routes/dashboard';
import { Route as ContactRouteImport } from './routes/contact';
import { Route as CategoriesRouteImport } from './routes/categories';
import { Route as BlogRouteImport } from './routes/blog';
import { Route as BecomeContributorRouteImport } from './routes/become-contributor';
import { Route as AdminRouteImport } from './routes/admin';
import { Route as AboutRouteImport } from './routes/about';
import { Route as IndexRouteImport } from './routes/index';
import { Route as AdminIndexRouteImport } from './routes/admin.index';
import { Route as DashboardNewRouteImport } from './routes/dashboard.new';
import { Route as CategoriesSlugRouteImport } from './routes/categories.$slug';
import { Route as BlogSlugRouteImport } from './routes/blog.$slug';
import { Route as AdminReviewRouteImport } from './routes/admin.review';
import { Route as AdminPostsRouteImport } from './routes/admin.posts';
import { Route as AdminContributorsRouteImport } from './routes/admin.contributors';
import { Route as AdminCategoriesRouteImport } from './routes/admin.categories';
import { Route as DashboardEditIdRouteImport } from './routes/dashboard.edit.$id';
declare const LoginRoute: any;
declare const DashboardRoute: any;
declare const ContactRoute: any;
declare const CategoriesRoute: any;
declare const BlogRoute: any;
declare const BecomeContributorRoute: any;
declare const AdminRoute: any;
declare const AboutRoute: any;
declare const IndexRoute: any;
declare const AdminIndexRoute: any;
declare const DashboardNewRoute: any;
declare const CategoriesSlugRoute: any;
declare const BlogSlugRoute: any;
declare const AdminReviewRoute: any;
declare const AdminPostsRoute: any;
declare const AdminContributorsRoute: any;
declare const AdminCategoriesRoute: any;
declare const DashboardEditIdRoute: any;
export interface FileRoutesByFullPath {
    '/': typeof IndexRoute;
    '/about': typeof AboutRoute;
    '/admin': typeof AdminRouteWithChildren;
    '/become-contributor': typeof BecomeContributorRoute;
    '/blog': typeof BlogRouteWithChildren;
    '/categories': typeof CategoriesRouteWithChildren;
    '/contact': typeof ContactRoute;
    '/dashboard': typeof DashboardRouteWithChildren;
    '/login': typeof LoginRoute;
    '/admin/categories': typeof AdminCategoriesRoute;
    '/admin/contributors': typeof AdminContributorsRoute;
    '/admin/posts': typeof AdminPostsRoute;
    '/admin/review': typeof AdminReviewRoute;
    '/blog/$slug': typeof BlogSlugRoute;
    '/categories/$slug': typeof CategoriesSlugRoute;
    '/dashboard/new': typeof DashboardNewRoute;
    '/admin/': typeof AdminIndexRoute;
    '/dashboard/edit/$id': typeof DashboardEditIdRoute;
}
export interface FileRoutesByTo {
    '/': typeof IndexRoute;
    '/about': typeof AboutRoute;
    '/become-contributor': typeof BecomeContributorRoute;
    '/blog': typeof BlogRouteWithChildren;
    '/categories': typeof CategoriesRouteWithChildren;
    '/contact': typeof ContactRoute;
    '/dashboard': typeof DashboardRouteWithChildren;
    '/login': typeof LoginRoute;
    '/admin/categories': typeof AdminCategoriesRoute;
    '/admin/contributors': typeof AdminContributorsRoute;
    '/admin/posts': typeof AdminPostsRoute;
    '/admin/review': typeof AdminReviewRoute;
    '/blog/$slug': typeof BlogSlugRoute;
    '/categories/$slug': typeof CategoriesSlugRoute;
    '/dashboard/new': typeof DashboardNewRoute;
    '/admin': typeof AdminIndexRoute;
    '/dashboard/edit/$id': typeof DashboardEditIdRoute;
}
export interface FileRoutesById {
    __root__: typeof rootRouteImport;
    '/': typeof IndexRoute;
    '/about': typeof AboutRoute;
    '/admin': typeof AdminRouteWithChildren;
    '/become-contributor': typeof BecomeContributorRoute;
    '/blog': typeof BlogRouteWithChildren;
    '/categories': typeof CategoriesRouteWithChildren;
    '/contact': typeof ContactRoute;
    '/dashboard': typeof DashboardRouteWithChildren;
    '/login': typeof LoginRoute;
    '/admin/categories': typeof AdminCategoriesRoute;
    '/admin/contributors': typeof AdminContributorsRoute;
    '/admin/posts': typeof AdminPostsRoute;
    '/admin/review': typeof AdminReviewRoute;
    '/blog/$slug': typeof BlogSlugRoute;
    '/categories/$slug': typeof CategoriesSlugRoute;
    '/dashboard/new': typeof DashboardNewRoute;
    '/admin/': typeof AdminIndexRoute;
    '/dashboard/edit/$id': typeof DashboardEditIdRoute;
}
export interface FileRouteTypes {
    fileRoutesByFullPath: FileRoutesByFullPath;
    fullPaths: '/' | '/about' | '/admin' | '/become-contributor' | '/blog' | '/categories' | '/contact' | '/dashboard' | '/login' | '/admin/categories' | '/admin/contributors' | '/admin/posts' | '/admin/review' | '/blog/$slug' | '/categories/$slug' | '/dashboard/new' | '/admin/' | '/dashboard/edit/$id';
    fileRoutesByTo: FileRoutesByTo;
    to: '/' | '/about' | '/become-contributor' | '/blog' | '/categories' | '/contact' | '/dashboard' | '/login' | '/admin/categories' | '/admin/contributors' | '/admin/posts' | '/admin/review' | '/blog/$slug' | '/categories/$slug' | '/dashboard/new' | '/admin' | '/dashboard/edit/$id';
    id: '__root__' | '/' | '/about' | '/admin' | '/become-contributor' | '/blog' | '/categories' | '/contact' | '/dashboard' | '/login' | '/admin/categories' | '/admin/contributors' | '/admin/posts' | '/admin/review' | '/blog/$slug' | '/categories/$slug' | '/dashboard/new' | '/admin/' | '/dashboard/edit/$id';
    fileRoutesById: FileRoutesById;
}
export interface RootRouteChildren {
    IndexRoute: typeof IndexRoute;
    AboutRoute: typeof AboutRoute;
    AdminRoute: typeof AdminRouteWithChildren;
    BecomeContributorRoute: typeof BecomeContributorRoute;
    BlogRoute: typeof BlogRouteWithChildren;
    CategoriesRoute: typeof CategoriesRouteWithChildren;
    ContactRoute: typeof ContactRoute;
    DashboardRoute: typeof DashboardRouteWithChildren;
    LoginRoute: typeof LoginRoute;
}
declare module '@tanstack/react-router' {
    interface FileRoutesByPath {
        '/login': {
            id: '/login';
            path: '/login';
            fullPath: '/login';
            preLoaderRoute: typeof LoginRouteImport;
            parentRoute: typeof rootRouteImport;
        };
        '/dashboard': {
            id: '/dashboard';
            path: '/dashboard';
            fullPath: '/dashboard';
            preLoaderRoute: typeof DashboardRouteImport;
            parentRoute: typeof rootRouteImport;
        };
        '/contact': {
            id: '/contact';
            path: '/contact';
            fullPath: '/contact';
            preLoaderRoute: typeof ContactRouteImport;
            parentRoute: typeof rootRouteImport;
        };
        '/categories': {
            id: '/categories';
            path: '/categories';
            fullPath: '/categories';
            preLoaderRoute: typeof CategoriesRouteImport;
            parentRoute: typeof rootRouteImport;
        };
        '/blog': {
            id: '/blog';
            path: '/blog';
            fullPath: '/blog';
            preLoaderRoute: typeof BlogRouteImport;
            parentRoute: typeof rootRouteImport;
        };
        '/become-contributor': {
            id: '/become-contributor';
            path: '/become-contributor';
            fullPath: '/become-contributor';
            preLoaderRoute: typeof BecomeContributorRouteImport;
            parentRoute: typeof rootRouteImport;
        };
        '/admin': {
            id: '/admin';
            path: '/admin';
            fullPath: '/admin';
            preLoaderRoute: typeof AdminRouteImport;
            parentRoute: typeof rootRouteImport;
        };
        '/about': {
            id: '/about';
            path: '/about';
            fullPath: '/about';
            preLoaderRoute: typeof AboutRouteImport;
            parentRoute: typeof rootRouteImport;
        };
        '/': {
            id: '/';
            path: '/';
            fullPath: '/';
            preLoaderRoute: typeof IndexRouteImport;
            parentRoute: typeof rootRouteImport;
        };
        '/admin/': {
            id: '/admin/';
            path: '/';
            fullPath: '/admin/';
            preLoaderRoute: typeof AdminIndexRouteImport;
            parentRoute: typeof AdminRoute;
        };
        '/dashboard/new': {
            id: '/dashboard/new';
            path: '/new';
            fullPath: '/dashboard/new';
            preLoaderRoute: typeof DashboardNewRouteImport;
            parentRoute: typeof DashboardRoute;
        };
        '/categories/$slug': {
            id: '/categories/$slug';
            path: '/$slug';
            fullPath: '/categories/$slug';
            preLoaderRoute: typeof CategoriesSlugRouteImport;
            parentRoute: typeof CategoriesRoute;
        };
        '/blog/$slug': {
            id: '/blog/$slug';
            path: '/$slug';
            fullPath: '/blog/$slug';
            preLoaderRoute: typeof BlogSlugRouteImport;
            parentRoute: typeof BlogRoute;
        };
        '/admin/review': {
            id: '/admin/review';
            path: '/review';
            fullPath: '/admin/review';
            preLoaderRoute: typeof AdminReviewRouteImport;
            parentRoute: typeof AdminRoute;
        };
        '/admin/posts': {
            id: '/admin/posts';
            path: '/posts';
            fullPath: '/admin/posts';
            preLoaderRoute: typeof AdminPostsRouteImport;
            parentRoute: typeof AdminRoute;
        };
        '/admin/contributors': {
            id: '/admin/contributors';
            path: '/contributors';
            fullPath: '/admin/contributors';
            preLoaderRoute: typeof AdminContributorsRouteImport;
            parentRoute: typeof AdminRoute;
        };
        '/admin/categories': {
            id: '/admin/categories';
            path: '/categories';
            fullPath: '/admin/categories';
            preLoaderRoute: typeof AdminCategoriesRouteImport;
            parentRoute: typeof AdminRoute;
        };
        '/dashboard/edit/$id': {
            id: '/dashboard/edit/$id';
            path: '/edit/$id';
            fullPath: '/dashboard/edit/$id';
            preLoaderRoute: typeof DashboardEditIdRouteImport;
            parentRoute: typeof DashboardRoute;
        };
    }
}
declare const AdminRouteWithChildren: any;
declare const BlogRouteWithChildren: any;
declare const CategoriesRouteWithChildren: any;
declare const DashboardRouteWithChildren: any;
export declare const routeTree: any;
export {};
