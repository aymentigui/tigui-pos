import { registerBrandHandlers } from "./brand";
import { registerCategoryHandlers } from "./categories";

export function registerIpcHandlers() {
  registerCategoryHandlers();
  registerBrandHandlers();
}
