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

export async function loadBackgroundImages() {
  try {
    const { data: backgroundList, error } = await supabase.storage
      .from('poems')  // 'background' 대신 'poems' 사용
      .list('background');  // 'background' 폴더 지정

    if (error) {
      console.error('Error listing backgrounds:', error);
      throw error;
    }

    if (!backgroundList) {
      console.log('No backgrounds found');
      return [];
    }

    const urls = backgroundList.map(file => {
      const { data: { publicUrl } } = supabase.storage
        .from('poems')  // 'background' 대신 'poems' 사용
        .getPublicUrl(`background/${file.name}`);  // 경로에 'background/' 추가
      return publicUrl;
    });

    console.log('Loaded URLs:', urls);
    return urls;
  } catch (error) {
    console.error('Error in loadBackgroundImages:', error);
    throw error;
  }
}