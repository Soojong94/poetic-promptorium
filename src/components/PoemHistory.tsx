// components/PoemHistory.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PoemCard } from "./PoemCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
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
import { CARD_BACKGROUNDS } from "@/lib/constants";
import { useIsMobile } from "@/hooks/use-mobile";

type Poem = Database["public"]["Tables"]["poems"]["Row"] & {
  background_color?: string;
};

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

  const handlePageChange = (page: number) => {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"  // flex와 flex-col 추가
    >
      <div className="flex-grow grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {poems.map((poem) => (
          <PoemCard
            key={poem.id}
            title={poem.title}
            content={poem.content}
            date={poem.created_at}
            backgroundColor={poem.background_color || Object.values(CARD_BACKGROUNDS)[0]}
            onClick={() => navigate(`/poem/${poem.id}?page=${currentPage}`)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center"> {/* margin 조정 */}
          <div className="rounded-lg bg-gray-900/50 p-2"> {/* padding 조정 */}
            <Pagination>
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
          </div>
        </div>
      )}
    </motion.div>
  );
}