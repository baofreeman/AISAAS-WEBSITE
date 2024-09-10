import React from "react";
import { getAudios } from "@/lib/audio";
import MediaList from "@/components/dashboard/media-list";

const AudioPage = async () => {
  const audios = await getAudios();

  return (
    <MediaList
      items={audios}
      itemType="audios"
      getItemLink={(id) => `/audio/${id}`}
    />
  );
};

export default AudioPage;
