import React, { Suspense } from "react";
import type { MediaSelected } from "../../config/types";
import useDataFetch from "../../utils/useDataFetch";
import type { DataFetchMDb, DataFetchSpotify } from "../../utils/useDataFetch";
import ContentMDb from "../content/ContentMDb";
import ContentSpotify from "../content/ContentSpotify";
import MdSpinner from "../md/MdSpinner";

interface Props {
  selected: MediaSelected;
  token: string | undefined;
}
function InfoBody({ selected, token }: Props): JSX.Element {
  return (
    <Suspense fallback={<MdSpinner />}>
      <InfoSuspense selected={selected} token={token} />
    </Suspense>
  );
}

function InfoSuspense({ selected, token }: Props) {
  const { type, artistId, mediaId, season } = selected;
  const { data, error, isLoading } = useDataFetch({
    type,
    isSuspense: true,
    firstId: mediaId,
    secondId: artistId,
    token,
    season,
  });

  if (error) {
    return <div>something happened</div>;
  }

  if (data && !isLoading) {
    return type === "album" ? (
      <ContentSpotify
        artistInfo={(data as DataFetchSpotify)[1]}
        albumInfo={(data as DataFetchSpotify)[0]}
      />
    ) : (
      <ContentMDb type={type} data={data as DataFetchMDb} />
    );
  }
  return null;
}

export default InfoBody;
