import { ResponseFilter, ResponseFilterMethods, PlatformContext } from "@tsed/common";
import { Pagination } from "src/models/pagination/Pagination";

@ResponseFilter("application/json")
class PaginationFilter implements ResponseFilterMethods {
  transform(data: unknown, ctx: PlatformContext): any {
    if (ctx.data instanceof Pagination) {// get the unserialized data
      // @ts-ignore
      if (ctx.data.isPaginated) {
        ctx.response.status(206);
      }
    }

    return data;
  }
}