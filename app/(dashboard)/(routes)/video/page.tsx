import React from "react";
import { getVideos } from "@/lib/video";
import MediaList from "@/components/dashboard/media-list";

const VideoPage = async () => {
  const videos = await getVideos();

  return (
    <MediaList
      items={videos}
      itemType="videos"
      getItemLink={(id) => `/video/${id}`}
    />
  );
};

export default VideoPage;
