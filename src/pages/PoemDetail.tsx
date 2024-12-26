import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { enhancePoem } from "@/lib/huggingface";
import { DeleteAlert } from "@/components/DeleteAlert";
import { EditPoemDialog } from "@/components/EditPoemDialog";
import { CARD_BACKGROUNDS } from "@/lib/constants";
import { PoemActions } from "@/components/poem-detail/PoemActions";
import { PoemContent } from "@/components/poem-detail/PoemContent";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Database } from "@/integrations/supabase/types";

type Poem = Database["public"]["Tables"]["poems"]["Row"] & {
  background_color?: string;
};

export default function PoemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [poem, setPoem] = useState<Poem | null>(null);
  const page = new URLSearchParams(location.search).get("page") || "1";
  const isMobile = useIsMobile();

  const [deleteAlert, setDeleteAlert] = useState(false);
  const [editDialog, setEditDialog] = useState(false);

  useEffect(() => {
    fetchPoem();
  }, [id]);

  const fetchPoem = async () => {
    try {
      const { data, error } = await supabase
        .from("poems")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setPoem(data);
    } catch (error) {
      console.error("Error fetching poem:", error);
      toast({
        title: "에러",
        description: "시를 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleAiEdit = async () => {
    if (!poem) return;

    try {
      toast({
        title: "AI 수정 중...",
        description: "잠시만 기다려주세요.",
      });

      const enhancedContent = await enhancePoem(poem.content);

      const { data, error } = await supabase
        .from("poems")
        .update({
          content: enhancedContent,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setPoem(data);
      toast({
        title: "AI 수정 완료",
        description: "시가 AI에 의해 수정되었습니다.",
      });
    } catch (error) {
      console.error("Error in AI edit:", error);
      toast({
        title: "에러",
        description: "AI 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("poems")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "삭제 완료",
        description: "시가 성공적으로 삭제되었습니다.",
      });

      navigate(`/history?page=${page}`);
    } catch (error) {
      console.error("Error deleting poem:", error);
      toast({
        title: "에러",
        description: "시를 삭제하는데 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (title: string, content: string, backgroundColor: string) => {
    try {
      const { data, error } = await supabase
        .from("poems")
        .update({
          title,
          content,
          background_color: backgroundColor,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setPoem(data);
      toast({
        title: "수정 완료",
        description: "시가 성공적으로 수정되었습니다.",
      });
    } catch (error) {
      console.error("Error updating poem:", error);
      toast({
        title: "에러",
        description: "시를 수정하는데 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  if (!poem) return null;

  return (
    <div className={`p-6 md:p-8 lg:p-12 space-y-8 bg-background text-foreground ${
      isMobile ? 'min-h-screen overflow-auto' : 'h-screen overflow-hidden'
    }`}>
      <PoemActions
        onBack={() => navigate(`/history?page=${page}`)}
        onEdit={() => setEditDialog(true)}
        onAiEdit={handleAiEdit}
        onDelete={() => setDeleteAlert(true)}
        page={page}
      />

      <PoemContent
        title={poem.title}
        content={poem.content}
        createdAt={poem.created_at}
      />

      <DeleteAlert
        isOpen={deleteAlert}
        onClose={() => setDeleteAlert(false)}
        onConfirm={handleDelete}
        title={poem.title}
      />

      <EditPoemDialog
        isOpen={editDialog}
        onClose={() => setEditDialog(false)}
        onSave={handleEdit}
        initialTitle={poem.title}
        initialContent={poem.content}
        initialBackgroundColor={poem.background_color || Object.values(CARD_BACKGROUNDS)[0]}
      />
    </div>
  );
}