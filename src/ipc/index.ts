import { registerAttributHandlers } from "./attribut";
import { registerBonCommandeHandlers } from "./bonCommande";
import { registerBonReceptionHandlers } from "./bonReception";
import { registerBrandHandlers } from "./brand";
import { registerCategoryHandlers } from "./categories";
import { registerClientHandlers } from "./client";
import { registerCouleurHandlers } from "./couleur";
import { registerProduitHandlers } from "./produit";
import { registerFournisseurHandlers } from "./suppliers";
import { registerTaxHandlers } from "./tax";
import { registerUserHandlers } from "./user";

export function registerIpcHandlers() {
  registerCategoryHandlers();
  registerBrandHandlers();
  registerAttributHandlers();
  registerTaxHandlers();
  registerBonCommandeHandlers();
  registerBonReceptionHandlers();
  registerClientHandlers();
  registerCouleurHandlers();
  registerProduitHandlers();
  registerFournisseurHandlers();
  registerUserHandlers();
}
