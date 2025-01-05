import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;

    // filePath에서 'poems/' 제거하고 fileName만 사용
    const { error: uploadError } = await supabase.storage
      .from('poems')
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('poems')
      .getPublicUrl(fileName);

    console.log('Uploaded image URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function deleteImage(url: string) {
  try {
    // URL에서 마지막 부분만 fileName으로 추출
    const fileName = url.split('/').pop();
    if (!fileName) return;

    const { error } = await supabase.storage
      .from('poems')
      .remove([fileName]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}