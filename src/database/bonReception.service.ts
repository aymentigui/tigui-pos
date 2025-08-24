import { initDB } from "./connection";

// ===============================
// CREATE BON DE RÉCEPTION
// ===============================
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
  const result = await db.run(
    `INSERT INTO bons_reception (bon_commande_id, livreur_nom, date_reception)
     VALUES (?, ?, ?)`,
    [bonCommandeId, livreurNom, dateReception]
  );
  const bonReceptionId = result.lastID;

  // Insérer les produits liés
  for (const p of produits) {
    await db.run(
      `INSERT INTO bon_reception_produits (bon_reception_id, produit_id, variation_id, quantite)
       VALUES (?, ?, ?, ?)`,
      [bonReceptionId, p.produitId, p.variationId, p.quantite]
    );
  }

  return bonReceptionId;
};

// ===============================
// GET BON DE RÉCEPTION BY ID
// ===============================
export const getBonReceptionById = async (id: number) => {
  const db = await initDB();
  const bon = await db.get(
    `SELECT * FROM bons_reception WHERE id = ?`,
    [id]
  );

  if (!bon) return null;

  const produits = await db.all(
    `SELECT * FROM bon_reception_produits WHERE bon_reception_id = ?`,
    [id]
  );

  return { ...bon, produits };
};

// ===============================
// GET ALL BONS DE RÉCEPTION
// ===============================
export const getAllBonReceptions = async () => {
  const db = await initDB();
  const bons = await db.all(`SELECT * FROM bons_reception`);

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

// ===============================
// UPDATE BON DE RÉCEPTION
// ===============================
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
  const result = await db.run(
    `UPDATE bons_reception
     SET bon_commande_id = ?, livreur_nom = ?, date_reception = ?
     WHERE id = ?`,
    [bonCommandeId, livreurNom, dateReception, id]
  );

  // Supprimer anciens produits
  await db.run(
    `DELETE FROM bon_reception_produits WHERE bon_reception_id = ?`,
    [id]
  );

  // Réinsérer produits
  for (const p of produits) {
    await db.run(
      `INSERT INTO bon_reception_produits (bon_reception_id, produit_id, variation_id, quantite)
       VALUES (?, ?, ?, ?)`,
      [id, p.produitId, p.variationId, p.quantite]
    );
  }

  return result.changes > 0;
};

// ===============================
// DELETE BON DE RÉCEPTION
// ===============================
export const deleteBonReception = async (id: number) => {
  const db = await initDB();
  const result = await db.run(
    `DELETE FROM bons_reception WHERE id = ?`,
    [id]
  );
  return result.changes > 0;
};
