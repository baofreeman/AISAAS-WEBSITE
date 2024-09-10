import { getPhotoById, getPhotoMessages } from "@/lib/photos";
import PhotoContent from "./photo-content";
import ContentPage from "@/components/dashboard/content-page";

const PhotoIdPage = ({ params }: { params: { photoId: string } }) => {
  return (
    <ContentPage
      getItemById={getPhotoById}
      getMessagesById={getPhotoMessages}
      params={{ id: params.photoId }}
      ContentComponent={PhotoContent}
      emptyLabel="No photo conversation"
      title="Photo"
    />
  );
};

export default PhotoIdPage;
