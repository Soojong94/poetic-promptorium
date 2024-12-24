import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PoemCard } from "./PoemCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DeleteAlert } from "./DeleteAlert";
import { EditPoemDialog } from "./EditPoemDialog";
import { enhancePoem } from "@/lib/huggingface";

type Poem = Database["public"]["Tables"]["poems"]["Row"];

const ITEMS_PER_PAGE = 6;

export function PoemHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const [poems, setPoems] = useState<Poem[]>([]);
  const [currentPage, setCurrentPage] = useState(() => {
    const params = new URLSearchParams(location.search);
    return parseInt(params.get("page") || "1", 10);
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPoems();
  }, [currentPage]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page") || "1", 10);
    setCurrentPage(page);
  }, [location.search]);

  const fetchPoems = async () => {
    try {
      const { count } = await supabase
        .from("poems")
        .select("*", { count: "exact", head: true });

      const { data, error } = await supabase
        .from("poems")
        .select("*")
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (error) throw error;

      setPoems(data || []);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Error fetching poems:", error);
      toast({
        title: "에러",
        description: "시를 불러오는데 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePoem = async (id: string) => {
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

      fetchPoems();
    } catch (error) {
      console.error("Error deleting poem:", error);
      toast({
        title: "에러",
        description: "시를 삭제하는데 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleEditPoem = (poem: Poem) => {
    // TODO: Implement edit functionality
    console.log("Edit poem:", poem);
  };

  const handleAiEdit = async (poem: Poem) => {
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
        .eq("id", poem.id)
        .select()
        .single();

      if (error) throw error;

      // 즉시 상태 업데이트
      setPoems(prev => prev.map(p =>
        p.id === poem.id ? { ...p, content: enhancedContent } : p
      ));

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

  const handlePageChange = (page: number) => {
    // 페이지 변경 시 스크롤을 맨 위로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/history?page=${page}`);
  };

  const renderPaginationItems = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (
        i === currentPage - 2 ||
        i === currentPage + 2
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    return items;
  };
  const [deleteAlert, setDeleteAlert] = useState<{
    isOpen: boolean;
    poemId: string | null;
    title: string;
  }>({ isOpen: false, poemId: null, title: "" });

  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    poem: Poem | null;
  }>({ isOpen: false, poem: null });

  const triggerDelete = (poem: Poem) => {
    console.log("Triggering delete for poem:", poem.id);
    setDeleteAlert({
      isOpen: true,
      poemId: poem.id,
      title: poem.title
    });
  };

  const handleDeleteConfirm = async () => {
    console.log("Delete confirmation triggered");
    console.log("Delete alert state:", deleteAlert);

    if (!deleteAlert.poemId) return;

    try {
      console.log("Sending delete request...");
      const { error } = await supabase
        .from("poems")
        .delete()
        .eq("id", deleteAlert.poemId);

      if (error) throw error;

      await fetchPoems();

      toast({
        title: "삭제 완료",
        description: "시가 성공적으로 삭제되었습니다.",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "에러",
        description: "시를 삭제하는데 실패했습니다.",
        variant: "destructive",
      });
    }

    setDeleteAlert({ isOpen: false, poemId: null, title: "" });
  };


  const handleEditSave = async (title: string, content: string) => {
    if (!editDialog.poem) return;

    try {
      const { data, error } = await supabase
        .from("poems")
        .update({
          title,
          content,
          updated_at: new Date().toISOString()
        })
        .eq("id", editDialog.poem.id)
        .select(); // 수정된 데이터 반환

      if (error) {
        console.error("Update error:", error);
        throw error;
      }

      console.log("Updated data:", data); // 수정된 데이터 확인

      toast({
        title: "수정 완료",
        description: "시가 성공적으로 수정되었습니다.",
      });

      await fetchPoems(); // 목록 새로고침
    } catch (error) {
      console.error("Error updating poem:", error);
      toast({
        title: "에러",
        description: `시 수정 실패: ${error.message}`,
        variant: "destructive",
      });
    }

    setEditDialog({ isOpen: false, poem: null });
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {poems.map((poem) => (
          <PoemCard
            key={poem.id}
            title={poem.title}
            content={poem.content}
            date={poem.created_at}
            onClick={() => navigate(`/poem/${poem.id}?page=${currentPage}`)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      <DeleteAlert
        isOpen={deleteAlert.isOpen}
        onClose={() => setDeleteAlert({ isOpen: false, poemId: null, title: "" })}
        onConfirm={handleDeleteConfirm}
        title={deleteAlert.title}
      />

      {editDialog.poem && (
        <EditPoemDialog
          isOpen={editDialog.isOpen}
          onClose={() => setEditDialog({ isOpen: false, poem: null })}
          onSave={handleEditSave}
          initialTitle={editDialog.poem.title}
          initialContent={editDialog.poem.content}
        />
      )}
      <DeleteAlert
        isOpen={deleteAlert.isOpen}
        onClose={() => setDeleteAlert({ isOpen: false, poemId: null, title: "" })}
        onConfirm={handleDeleteConfirm}
        title={deleteAlert.title}
      />
    </motion.div>
  );
}