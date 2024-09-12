import React from "react";
import { getAudios } from "@/lib/audio";
import MediaList from "@/components/dashboard/media-list";

export const dynamic = "force-dynamic";

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
