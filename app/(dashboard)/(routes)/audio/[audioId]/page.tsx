import { getAudioById, getAudioMessages } from "@/lib/audio";
import AudioContent from "./audio-content";
import ContentPage from "@/components/dashboard/content-page";

const AudioIdPage = ({ params }: { params: { audioId: string } }) => {
  return (
    <ContentPage
      getItemById={getAudioById}
      getMessagesById={getAudioMessages}
      params={{ id: params.audioId }}
      ContentComponent={AudioContent}
      emptyLabel="No audio conversation"
      title="Audio"
    />
  );
};

export default AudioIdPage;
