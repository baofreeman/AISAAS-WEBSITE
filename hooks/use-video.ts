import { useParams } from "next/navigation";
import { useMemo } from "react";

const useVideo = () => {
  const params = useParams();

  const videoId = useMemo(() => {
    if (!params?.videoId) {
      return "";
    }
    return params?.videoId as string;
  }, [params?.videoId]);

  const isOpen = useMemo(() => !!videoId, [videoId]);

  return useMemo(
    () => ({
      isOpen,
      videoId,
    }),
    [isOpen, videoId]
  );
};

export default useVideo;
