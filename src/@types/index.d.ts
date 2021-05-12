declare module "*.svg" {
  const val: string;
  export default val;
}

declare module "*.png" {
  const val: string;
  export default val;
}

declare module "*.jpg" {
  const val: string;
  export default val;
}
declare module "*.gif" {
  const val: string;
  export default val;
}
declare let ga: (p: string, page: string, pathname?: any) => void;
