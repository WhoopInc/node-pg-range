declare module "pg-range" {
  import { default as StRange } from "strange";

  // Must use any here as we cannot use a namespace as a type
  export function install(pg: any): void;

  type Endpoint = Date | number | string | { valueOf(): string | number };

  export class Range<T extends Endpoint> extends StRange<T> {
    toPostgres(prepare: any): string;
  }
}
