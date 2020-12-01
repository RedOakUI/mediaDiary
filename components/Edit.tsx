import { Button, Center, DrawerFooter, Spinner } from "@chakra-ui/react";
import { deleteDocument, update } from "@nandorojo/swr-firestore";
import firebase from "firebase/app";
import { useRouter } from "next/router";
import React, { useReducer } from "react";
import { LogReducer } from "../config/logStore";
import { DiaryAdd } from "../config/mediaTypes";
import { useMDDispatch, useMDState } from "../config/store";
import { useAuth } from "../utils/auth";
import Info from "./Info";
import LogFields from "./LogFields";

function Edit(): JSX.Element {
  const { edit, isSaving } = useMDState();
  const mdDispatch = useMDDispatch();
  const { user } = useAuth();
  const router = useRouter();

  let initData = {
    diaryDate: new Date(),
    loggedBefore: false,
    rating: 0,
    artist: "",
    genre: "",
    poster: "",
  };
  if (typeof edit !== "undefined") {
    initData = {
      ...initData,
      ...edit.diary,
      diaryDate: edit.diary.diaryDate.toDate(),
    };
  }

  const [
    { diaryDate, loggedBefore, rating, episodes, poster, seenEpisodes, season },
    dispatch,
  ] = useReducer(LogReducer, initData);

  return (
    <>
      {isSaving ? (
        <Center minH="40vh">
          <Spinner />
        </Center>
      ) : (
        <>
          {typeof edit?.diary !== "undefined" && <Info item={edit.diary} />}
          <LogFields
            dispatch={dispatch}
            type={edit?.diary.type}
            item={{
              diaryDate,
              loggedBefore,
              poster,
              rating,
              episodes,
              season,
              seenEpisodes,
            }}
            isEdit
          />
          <DrawerFooter
            px={0}
            pt={2}
            pb={1}
            mt={2}
            justifyContent="space-between"
          >
            <Button
              onClick={deleteData}
              isLoading={isSaving}
              colorScheme="red"
              variant="outline"
              size="sm"
            >
              Delete
            </Button>
            <Button
              onClick={editData}
              isLoading={isSaving}
              colorScheme="blue"
              size="sm"
              variant="outline"
            >
              Save
            </Button>
          </DrawerFooter>
        </>
      )}
    </>
  );
  function editData() {
    if (
      user !== null &&
      user &&
      user.email !== null &&
      typeof edit !== "undefined"
    ) {
      mdDispatch({ type: "saving" });
      const diaryEdit = createEdit();
      if (diaryEdit) {
        const updatePromise = update(
          `${user.email}/${edit.diaryId}`,
          diaryEdit
        );
        if (updatePromise) {
          updatePromise.then(() => {
            mdDispatch({ type: "saved" });
            return router.push("/home");
          });
        }
      } else {
        console.log("error with diaryEdit");
      }
    } else {
      console.log("user missing");
    }
  }

  function createEdit(): DiaryAdd | false {
    if (typeof edit !== "undefined") {
      const {
        diaryDate: localDiaryDate,
        loggedBefore: localLoggedBefore,
        rating: localRating,
        seenEpisodes: localSeenEpisodes,
        id,
        hasPendingWrites,
        exists,
        __snapshot,
        ...rest
      } = edit.diary;
      let replacedEpisodes = localSeenEpisodes;
      // something here where the "rest" might be overriding this
      if (typeof seenEpisodes !== "undefined") {
        replacedEpisodes = seenEpisodes;
      }
      return {
        diaryDate: firebase.firestore.Timestamp.fromDate(diaryDate),
        loggedBefore,
        rating,
        seenEpisodes: replacedEpisodes,
        ...rest,
      };
    } else {
      return false;
    }
  }

  function deleteData() {
    if (
      typeof edit !== "undefined" &&
      user !== null &&
      user &&
      user.email !== null
    ) {
      mdDispatch({ type: "saving" });
      const deletedPromise = deleteDocument(`${user.email}/${edit.diaryId}`);
      if (deletedPromise) {
        deletedPromise.then(() => {
          mdDispatch({ type: "saved" });
          return router.push("/home");
        });
      } else {
        console.error("delete promise failed");
      }
    } else {
      console.log("error with delete");
    }
  }
}

export default Edit;