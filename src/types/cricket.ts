export interface Player {
  id: string;
  name: string;
  isPlaying: boolean;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export interface BattingStats {
  playerId: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  howOut?: string;
}

export interface BowlingStats {
  playerId: string;
  overs: number;
  balls: number;
  runs: number;
  wickets: number;
  maidens: number;
}

export interface Match {
  id: string;
  teams: [Team, Team];
  overs: number;
  venue: string;
  tossWinner: string;
  tossDecision: 'bat' | 'bowl';
  battingTeam: number; // 0 or 1
  bowlingTeam: number; // 0 or 1
  currentInnings: number;
  status: 'setup' | 'live' | 'completed';
}

export interface Innings {
  battingTeamId: string;
  bowlingTeamId: string;
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  battingStats: BattingStats[];
  bowlingStats: BowlingStats[];
  striker: string;
  nonStriker: string;
  bowler: string;
  extras: {
    byes: number;
    legByes: number;
    wides: number;
    noBalls: number;
  };
}

export interface Ball {
  type: 'normal' | 'wide' | 'no-ball' | 'bye' | 'leg-bye';
  runs: number;
  isWicket: boolean;
  batsmanOut?: string;
  howOut?: string;
}

export type ScoringAction = {
  type: 'runs' | 'wicket' | 'wide' | 'no-ball' | 'bye' | 'leg-bye';
  runs?: number;
  batsmanOut?: string;
  howOut?: string;
};