import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";

interface UserMessageProps {
  children: React.ReactNode;
}

const UserMessage: React.FC<UserMessageProps> = ({ children }) => {
  const user = useCurrentUser();
  return (
    <article className="w-full focus-visited:outline-2">
      <div
        className={cn(
          "text-base py-[18px] px-3 w-full m-auto",
          "md:px-5",
          "lg:px-1",
          "xl:px-5"
        )}
      >
        <div
          className={cn(
            "mx-auto flex flex-1 gap-4 text-base",
            "md:gap-5 md:max-w-3xl",
            "lg:gap-6 lg:max-w-[40rem]",
            "xl:max-w-[48rem]"
          )}
        >
          <div className="group relative flex w-full min-w-0 flex-col">
            <div className="flex-col gap-1 md:gap-3">
              <div className="flex max-w-full flex-col flex-grow">
                <div className="flex w-full gap-1 justify-end">
                  <div className="relative max-w-[70%] rounded-3xl px-5 py-2.5 bg-secondary">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 flex flex-col relative items-end">
            <Avatar className="rounded-full w-8 h-8 flex items-center justify-center">
              <AvatarImage src={user?.image ?? ""} />
              <AvatarFallback>{user?.name}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </article>
  );
};

export default UserMessage;
