import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(file: File) {
  try {
    // 파일 확장자 추출
    const fileExt = file.name.split('.').pop();
    // UUID를 사용하여 고유한 파일명 생성
    const fileName = `${uuidv4()}.${fileExt}`;
    // 저장될 경로 설정
    const filePath = `poems/${fileName}`;

    // Supabase Storage에 파일 업로드
    const { error: uploadError } = await supabase.storage
      .from('poems')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // 업로드된 파일의 공개 URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from('poems')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function deleteImage(url: string) {
  try {
    // URL에서 파일명 추출
    const path = url.split('/').pop();
    if (!path) return;

    // Supabase Storage에서 파일 삭제
    const { error } = await supabase.storage
      .from('poems')
      .remove([`poems/${path}`]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}