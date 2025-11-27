import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { RootState } from "@/store";
import type { User } from "@/types/auth";
import { useSelector, useDispatch } from "react-redux";
import { fetchConversations } from "@/store/slices/conversationSlice";
import type { Conversation } from "@/types/conversation";
import PromptBox from "@/components/dashboard/PromptBox";
import ConversationsList from "@/components/dashboard/ConversationsList";

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector<RootState>(
    (state) => state.auth.user
  ) as User | null;
  const conversations = useSelector<RootState>(
    (state) => state.conversation.conversations
  ) as Conversation[];
  const generateStatus = useSelector<RootState>(
    (state) => state.conversation.generateStatus
  ) as string;
  const currentConversation = useSelector<RootState>(
    (state) => state.conversation.currentConversation
  ) as Conversation | null;

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    if (
      generateStatus === "complete" &&
      currentConversation &&
      currentConversation._id
    ) {
      navigate(`/conversations/${currentConversation._id}`);
    }
  }, [generateStatus, currentConversation, navigate]);

  return (
    <div className="flex min-h-svh flex-col gap-6 bg-muted p-6 md:p-10">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold">AI Content Generation</h1>
        <p className="mb-6 text-muted-foreground">Welcome, {user?.name}</p>

        <PromptBox />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Conversations</h2>
          <ConversationsList conversations={conversations} />
        </div>
      </div>
    </div>
  );
}
