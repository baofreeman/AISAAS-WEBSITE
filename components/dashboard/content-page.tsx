import React from "react";
import Empty from "@/components/empty";

interface ContentPageProps<T> {
  getItemById: (id: string) => Promise<T | null>;
  getMessagesById: (id: string, page: number) => Promise<any[]>;
  params: { id: string };
  ContentComponent: React.ComponentType<{ initialMessages: any[] }>;
  title: string;
  emptyLabel?: string;
}

const ContentPage = async <T,>({
  getItemById,
  getMessagesById,
  params,
  ContentComponent,
  title = "Freeman AI",
  emptyLabel = "No data available",
}: ContentPageProps<T>) => {
  const { id } = params;
  const item = await getItemById(id);
  const messages = await getMessagesById(id, 0);

  if (!item) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <Empty label={emptyLabel} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative flex flex-1 overflow-auto">
      <ContentComponent initialMessages={messages} />
    </div>
  );
};

export default ContentPage;
