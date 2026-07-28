export type ZoneLivraison = {
  nom: string;
  prix: number;
};

export type Boutique = {
  id: string;
  user_id: string;
  nom: string;
  logo_url: string | null;
  zones_livraison: ZoneLivraison[];
  created_at: string;
  updated_at: string;
};

export type Produit = {
  id: string;
  boutique_id: string;
  photo_url: string | null;
  nom: string;
  prix: number;
  description: string | null;
  variantes: string | null;
  en_rupture: boolean;
  created_at: string;
  updated_at: string;
};

export type ModePaiement = "Wave" | "Orange Money" | "Especes" | "Autre";

export type Vente = {
  id: string;
  boutique_id: string;
  numero: string;

  produit_nom: string;
  produit_prix: number;
  produit_photo_url: string | null;
  produit_description: string | null;
  produit_variantes: string | null;
  quantite: number;

  zone_livraison_nom: string;
  zone_livraison_prix: number;

  client_nom: string;
  client_telephone: string;
  mode_paiement: ModePaiement;

  montant_produits: number;
  montant_livraison: number;
  montant_total: number;

  created_at: string;
};
