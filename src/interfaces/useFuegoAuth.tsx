import dayjs from "dayjs";
import { useEffect } from "react";
import { useMDDispatch, useMDState } from "../config/store";
import type { FuegoValidatedUser } from "../config/types";
import { fuegoDb } from "./fuego";
import useFuegoUser from "./useFuegoUser";

interface FuegoAuth {
  /** User not in our system */
  userNotValid: boolean;
  /** User has no preferences, route to NewUser */
  userNoPreference: boolean;
  /** Validating user, show loaders */
  userValidating: boolean;
  /** User is valid, but might not have Preference */
  userValid: FuegoValidatedUser | false;
  /** User is valid and has preference, show MediaDiary */
  userValidHasPreference: FuegoValidatedUser | false;
}

/**
 * A hook to provide a consistent way of getting necessary information during our
 * authentication process. Also to provide the spotify token based on userPref
 */
function useFuegoAuth(): FuegoAuth {
  const { user, isValidating } = useFuegoUser();
  const { spotifyToken, spotifyTimeOut, preference } = useMDState();
  const dispatch = useMDDispatch();

  // if we have a user but no preferences then get it!
  useEffect(() => {
    if (user && preference === null) {
      fuegoDb
        .collection("users")
        .doc(user.uid)
        .get()
        .then((data) => {
          dispatch({
            type: "state",
            payload: {
              key: "preference",
              value: data.get("preference") ?? false,
            },
          });
        });
    }
  }, [dispatch, user, preference]);

  // If the user chooses to record Albums, use the spotify API
  useEffect(() => {
    if (
      preference &&
      typeof preference.mediaTypes["album"] !== "undefined" &&
      preference.mediaTypes["album"]
    ) {
      const now = dayjs();
      if (!spotifyToken || !spotifyTimeOut || now.isAfter(spotifyTimeOut)) {
        const newTimeout = now.add(1, "hour");

        fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
            Authorization:
              "Basic " +
              Buffer.from(
                process.env.NEXT_PUBLIC_SPOTIFY_CLIENT +
                  ":" +
                  process.env.NEXT_PUBLIC_SPOTIFY_SECRET
              ).toString("base64"),
          },
          body: "grant_type=client_credentials",
        })
          .then((r) => r.json())
          .then((spotifyResponse) => {
            dispatch({
              type: "spotifyToken",
              payload: {
                spotifyToken: spotifyResponse.access_token,
                spotifyTimeOut: newTimeout,
              },
            });
          })
          .catch((e) => console.error("[SPOTIFY]: failed to refresh token", e));
      }
    }
  }, [dispatch, spotifyToken, spotifyTimeOut, preference]);

  // Validating requires two states, either we're waiting for SpotifyToken or just waiting for
  // userpreferences to validate
  let userValidating = true;
  if (preference !== null && preference) {
    userValidating = user === null && !spotifyToken;
  } else {
    userValidating = user === null && preference === null;
  }

  return {
    userNotValid: !user && user !== null,
    userNoPreference: user !== null && preference !== null && !preference,
    userValidating: userValidating || isValidating,
    userValid: user && user !== null ? user : false,
    userValidHasPreference:
      user && user !== null && preference !== null && preference ? user : false,
  };
}

export default useFuegoAuth;