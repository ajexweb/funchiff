// supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 🚀 ADVANCED HELPER FUNCTION: Upload Payment Proof to Supabase
 * @param {File} file - The image file uploaded by the user
 * @param {string} userId - The unique ID of the user making the payment
 * @returns {string|null} - Returns the Public URL of the uploaded image or null if failed
 */
export const uploadPaymentScreenshot = async (file, userId) => {
  try {
    // Generate a unique file name using user ID and current timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_payment_${Date.now()}.${fileExt}`;
    const filePath = `payment_proofs/${fileName}`; // Saves inside 'payment_proofs' folder in 'hack' bucket
    
    // Upload the file to the 'hack' bucket
    const { data, error } = await supabase.storage
      .from('hack')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false // Don't overwrite existing files
      });
    
    if (error) {
      throw error;
    }
    
    // Get the public URL to save in Firebase DB
    const { data: publicUrlData } = supabase.storage
      .from('hack')
      .getPublicUrl(filePath);
    
    console.log("✅ Payment Screenshot Uploaded to Supabase:", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
    
  } catch (error) {
    console.error("❌ Supabase Upload Error:", error.message);
    return null;
  }
};