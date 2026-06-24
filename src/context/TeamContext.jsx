import { createContext, useContext, useReducer, useMemo, useEffect, useCallback } from 'react';
import { INITIAL_BUDGET } from '../data/worldCupData';
import { FORMATIONS, BENCH_SLOTS, POSITION_LIMITS } from '../data/formations';
import { api } from '../lib/api';

const initialState = {
  formation: '4-3-3',
  players:   [],
  captainId: null,
  vcId:      null,
  loaded:    false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FORMATION':
      return { ...state, formation: action.payload };

    case 'ADD_PLAYER': {
      const player = action.payload;
      if (state.players.find(p => p.id === player.id)) return state;
      if (state.players.length >= 15) return state;
      const spent = state.players.reduce((s, p) => s + p.price_fc, 0);
      if (player.price_fc > INITIAL_BUDGET - spent) return state;
      const posCount = state.players.filter(p => p.position === player.position).length;
      if (posCount >= POSITION_LIMITS[player.position]) return state;
      const countryCount = state.players.filter(p => p.country === player.country).length;
      if (countryCount >= 3) return state;
      return { ...state, players: [...state.players, player] };
    }

    case 'REMOVE_PLAYER': {
      const id = action.payload;
      const players = state.players.filter(p => p.id !== id);
      return {
        ...state,
        players,
        captainId: state.captainId === id ? null : state.captainId,
        vcId:      state.vcId      === id ? null : state.vcId,
      };
    }

    case 'SET_CAPTAIN':
      return {
        ...state,
        captainId: action.payload,
        vcId: state.vcId === action.payload ? null : state.vcId,
      };

    case 'SET_VICE_CAPTAIN':
      return {
        ...state,
        vcId: action.payload,
        captainId: state.captainId === action.payload ? null : state.captainId,
      };

    case 'RESET':
      return { ...initialState, loaded: true };

    case 'LOAD_SQUAD':
      return { ...initialState, ...action.payload, loaded: true };

    default:
      return state;
  }
}

const TeamContext = createContext(null);

export function TeamProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load saved squad from server on mount
  useEffect(() => {
    api.get('/squad')
      .then(data => dispatch({ type: 'LOAD_SQUAD', payload: data ?? {} }))
      .catch(() => dispatch({ type: 'LOAD_SQUAD', payload: {} }));
  }, []);

  const saveSquad = useCallback(() => api.put('/squad', {
    formation:  state.formation,
    captainId:  state.captainId,
    vcId:       state.vcId,
    playerIds:  state.players.map(p => p.id),
  }), [state.formation, state.captainId, state.vcId, state.players]);

  const derived = useMemo(() => {
    const { formation, players } = state;
    const slots = (FORMATIONS[formation] || FORMATIONS['4-3-3']).starters;

    const filled = { GK: [], DF: [], MF: [], FW: [] };
    players.forEach(p => { if (filled[p.position]) filled[p.position].push(p); });

    const usedIds = new Set();
    const starters = slots.map(slot => {
      const byPos = filled[slot.pos] || [];
      const p = byPos.find(x => !usedIds.has(x.id));
      if (p) usedIds.add(p.id);
      return { ...slot, player: p || null };
    });

    const bench = BENCH_SLOTS.map(slot => {
      const remaining = players.filter(p => !usedIds.has(p.id));
      const p = slot.pos === 'ANY'
        ? remaining[0]
        : remaining.find(x => x.position === slot.pos);
      if (p) usedIds.add(p.id);
      return { ...slot, player: p || null };
    });

    return { starters, bench };
  }, [state.formation, state.players]);

  const value = {
    ...state,
    ...derived,
    dispatch,
    saveSquad,
    get budget() { return INITIAL_BUDGET - state.players.reduce((s, p) => s + (p.price_fc ?? 0), 0); },
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeam must be used within TeamProvider');
  return ctx;
}
