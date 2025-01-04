import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
// import { enhancePoem } from "@/lib/huggingface";
import { ColorPicker } from "@/components/ColorPicker";
import { CARD_BACKGROUNDS } from "@/lib/constants";

type Poem = Database["public"]["Tables"]["poems"]["Row"];

export function PoemEditor() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [poemId, setPoemId] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>(Object.values(CARD_BACKGROUNDS)[0]);

  // 임시 저장 함수
  const saveTemporaryPoem = useCallback(() => {
    if (title || content) {
      const tempPoem = {
        title,
        content,
        backgroundColor,
        timestamp: new Date().getTime()
      };
      localStorage.setItem("tempPoem", JSON.stringify(tempPoem));
    }
  }, [title, content, backgroundColor]);

  // 페이지 로드 시 임시 저장된 시 불러오기
  useEffect(() => {
    const savedPoem = localStorage.getItem("tempPoem");
    if (savedPoem) {
      const parsedPoem = JSON.parse(savedPoem);
      // 24시간 이내의 임시 저장된 시만 복원
      if (new Date().getTime() - parsedPoem.timestamp < 24 * 60 * 60 * 1000) {
        setTitle(parsedPoem.title);
        setContent(parsedPoem.content);
        setBackgroundColor(parsedPoem.backgroundColor || Object.values(CARD_BACKGROUNDS)[0]);
      }
    }
  }, []);

  // 5초마다 자동 저장
  useEffect(() => {
    const autoSaveTimer = setInterval(saveTemporaryPoem, 5000);
    return () => clearInterval(autoSaveTimer);
  }, [saveTemporaryPoem]);

  const handleSave = async () => {
    if (!title || !content) {
      toast({
        title: "Missing fields",
        description: "Please fill in both title and content",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && poemId) {
        const { error } = await supabase
          .from("poems")
          .update({
            title,
            content,
            background_color: backgroundColor,
            updated_at: new Date().toISOString()
          })
          .eq("id", poemId);
        if (error) throw error;
        toast({
          title: "Poem updated",
          description: "Your poem has been updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("poems")
          .insert([{
            title,
            content,
            background_color: backgroundColor
          }]);
        if (error) throw error;
        toast({
          title: "Poem saved",
          description: "Your poem has been saved successfully",
        });
      }

      // 임시 저장 데이터 삭제
      localStorage.removeItem("tempPoem");

      // 입력 필드 초기화
      setTitle("");
      setContent("");
      setBackgroundColor(Object.values(CARD_BACKGROUNDS)[0]);

      // 히스토리 페이지로 이동
      navigate('/history');
    } catch (error) {
      console.error("Error saving poem:", error);
      toast({
        title: "Error",
        description: "Failed to save poem. Please try again.",
        variant: "destructive",
      });
    }
  };

  /* const handleAIEdit = async () => {
    if (!content) {
      toast({
        title: "내용 없음",
        description: "수정할 시 내용을 먼저 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "AI 수정 중...",
        description: "잠시만 기다려주세요.",
      });

      const enhancedContent = await enhancePoem(content);
      setContent(enhancedContent);

      toast({
        title: "AI 수정 완료",
        description: "시가 AI에 의해 수정되었습니다.",
      });
    } catch (error) {
      console.error("Error in AI edit:", error);
      toast({
        title: "에러",
        description: error.message || "AI 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };
  */

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto space-y-4"
    >
      <div className="space-y-2 bg-gray-900/70 p-3 rounded-lg">
        <Input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold bg-transparent border-gray-900/50 focus:border-gray-900/70 text-white placeholder:text-gray-300 placeholder:opacity-70"
        />
      </div>
      <div className="space-y-2 bg-gray-900/70 p-3 rounded-lg">
        <Textarea
          placeholder="Write your poem"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[250px] text-xl font-medium leading-relaxed bg-transparent border-gray-900/50 focus:border-gray-900/70 resize-none text-white placeholder:text-gray-300 placeholder:opacity-70"
        />
      </div>

      <div className="space-y-6 bg-gray-900/70 p-6 rounded-lg">
        <div className="flex flex-col gap-4">
          {/* Card Color 선택 - 가로 배치 */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-white min-w-[80px]">Card Color:</label>
            <div className="flex-1">
              <ColorPicker
                value={backgroundColor}
                onChange={setBackgroundColor}
              />
            </div>
          </div>

          <div className="flex gap-2">
            {/* 
  <Button
    onClick={handleAIEdit}
    variant="outline"
    className="border-primary/50 hover:border-primary bg-transparent"
  >
    AI Edit
  </Button>
  */}
            {/* Save 버튼 */}
            <Button
              onClick={handleSave}
              className="w-full text-primary-foreground bg-primary/80 hover:bg-primary"
            >
              {isEditing ? "Update Poem" : "Save Poem"}
            </Button>
          </div>
        </div>
      </div>

    </motion.div >
  );
}