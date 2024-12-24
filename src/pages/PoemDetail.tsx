import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wand2, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { enhancePoem } from "@/lib/huggingface";
import { DeleteAlert } from "@/components/DeleteAlert";
import { EditPoemDialog } from "@/components/EditPoemDialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type Poem = Database["public"]["Tables"]["poems"]["Row"];

export default function PoemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [poem, setPoem] = useState<Poem | null>(null);
  const page = new URLSearchParams(location.search).get("page") || "1";

  // 삭제 알림창과 수정 다이얼로그 상태 관리
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisText, setAnalysisText] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

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
    try {
      if (isAnalyzing) {
        abortControllerRef.current?.abort();
        return;
      }

      setIsAnalyzing(true);
      setAnalysisText("");
      setShowAnalysis(true);

      abortControllerRef.current = new AbortController();

      toast({
        title: "AI 분석 중...",
        description: "실시간으로 분석 내용이 표시됩니다.",
      });

      await enhancePoem(
        poem.content,
        (currentText) => {
          setAnalysisText(currentText);
        },
        abortControllerRef.current.signal
      );

      setIsAnalyzing(false);
      toast({
        title: "AI 분석 완료",
        description: "시 분석이 완료되었습니다.",
      });
    } catch (error) {
      if (error.name === 'AbortError') {
        toast({
          title: "분석 중단",
          description: "시 분석이 중단되었습니다.",
        });
      } else {
        console.error("Error in AI analysis:", error);
        toast({
          title: "에러",
          description: error.message || "AI 분석 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
      setIsAnalyzing(false);
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

  const handleEdit = async (title: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from("poems")
        .update({
          title,
          content,
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

  const handleStopAnalysis = () => {
    abortControllerRef.current?.abort();
    setIsAnalyzing(false);
  };

  const handleReanalyze = () => {
    if (!isAnalyzing) {
      handleAiEdit();
    }
  };

  if (!poem) return null;

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 space-y-8 bg-background text-foreground">
      <div className="flex justify-between items-center mb-8">
        <Button
          variant="outline"
          onClick={() => navigate(`/history?page=${page}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          목록으로
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setEditDialog(true)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            수정
          </Button>
          <Button
            variant="outline"
            onClick={handleAiEdit}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            AI 분석
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteAlert(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            삭제
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-medium break-words">{poem.title}</h1>
        <p className="text-sm text-muted-foreground">
          {format(new Date(poem.created_at), "yyyy년 MM월 dd일 HH:mm:ss")}
        </p>
        <div className="mt-8 whitespace-pre-wrap leading-relaxed break-words">
          {poem.content}
        </div>
      </div>

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
      />

      <Sheet open={showAnalysis} onOpenChange={setShowAnalysis}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] md:w-[600px]">
          <SheetHeader className="space-y-4">
            <SheetTitle>AI 시 분석</SheetTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReanalyze}
                disabled={isAnalyzing}
              >
                재분석
              </Button>
              {isAnalyzing && (
                <Button
                  variant="destructive"
                  onClick={handleStopAnalysis}
                >
                  분석 중지
                </Button>
              )}
            </div>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {isAnalyzing && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            <div className="whitespace-pre-wrap leading-relaxed">
              {analysisText}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}