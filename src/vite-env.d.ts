/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

declare module '*.svg?component' {
  import type { FunctionComponent, SVGProps } from 'react'
  const Component: FunctionComponent<SVGProps<SVGSVGElement>>
  export default Component
}