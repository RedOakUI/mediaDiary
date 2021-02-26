import { createContext, useContext } from "react";
import type { FilterBookmarkState, FilterState } from "../types/typesFilters";
import type { MediaDiaryWithId, MediaSelected } from "../types/typesMedia";
import type { UserFuegoPref } from "../types/typesUser";

export interface MDState {
  preference: UserFuegoPref;
  isSaving?: boolean;
  view?: "search" | "log" | "edit" | "day" | "md" | "activity" | "info";
  selected?: MediaSelected;
  edit?: MediaDiaryWithId;
  diaryFilters: FilterState;
  bookmarkFilters: FilterBookmarkState;
}

export type MDActions =
  | {
      type: "log" | "info" | "selected";
      payload: MDState["selected"];
    }
  | {
      type: "edit";
      payload: MDState["edit"];
    }
  | {
      type: "view";
      payload: MDState["view"];
    }
  | {
      type: "day" | "savedEdit";
      payload: MDState["edit"];
    }
  | {
      type: "savedPreference";
      payload: MDState["preference"];
    }
  | {
      type: "saved" | "saving" | "dayClose";
    }
  | {
      type: "filter";
      payload: FilterState;
    }
  | {
      type: "state";
      payload: {
        key: keyof MDState;
        value: unknown;
      };
    };

export function Reducer(state: MDState, actions: MDActions): MDState {
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
        view: "md",
        diaryFilters: actions.payload,
        // mediaType: actions.payload.mediaType,
        // rating: actions.payload.rating,
        // diaryYear: actions.payload.diaryYear,
        // releasedDecade: actions.payload.releasedDecade,
        // loggedBefore: actions.payload.loggedBefore,
        // genre: actions.payload.genre,
      };
    }
    case "saving": {
      return {
        ...state,
        isSaving: true,
      };
    }
    case "savedEdit": {
      return {
        ...state,
        isSaving: false,
        view: "day",
        edit: actions.payload,
      };
    }
    case "savedPreference": {
      return {
        ...state,
        isSaving: false,
        preference: actions.payload,
      };
    }
    case "dayClose":
    case "saved": {
      return {
        ...state,
        isSaving: false,
        view: "md",
        edit: undefined,
      };
    }
    case "view": {
      return {
        ...state,
        view: actions.payload,
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
    case "info": {
      return {
        ...state,
        selected: actions.payload,
        view: "info",
        edit: undefined,
      };
    }
    case "selected": {
      return {
        ...state,
        selected: actions.payload,
      };
    }
    case "day": {
      return {
        ...state,
        view: "day",
        selected: undefined,
        edit: actions.payload,
      };
    }
    case "edit": {
      return {
        ...state,
        view: "edit",
      };
    }
    default:
      return state;
  }
}

export const ContextState = createContext<MDState>({
  preference: null,
  diaryFilters: {
    genre: null,
    loggedBefore: null,
    mediaType: null,
    rating: null,
    diaryYear: null,
    releasedDecade: null,
    releasedYear: null,
  },
  bookmarkFilters: {
    addedDate: null,
    genre: null,
    mediaType: null,
    releasedDecade: null,
    releasedYear: null,
  },
});

export const ContextDispatch = createContext<(props: MDActions) => void>(
  () => null
);

export function useMDState(): MDState {
  return useContext(ContextState);
}
export function useMDDispatch(): (props: MDActions) => void {
  return useContext(ContextDispatch);
}
