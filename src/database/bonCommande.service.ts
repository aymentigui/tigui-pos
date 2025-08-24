import { initDB } from "./connection";

// ===============================
// CREATE BON DE COMMANDE
// ===============================
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
  const result = await db.run(
    `INSERT INTO bons_commande (fournisseur_id, date_commande, reduction_type, reduction_valeur)
     VALUES (?, ?, ?, ?)`,
    [fournisseurId, dateCommande, reductionType, reductionValeur]
  );
  const bonId = result.lastID;

  // Insérer les produits
  for (const p of produits) {
    await db.run(
      `INSERT INTO bon_commande_produits (bon_id, produit_id, variation_id, quantite, prix_achat, prix_achat_ttc)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [bonId, p.produitId, p.variationId, p.quantite, p.prixAchat, p.prixAchatTtc]
    );
  }

  // Insérer les frais
  for (const f of frais) {
    await db.run(
      `INSERT INTO bon_commande_frais (bon_id, nom, montant) VALUES (?, ?, ?)`,
      [bonId, f.nom, f.montant]
    );
  }

  return bonId;
};

// ===============================
// GET BON DE COMMANDE BY ID
// ===============================
export const getBonCommandeById = async (id: number) => {
  const db = await initDB();
  const bon = await db.get(`SELECT * FROM bons_commande WHERE id = ?`, [id]);

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

// ===============================
// GET ALL BONS DE COMMANDE
// ===============================
export const getAllBonCommandes = async () => {
  const db = await initDB();
  const bons = await db.all(`SELECT * FROM bons_commande`);

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

// ===============================
// UPDATE BON DE COMMANDE
// ===============================
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

  // Update bon
  await db.run(
    `UPDATE bons_commande
     SET fournisseur_id = ?, date_commande = ?, reduction_type = ?, reduction_valeur = ?
     WHERE id = ?`,
    [fournisseurId, dateCommande, reductionType, reductionValeur, id]
  );

  // Supprimer anciens produits/frais
  await db.run(`DELETE FROM bon_commande_produits WHERE bon_id = ?`, [id]);
  await db.run(`DELETE FROM bon_commande_frais WHERE bon_id = ?`, [id]);

  // Réinsérer produits
  for (const p of produits) {
    await db.run(
      `INSERT INTO bon_commande_produits (bon_id, produit_id, variation_id, quantite, prix_achat, prix_achat_ttc)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, p.produitId, p.variationId, p.quantite, p.prixAchat, p.prixAchatTtc]
    );
  }

  // Réinsérer frais
  for (const f of frais) {
    await db.run(
      `INSERT INTO bon_commande_frais (bon_id, nom, montant) VALUES (?, ?, ?)`,
      [id, f.nom, f.montant]
    );
  }

  return true;
};

// ===============================
// DELETE BON DE COMMANDE
// ===============================
export const deleteBonCommande = async (id: number) => {
  const db = await initDB();
  const result = await db.run(`DELETE FROM bons_commande WHERE id = ?`, [id]);
  return result.changes > 0;
};
