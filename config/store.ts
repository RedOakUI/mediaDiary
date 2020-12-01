import { createContext, useContext } from "react";
import { MediaEdit, MediaSelected, MediaTypes } from "./mediaTypes";

export interface MDState {
  page: number;
  isSaving?: boolean;
  view?: "search" | "log" | "edit";
  selected?: MediaSelected;
  edit?: MediaEdit;
  filterBy: MediaTypes[];
}

type Actions =
  | {
      type: "log";
      payload: MDState["selected"];
    }
  | {
      type: "edit";
      payload: MDState["edit"];
    }
  | {
      type: "saved" | "saving";
    }
  | {
      type: "filter";
      payload: MDState["filterBy"];
    }
  | {
      type: "state";
      payload: {
        key: keyof MDState;
        value: unknown;
      };
    };

export function Reducer(state: MDState, actions: Actions): MDState {
  switch (actions.type) {
    case "state": {
      return {
        ...state,
        [actions.payload.key]: actions.payload.value,
      };
    }
    case "filter": {
      return {
        ...state,
        filterBy: actions.payload,
      };
    }
    case "saving": {
      return {
        ...state,
        isSaving: true,
      };
    }
    case "saved": {
      return {
        ...state,
        isSaving: false,
        view: undefined,
      };
    }
    case "log": {
      return {
        ...state,
        selected: actions.payload,
        view: "log",
        edit: undefined,
      };
    }
    case "edit": {
      return {
        ...state,
        view: "edit",
        edit: actions.payload,
        selected: undefined,
      };
    }
    default:
      return state;
  }
}

export const ContextState = createContext<MDState>({
  page: 1,
  filterBy: ["album", "movie", "tv"],
});

export const ContextDispatch = createContext<(props: Actions) => void>(
  () => null
);

export function useMDState(): MDState {
  return useContext(ContextState);
}
export function useMDDispatch(): (props: Actions) => void {
  return useContext(ContextDispatch);
}
