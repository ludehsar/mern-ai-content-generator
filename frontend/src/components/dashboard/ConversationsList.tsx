import { useNavigate } from "react-router";
import type { Conversation } from "@/types/conversation";
import { ContentType } from "@/types/conversation";

interface ConversationsListProps {
  conversations: Conversation[];
}

export default function ConversationsList({
  conversations,
}: ConversationsListProps) {
  const navigate = useNavigate();

  const contentTypeOptions = [
    { label: "Blog Post Outline", value: ContentType.BLOG_POST_OUTLINE },
    { label: "Product Description", value: ContentType.PRODUCT_DESCRIPTION },
    { label: "Social Media Caption", value: ContentType.SOCIAL_MEDIA_CAPTION },
  ];

  if (conversations.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        No conversations yet. Generate your first content above.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <button
          key={conversation._id}
          onClick={() => navigate(`/conversations/${conversation._id}`)}
          className="w-full rounded-lg border bg-card p-4 text-left shadow-sm transition-colors hover:bg-accent"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{conversation.title}</h3>
            <span className="text-sm text-muted-foreground">
              {contentTypeOptions.find(
                (opt) => opt.value === conversation.contentType
              )?.label || conversation.contentType}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
