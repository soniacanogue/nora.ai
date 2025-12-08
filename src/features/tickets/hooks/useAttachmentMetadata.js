import { useQuery } from "@tanstack/react-query";
import { getAttachmentMetadata } from "../api/ticketsApi";

export const useAttachmentMetadata = (fileId, options = {}) => {
  const { enabled = true, initialData } = options;

  return useQuery({
    queryKey: ["attachmentMetadata", fileId],
    queryFn: () => getAttachmentMetadata(fileId),
    enabled: Boolean(fileId) && enabled,
    initialData,
    staleTime: 5 * 60 * 1000,
  });
};
