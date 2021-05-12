import { AxiosInstance } from "axios";
import { RouteComponentProps } from "react-router";

declare global {
  export const $ajax: AxiosInstance;
  export const $host: string;
  export const $log: boolean;

  export interface IProps extends RouteComponentProps {
    [key: string]: any
  }
  export interface IComponentProps {
    [key: string]: any
  }
}
