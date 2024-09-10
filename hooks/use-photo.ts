import { useParams } from "next/navigation";
import { useMemo } from "react";

const usePhoto = () => {
  const params = useParams();

  const photoId = useMemo(() => {
    if (!params?.photoId) {
      return "";
    }
    return params?.photoId as string;
  }, [params?.photoId]);

  const isOpen = useMemo(() => !!photoId, [photoId]);

  return useMemo(
    () => ({
      isOpen,
      photoId,
    }),
    [isOpen, photoId]
  );
};

export default usePhoto;
