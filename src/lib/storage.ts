
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;

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
      .from('poems')
      .list();

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
        .from('poems')
        .getPublicUrl(file.name);
      return publicUrl;
    });

    console.log('Loaded URLs:', urls);
    return urls;
  } catch (error) {
    console.error('Error in loadBackgroundImages:', error);
    throw error;
  }
}
