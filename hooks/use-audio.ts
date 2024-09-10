import { useParams } from "next/navigation";
import { useMemo } from "react";

const useAudio = () => {
  const params = useParams();

  const audioId = useMemo(() => {
    if (!params?.audioId) {
      return "";
    }
    return params?.audioId as string;
  }, [params?.audioId]);

  const isOpen = useMemo(() => !!audioId, [audioId]);

  return useMemo(
    () => ({
      isOpen,
      audioId,
    }),
    [isOpen, audioId]
  );
};

export default useAudio;
