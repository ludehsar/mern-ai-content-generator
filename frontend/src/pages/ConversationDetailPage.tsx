import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { fetchConversation } from "@/store/slices/conversationSlice";
import type { Conversation, Message } from "@/types/conversation";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ConversationDetailPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentConversation = useSelector<RootState>(
    (state) => state.conversation.currentConversation
  ) as Conversation | null;

  useEffect(() => {
    if (conversationId) {
      dispatch(fetchConversation(conversationId));
    }
  }, [conversationId, dispatch]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  if (!currentConversation) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const assistantMessages = (currentConversation.messages || []).filter(
    (msg: Message) => msg.role === "assistant"
  );
  const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];

  return (
    <div className="flex min-h-svh flex-col gap-6 bg-muted p-6 md:p-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{currentConversation.title}</h1>
        </div>

        {lastAssistantMessage ? (
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{lastAssistantMessage.content}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            No content available yet.
          </div>
        )}
      </div>
    </div>
  );
}
