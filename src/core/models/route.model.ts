import { Reducer } from "@reduxjs/toolkit";

export interface IRoute {
  /** React route path */
  path: string;

  /** Lazy loaded component */
  component: CompModuleImport;

  /** Route which can access only after login */
  private?: boolean;

  /**
   * Child Routes
   *
   * @link https://reactrouter.com/en/main/components/outlet
   */
  children?: IRoute[];
}

export type CompModule = {
  default: any;
  reducer?: { [key: string]: Reducer<any> };
};
export type CompModuleImport = () => Promise<CompModule>;
