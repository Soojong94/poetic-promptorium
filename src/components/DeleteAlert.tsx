// components/DeleteAlert.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
}

export function DeleteAlert({
  isOpen,
  onClose,
  onConfirm,
  title = "Untitled",
}: DeleteAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-slate-900/95 border-slate-800"> {/* 매우 진한 배경색으로 변경 */}
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">시 삭제</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            "{title}" 시를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-slate-800 text-white hover:bg-slate-700">
            취소
          </AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 text-white hover:bg-red-600">
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}