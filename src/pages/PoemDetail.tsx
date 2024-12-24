import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Poem = Database["public"]["Tables"]["poems"]["Row"];

export default function PoemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [poem, setPoem] = useState<Poem | null>(null);
  const page = new URLSearchParams(location.search).get("page") || "1";

  useEffect(() => {
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

    fetchPoem();
  }, [id]);

  if (!poem) return null;

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 space-y-8 bg-background text-foreground">
      <Button
        variant="outline"
        onClick={() => navigate(`/history?page=${page}`)}
        className="mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        목록으로
      </Button>

      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-medium break-words">{poem.title}</h1>
        <p className="text-sm text-muted-foreground">
          {format(new Date(poem.created_at), "yyyy년 MM월 dd일 HH:mm:ss")}
        </p>
        <div className="mt-8 whitespace-pre-wrap leading-relaxed break-words">
          {poem.content}
        </div>
      </div>
    </div>
  );
}