import { getVideoId, getVideoMessage } from "@/lib/video";
import VideoContent from "./video-content";
import ContentPage from "@/components/dashboard/content-page";

const VideoIdPage = ({ params }: { params: { videoId: string } }) => {
  return (
    <ContentPage
      getItemById={getVideoId}
      getMessagesById={getVideoMessage}
      params={{ id: params.videoId }}
      ContentComponent={VideoContent}
      title="Video"
      emptyLabel="No video conversation"
    />
  );
};

export default VideoIdPage;
