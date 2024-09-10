import React from "react";
import { getPhotos } from "@/lib/photos";
import MediaList from "@/components/dashboard/media-list";

const PhotoPage = async () => {
  const photos = await getPhotos();

  return (
    <MediaList
      items={photos}
      itemType="photos"
      getItemLink={(id) => `/photo/${id}`}
    />
  );
};

export default PhotoPage;