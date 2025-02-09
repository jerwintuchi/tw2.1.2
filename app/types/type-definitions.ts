import { IconType } from "react-icons";

/*type safety for the routes, used in components/NavLinks/NavLinks.tsx  */
export interface NavLink {
  href: ValidHref;
  label: string;
  icon: IconType;
}

export type ValidHref = `/${string}`;

export type ValidRoutes = "todos" | "photos" | "food" | "pokemon"; // name of the route/endpoint

export type User = { id: string; username: string };  // user from supabase + username from db
