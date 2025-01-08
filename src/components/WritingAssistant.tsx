import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, MinimizeIcon } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { analyzePoetry } from "@/lib/poetry-functions";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function WritingAssistant() {
  const [isOpen, setIsOpen] = useState(false);  // 이 줄 추가
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `안녕하세요! Poetry Assistant입니다. 시 분석을 도와드리겠습니다.
먼저 분석하고 싶은 시의 내용을 입력해주세요.`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState("poem"); // "poem" | "word" | "season"

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setMessages(prev => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsLoading(true);

    try {
      let response = "";

      switch (currentStep) {
        case "poem":
          response = await analyzePoetry(input, "rhyme");
          setCurrentStep("word");
          response += "\n\n분석하고 싶은 특정 단어가 있다면 입력해주세요.";
          break;

        case "word":
          response = await analyzePoetry(input, "word");
          setCurrentStep("season");
          response += "\n\n마지막으로, 계절감 분석을 위해 봄/여름/가을/겨울 중 하나를 입력해주세요.";
          break;

        case "season":
          response = await analyzePoetry(input, "season");
          setCurrentStep("poem");
          response += "\n\n분석이 완료되었습니다. 새로운 시를 분석하고 싶으시다면 시 내용을 입력해주세요.";
          break;
      }

      setMessages(prev => [...prev, { role: "assistant", content: response }]);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "죄송합니다. 처리 중 오류가 발생했습니다."
      }]);
      setCurrentStep("poem"); // 오류 발생시 처음으로 돌아가기
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed right-8 bottom-8 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 bg-primary/90 hover:bg-primary shadow-lg"
        >
          <MessageCircle className="h-8 w-8" />
        </Button>
      ) : (
        <div className="w-[400px] h-[600px] bg-card rounded-lg shadow-xl flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium text-lg">Poetry Assistant</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <MinimizeIcon className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"
                    }`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-4 text-base ${message.role === "assistant"
                      ? "bg-muted"
                      : "bg-primary text-primary-foreground"
                      }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-6 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="flex-1 text-base"
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="px-6"
                disabled={isLoading}
              >
                전송
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}