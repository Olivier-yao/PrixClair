export function formatFcfa(prix: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(prix)} FCFA`;
}
