import Link from "next/link";
import moment from "moment-timezone";

import CreateNewConversation from "@/components/dashboard/create-new-conversation";

interface MediaItem {
  id: string;
  createdAt: Date;
}

interface MediaListProps {
  items: MediaItem[];
  itemType: string;
  getItemLink: (id: string) => string;
}

const MediaList: React.FC<MediaListProps> = ({
  items,
  itemType,
  getItemLink,
}) => {
  if (!items || items.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p>No {itemType} available.</p>
        <div className="mt-6">
          <CreateNewConversation />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col lg:px-20">
      <div className="px-8 py-2">
        <div className="p-4 flex justify-end">
          <CreateNewConversation />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex flex-col items-center gap-4">
          {items.map((item) => {
            const userTimezone = moment.tz.guess();
            const formattedDate = moment(item.createdAt)
              .tz(userTimezone)
              .format("HH:mm DD-MM-YYYY");
            return (
              <Link
                href={getItemLink(item.id)}
                key={item.id}
                className="border hover:border-gray-500 dark:hover:border-white p-4 rounded-lg w-full max-w-md"
              >
                <h1 className="cursor-pointer text-center">
                  Created at ${formattedDate}
                </h1>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MediaList;
