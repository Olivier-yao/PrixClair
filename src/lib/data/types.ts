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
