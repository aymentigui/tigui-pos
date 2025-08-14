import { initDB } from "../connection";
import {
  createBonCommandeQuery,
  getBonCommandeByIdQuery,
  getAllBonCommandesQuery,
  updateBonCommandeQuery,
  deleteBonCommandeQuery,
  createBonCommandeProduitQuery,
  deleteProduitsByBonIdQuery,
  createBonCommandeFraisQuery,
  deleteFraisByBonIdQuery,
} from "./bonCommande.queries";

// Créer un bon de commande avec ses produits et ses frais
export const createBonCommande = async (
  fournisseurId: number | null,
  dateCommande: string,
  reductionType: string | null,
  reductionValeur: number,
  produits: Array<{
    produitId: number | null;
    variationId: number | null;
    quantite: number;
    prixAchat: number;
    prixAchatTtc: number;
  }>,
  frais: Array<{ nom: string; montant: number }>
) => {
  const db = await initDB();

  // Insérer le bon
  const result = await db.run(createBonCommandeQuery, [
    fournisseurId,
    dateCommande,
    reductionType,
    reductionValeur,
  ]);
  const bonId = result.lastID;

  // Insérer les produits
  for (const p of produits) {
    await db.run(createBonCommandeProduitQuery, [
      bonId,
      p.produitId,
      p.variationId,
      p.quantite,
      p.prixAchat,
      p.prixAchatTtc,
    ]);
  }

  // Insérer les frais
  for (const f of frais) {
    await db.run(createBonCommandeFraisQuery, [bonId, f.nom, f.montant]);
  }

  return bonId;
};

// Récupérer un bon de commande par ID
export const getBonCommandeById = async (id: number) => {
  const db = await initDB();
  const bon = await db.get(getBonCommandeByIdQuery, [id]);

  if (!bon) return null;

  const produits = await db.all(
    `SELECT * FROM bon_commande_produits WHERE bon_id = ?`,
    [id]
  );
  const frais = await db.all(
    `SELECT * FROM bon_commande_frais WHERE bon_id = ?`,
    [id]
  );

  return { ...bon, produits, frais };
};

// Récupérer tous les bons de commande
export const getAllBonCommandes = async () => {
  const db = await initDB();
  const bons = await db.all(getAllBonCommandesQuery);

  // On enrichit chaque bon avec ses produits et frais
  const bonsWithDetails = await Promise.all(
    bons.map(async (bon: any) => {
      const produits = await db.all(
        `SELECT * FROM bon_commande_produits WHERE bon_id = ?`,
        [bon.id]
      );
      const frais = await db.all(
        `SELECT * FROM bon_commande_frais WHERE bon_id = ?`,
        [bon.id]
      );
      return { ...bon, produits, frais };
    })
  );

  return bonsWithDetails;
};

// Mettre à jour un bon de commande (on supprime/recrée produits et frais)
export const updateBonCommande = async (
  id: number,
  fournisseurId: number | null,
  dateCommande: string,
  reductionType: string | null,
  reductionValeur: number,
  produits: Array<{
    produitId: number | null;
    variationId: number | null;
    quantite: number;
    prixAchat: number;
    prixAchatTtc: number;
  }>,
  frais: Array<{ nom: string; montant: number }>
) => {
  const db = await initDB();

  // Mettre à jour le bon
  const result = await db.run(updateBonCommandeQuery, [
    fournisseurId,
    dateCommande,
    reductionType,
    reductionValeur,
    id,
  ]);

  // Supprimer anciens produits/frais
  await db.run(deleteProduitsByBonIdQuery, [id]);
  await db.run(deleteFraisByBonIdQuery, [id]);

  // Réinsérer produits
  for (const p of produits) {
    await db.run(createBonCommandeProduitQuery, [
      id,
      p.produitId,
      p.variationId,
      p.quantite,
      p.prixAchat,
      p.prixAchatTtc,
    ]);
  }

  // Réinsérer frais
  for (const f of frais) {
    await db.run(createBonCommandeFraisQuery, [id, f.nom, f.montant]);
  }

  return result.changes > 0;
};

// Supprimer un bon de commande (produits & frais supprimés en cascade)
export const deleteBonCommande = async (id: number) => {
  const db = await initDB();
  const result = await db.run(deleteBonCommandeQuery, [id]);
  return result.changes > 0;
};
