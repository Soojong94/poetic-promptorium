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

  const handleAiEdit = (poem: Poem) => {
    // TODO: Implement AI edit functionality
    console.log("AI edit poem:", poem);
  };

  const handlePageChange = (page: number) => {
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

  const handleDeleteConfirm = async () => {
    if (!deleteAlert.poemId) return;

    try {
      const { error } = await supabase
        .from("poems")
        .delete()
        .eq("id", deleteAlert.poemId);

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

    setDeleteAlert({ isOpen: false, poemId: null, title: "" });
  };

  const handleEditSave = async (title: string, content: string) => {
    if (!editDialog.poem) return;

    try {
      const { error } = await supabase
        .from("poems")
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq("id", editDialog.poem.id);

      if (error) throw error;

      toast({
        title: "수정 완료",
        description: "시가 성공적으로 수정되었습니다.",
      });

      fetchPoems();
    } catch (error) {
      console.error("Error updating poem:", error);
      toast({
        title: "에러",
        description: "시를 수정하는데 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"> {/* 그리드 열 수 조정 */}
        {poems.map((poem) => (
          <PoemCard
            key={poem.id}
            title={poem.title}
            content={poem.content}
            date={poem.created_at}
            onClick={() => navigate(`/poem/${poem.id}?page=${currentPage}`)}
            onEdit={() => setEditDialog({ isOpen: true, poem })} // 수정
            onDelete={() => setDeleteAlert({  // 수정
              isOpen: true,
              poemId: poem.id,
              title: poem.title
            })}
            onAiEdit={() => handleAiEdit(poem)}
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
    </motion.div>
  );
}