import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Match, Innings, Team, Player, ScoringAction } from '@/types/cricket';

interface MatchState {
  match: Match | null;
  innings: Innings[];
  currentInnings: Innings | null;
}

type MatchAction =
  | { type: 'SET_MATCH'; payload: Match }
  | { type: 'START_INNINGS'; payload: Innings }
  | { type: 'UPDATE_SCORE'; payload: ScoringAction }
  | { type: 'CHANGE_STRIKER' }
  | { type: 'CHANGE_BOWLER'; payload: string }
  | { type: 'NEXT_OVER' }
  | { type: 'END_INNINGS' }
  | { type: 'RESET_MATCH' };

const initialState: MatchState = {
  match: null,
  innings: [],
  currentInnings: null,
};

function matchReducer(state: MatchState, action: MatchAction): MatchState {
  switch (action.type) {
    case 'SET_MATCH':
      return {
        ...state,
        match: action.payload,
      };
    
    case 'START_INNINGS':
      return {
        ...state,
        innings: [...state.innings, action.payload],
        currentInnings: action.payload,
      };
    
    case 'UPDATE_SCORE':
      if (!state.currentInnings) return state;
      
      const updatedInnings = { ...state.currentInnings };
      
      // Handle different scoring actions
      if (action.payload.type === 'runs') {
        updatedInnings.runs += action.payload.runs || 0;
        updatedInnings.balls += 1;
        
        // Update batting stats
        const striker = updatedInnings.battingStats.find(
          stat => stat.playerId === updatedInnings.striker
        );
        if (striker) {
          striker.runs += action.payload.runs || 0;
          striker.balls += 1;
          if (action.payload.runs === 4) striker.fours += 1;
          if (action.payload.runs === 6) striker.sixes += 1;
        }
      }
      
      if (action.payload.type === 'wicket') {
        updatedInnings.wickets += 1;
        updatedInnings.balls += 1;
        
        // Mark batsman as out
        const striker = updatedInnings.battingStats.find(
          stat => stat.playerId === updatedInnings.striker
        );
        if (striker) {
          striker.balls += 1;
          striker.isOut = true;
          striker.howOut = action.payload.howOut;
        }
      }
      
      // Update overs
      if (updatedInnings.balls % 6 === 0 && updatedInnings.balls > 0) {
        updatedInnings.overs = Math.floor(updatedInnings.balls / 6);
      }
      
      return {
        ...state,
        currentInnings: updatedInnings,
        innings: state.innings.map((innings, index) => 
          index === state.innings.length - 1 ? updatedInnings : innings
        ),
      };
    
    case 'CHANGE_STRIKER':
      if (!state.currentInnings) return state;
      
      return {
        ...state,
        currentInnings: {
          ...state.currentInnings,
          striker: state.currentInnings.nonStriker,
          nonStriker: state.currentInnings.striker,
        },
      };
    
    case 'CHANGE_BOWLER':
      if (!state.currentInnings) return state;
      
      return {
        ...state,
        currentInnings: {
          ...state.currentInnings,
          bowler: action.payload,
        },
      };
    
    case 'RESET_MATCH':
      return initialState;
    
    default:
      return state;
  }
}

const MatchContext = createContext<{
  state: MatchState;
  dispatch: React.Dispatch<MatchAction>;
} | null>(null);

export function MatchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(matchReducer, initialState);

  return (
    <MatchContext.Provider value={{ state, dispatch }}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
}