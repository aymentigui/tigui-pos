import { initDB } from "../connection";
import {
  createBonReceptionQuery,
  getBonReceptionByIdQuery,
  getAllBonReceptionsQuery,
  updateBonReceptionQuery,
  deleteBonReceptionQuery,
  createBonReceptionProduitQuery,
  deleteProduitsByBonReceptionIdQuery,
} from "./bonReception.queries";

// Créer un bon de réception avec ses produits
export const createBonReception = async (
  bonCommandeId: number | null,
  livreurNom: string | null,
  dateReception: string,
  produits: Array<{
    produitId: number | null;
    variationId: number | null;
    quantite: number;
  }>
) => {
  const db = await initDB();

  // Insérer le bon de réception
  const result = await db.run(createBonReceptionQuery, [
    bonCommandeId,
    livreurNom,
    dateReception,
  ]);
  const bonReceptionId = result.lastID;

  // Insérer les produits liés
  for (const p of produits) {
    await db.run(createBonReceptionProduitQuery, [
      bonReceptionId,
      p.produitId,
      p.variationId,
      p.quantite,
    ]);
  }

  return bonReceptionId;
};

// Récupérer un bon de réception par ID
export const getBonReceptionById = async (id: number) => {
  const db = await initDB();
  const bon = await db.get(getBonReceptionByIdQuery, [id]);

  if (!bon) return null;

  const produits = await db.all(
    `SELECT * FROM bon_reception_produits WHERE bon_reception_id = ?`,
    [id]
  );

  return { ...bon, produits };
};

// Récupérer tous les bons de réception
export const getAllBonReceptions = async () => {
  const db = await initDB();
  const bons = await db.all(getAllBonReceptionsQuery);

  // Enrichir chaque bon avec ses produits
  const bonsWithDetails = await Promise.all(
    bons.map(async (bon: any) => {
      const produits = await db.all(
        `SELECT * FROM bon_reception_produits WHERE bon_reception_id = ?`,
        [bon.id]
      );
      return { ...bon, produits };
    })
  );

  return bonsWithDetails;
};

// Mettre à jour un bon de réception (supprime/recrée ses produits)
export const updateBonReception = async (
  id: number,
  bonCommandeId: number | null,
  livreurNom: string | null,
  dateReception: string,
  produits: Array<{
    produitId: number | null;
    variationId: number | null;
    quantite: number;
  }>
) => {
  const db = await initDB();

  // Mettre à jour le bon
  const result = await db.run(updateBonReceptionQuery, [
    bonCommandeId,
    livreurNom,
    dateReception,
    id,
  ]);

  // Supprimer anciens produits
  await db.run(deleteProduitsByBonReceptionIdQuery, [id]);

  // Réinsérer produits
  for (const p of produits) {
    await db.run(createBonReceptionProduitQuery, [
      id,
      p.produitId,
      p.variationId,
      p.quantite,
    ]);
  }

  return result.changes > 0;
};

// Supprimer un bon de réception (produits supprimés en cascade)
export const deleteBonReception = async (id: number) => {
  const db = await initDB();
  const result = await db.run(deleteBonReceptionQuery, [id]);
  return result.changes > 0;
};
