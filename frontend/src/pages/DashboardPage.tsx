import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { RootState } from "@/store";
import type { User } from "@/types/auth";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchConversations,
  clearPollingState,
} from "@/store/slices/conversationSlice";
import { logoutUser } from "@/store/slices/authSlice";
import type { Conversation } from "@/types/conversation";
import PromptBox from "@/components/dashboard/PromptBox";
import ConversationsList from "@/components/dashboard/ConversationsList";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

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
      const conversationId = currentConversation._id;
      dispatch(clearPollingState());
      navigate(`/conversations/${conversationId}`, { replace: false });
    }
  }, [generateStatus, currentConversation, navigate, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="flex min-h-svh flex-col gap-6 bg-muted p-6 md:p-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Content Generation</h1>
            <p className="mt-2 text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>

        <PromptBox />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Conversations</h2>
          <ConversationsList conversations={conversations} />
        </div>
      </div>
    </div>
  );
}
