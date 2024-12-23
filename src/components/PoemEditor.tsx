import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Poem = Database["public"]["Tables"]["poems"]["Row"];

export function PoemEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [poemId, setPoemId] = useState<string | null>(null);

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
          .update({ title, content, updated_at: new Date().toISOString() })
          .eq("id", poemId);

        if (error) throw error;
        toast({
          title: "Poem updated",
          description: "Your poem has been updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("poems")
          .insert([{ title, content }]);

        if (error) throw error;
        toast({
          title: "Poem saved",
          description: "Your poem has been saved successfully",
        });
      }

      // Clear the form after successful save
      if (!isEditing) {
        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.error("Error saving poem:", error);
      toast({
        title: "Error",
        description: "Failed to save poem. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAIEdit = async () => {
    // TODO: Implement AI editing functionality
    toast({
      title: "AI Edit",
      description: "AI editing feature coming soon!",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Enter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-light bg-background border-border/50 focus:border-border"
        />
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Write your poem..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[300px] font-light leading-relaxed bg-background border-border/50 focus:border-border resize-none"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button
          onClick={handleAIEdit}
          variant="outline"
          className="border-primary/50 hover:border-primary"
        >
          AI Edit
        </Button>
        <Button
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isEditing ? "Update Poem" : "Save Poem"}
        </Button>
      </div>
    </motion.div>
  );
}