export interface Participant {
  id: string;
  name: string;
  position: number;
  previousPosition: number;
  totalPoints: number;
  ap: number;
  variation: 'up' | 'down' | 'same';
  history: number[];
  avatar?: string;
}

// 14 participantes em ordem alfabética com pontuações zeradas conforme solicitado
export const participants: Participant[] = [
  {
    id: "4",
    name: "AROUCA",
    position: 1,
    previousPosition: 1,
    totalPoints: 0,
    ap: 0,
    variation: "same",
    history: [0]
  },
  {
    id: "9",
    name: "CAIO",
    position: 2,
    previousPosition: 2,
    totalPoints: 0,
    ap: 0,
    variation: "same",
    history: [0]
  },
  {
    id: "12",
    name: "FELIPE",
    position: 3,
    previousPosition: 3,
    totalPoints: 0,
    ap: 0,
    variation: "same",
    history: [0]
  },
  {
    id: "13",
    name: "ISRAELE",
    position: 4,
    previousPosition: 4,
    totalPoints: 0,
    ap: 0,
    variation: "same",
    history: [0]
  },
  {
    id: "11",
    name: "JEFINHO",
    position: 5,
    previousPosition: 5,
    totalPoints: 0,
    ap: 0,
    variation: "same",
    history: [0]
  },
  {
    id: "1",
    name: "JEFFERSON",
    position: 6,
    previousPosition: 6,
    totalPoints: 0,
    ap: 0,
    variation: "same",
    history: [0]
  },
  {
    id: "14",
    name: "JEYSI",
    position: 7,
    previousPosition: 7,
    totalPoints: 0,
    ap: 0,
    variation: "same",
    history: [0]
  },
  {
    id: "6",
    name: "JÚNIOR",
    position: 8,
    previousPosition: 8,
    totalPoints: 0,
    ap: 0,
    variation: "same",
    history: [0]
  },
  {
    id: "7",
    name: "LC BAIXINHO",
    position: 9,
    previousPosition: 9,
    totalPoints: 0,
    ap: 0,
    variation: "same",
    history: [0]
  },
  {
    id: "3",
    name: "LEANDRO",
    position: 10,
    previousPosition: 10,
    totalPoints: 0,
    ap: 0,
    variation: "same",
    history: [0]
  },
  {
    id: "2",
    name: "LUAN",
    position: 11,
    previousPosition: 11,
    totalPoints: 0,
    ap: 0,
    variation: "same",
    history: [0]
  },
  {
    id: "8",
    name: "RAFLA OLIVEIRA",
    position: 12,
    previousPosition: 12,
    totalPoints: 0,
    ap: 0,
    variation: "same",
    history: [0]
  },
  {
    id: "10",
    name: "WALLACE",
    position: 13,
    previousPosition: 13,
    totalPoints: 0,
    ap: 0,
    variation: "same",
    history: [0]
  },
  {
    id: "5",
    name: "WENDEL",
    position: 14,
    previousPosition: 14,
    totalPoints: 0,
    ap: 0,
    variation: "same",
    history: [0]
  }
];
