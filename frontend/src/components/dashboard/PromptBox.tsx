import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { generateContent } from "@/store/slices/conversationSlice";
import { ContentType } from "@/types/conversation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function PromptBox() {
  const dispatch = useDispatch();
  const generateStatus = useSelector<RootState>(
    (state) => state.conversation.generateStatus
  ) as string;

  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState<ContentType>(
    ContentType.BLOG_POST_OUTLINE
  );

  const handleGenerate = () => {
    if (prompt.trim().length < 3) {
      return;
    }
    dispatch(
      generateContent({
        prompt: prompt.trim(),
        contentType,
      })
    );
    setPrompt("");
  };

  const contentTypeOptions = [
    { label: "Blog Post Outline", value: ContentType.BLOG_POST_OUTLINE },
    { label: "Product Description", value: ContentType.PRODUCT_DESCRIPTION },
    { label: "Social Media Caption", value: ContentType.SOCIAL_MEDIA_CAPTION },
  ];

  return (
    <div className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-4 space-y-2">
        <Label htmlFor="content-type">Content Type</Label>
        <Select
          value={contentType}
          onValueChange={(value) => setContentType(value as ContentType)}
        >
          <SelectTrigger id="content-type" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {contentTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4 space-y-2">
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea
          id="prompt"
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="w-full"
        />
      </div>

      <Button
        onClick={handleGenerate}
        disabled={prompt.trim().length < 3 || generateStatus === "pending"}
        className="w-full"
      >
        {generateStatus === "pending" ? "Generating..." : "Generate Content"}
      </Button>
    </div>
  );
}
