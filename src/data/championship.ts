export interface Team {
  id: string;
  name: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  logo: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  stadium: string;
}

export const teams: Team[] = [
  { id: "1", name: "Palmeiras", points: 25, played: 10, won: 8, drawn: 1, lost: 1, goalsFor: 20, goalsAgainst: 8, logo: "https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg" },
  { id: "2", name: "Flamengo", points: 23, played: 10, won: 7, drawn: 2, lost: 1, goalsFor: 22, goalsAgainst: 10, logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_brazil_logo.svg" },
  { id: "3", name: "Botafogo", points: 21, played: 10, won: 6, drawn: 3, lost: 1, goalsFor: 18, goalsAgainst: 9, logo: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Botafogo_de_Futebol_e_Regatas_logo.svg" },
  { id: "4", name: "São Paulo", points: 19, played: 10, won: 6, drawn: 1, lost: 3, goalsFor: 15, goalsAgainst: 11, logo: "https://upload.wikimedia.org/wikipedia/pt/4/4b/SaoPauloFC.png" },
  { id: "5", name: "Cruzeiro", points: 18, played: 10, won: 5, drawn: 3, lost: 2, goalsFor: 14, goalsAgainst: 10, logo: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Cruzeiro_Esporte_Clube_logo.svg" },
  { id: "6", name: "Internacional", points: 17, played: 10, won: 5, drawn: 2, lost: 3, goalsFor: 12, goalsAgainst: 9, logo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Escudo_do_Sport_Club_Internacional.svg" },
  { id: "7", name: "Bahia", points: 16, played: 10, won: 5, drawn: 1, lost: 4, goalsFor: 16, goalsAgainst: 14, logo: "https://upload.wikimedia.org/wikipedia/pt/4/41/Esporte_Clube_Bahia_logo.svg" },
  { id: "8", name: "Athletico-PR", points: 15, played: 10, won: 4, drawn: 3, lost: 3, goalsFor: 13, goalsAgainst: 12, logo: "https://upload.wikimedia.org/wikipedia/pt/c/c7/Club_Athletico_Paranaense_2019.png" },
  { id: "9", name: "Fortaleza", points: 14, played: 10, won: 4, drawn: 2, lost: 4, goalsFor: 11, goalsAgainst: 12, logo: "https://upload.wikimedia.org/wikipedia/pt/4/40/Fortaleza_Esporte_Clube_logo.svg" },
  { id: "10", name: "Vasco", points: 12, played: 10, won: 3, drawn: 3, lost: 4, goalsFor: 10, goalsAgainst: 15, logo: "https://upload.wikimedia.org/wikipedia/pt/a/ac/CRVascoDaGama.png" },
];

export const nextMatches: Match[] = [
  { id: "m1", homeTeam: "Palmeiras", awayTeam: "Flamengo", date: "12/04/2026", time: "16:00", stadium: "Allianz Parque" },
  { id: "m2", homeTeam: "Botafogo", awayTeam: "Vasco", date: "12/04/2026", time: "18:30", stadium: "Engenhão" },
  { id: "m3", homeTeam: "São Paulo", awayTeam: "Cruzeiro", date: "13/04/2026", time: "20:00", stadium: "Morumbi" },
  { id: "m4", homeTeam: "Internacional", awayTeam: "Bahia", date: "13/04/2026", time: "21:30", stadium: "Beira-Rio" },
];
