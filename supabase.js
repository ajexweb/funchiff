// supabase.js
import { createClient } from '@supabase/supabase-js';

// .env variables se credentials load ho rhe hain
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🛡️ CRITICAL SECURITY CHECK: Ensure keys are present before app crashes
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ CRITICAL ERROR: Supabase URL or Anon Key is missing inside environment variables!");
}

// Interacting client initialize ho rha hai
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * ⚙️ ADVANCED UTILITY: Validates files on client-side before sending to server
 * Checks for size limitation and authorized gaming media formats
 * @param {File} file - The file to perform verification checks on
 * @param {number} maxSizeInMB - Maximum allowable limit in MB (Default 5MB)
 */
export const validateImageFile = (file, maxSizeInMB = 5) => {
  if (!file) throw new Error("No file selected for verification.");

  // Game screenshots authorized mime-types list
  const approvedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (!approvedTypes.includes(file.type)) {
    throw new Error(`Invalid extension format (${file.type}). Only JPG, JPEG, PNG, and WEBP formats are authorized.`);
  }

  // File size computing rule
  const maxBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`File asset overhead exceeded! Max threshold limit is ${maxSizeInMB}MB.`);
  }

  return true;
};

/**
 * 📱 FEATURE 1: Secure Payment Proof Upload Engine (For Gamers)
 * Saves screenshots inside the 'payment_proofs' folder in 'hack' bucket
 * @param {File} file - The payment image file from user input
 * @param {string} userId - Unique UID of the buying gamer
 * @returns {string|null} - Public downloadable link or null if failed
 */
export const uploadPaymentScreenshot = async (file, userId) => {
  try {
    // Perform initial 5MB checking protocol
    validateImageFile(file, 5);

    const fileExt = file.name.split('.').pop();
    // Unique naming logic to prevent collision overwrites
    const fileName = `${userId}_payment_${Date.now()}.${fileExt}`;
    const filePath = `payment_proofs/${fileName}`;
    
    console.log(`⏳ Syncing payment proof stream for client node: ${userId}...`);
    
    const { data, error } = await supabase.storage
      .from('hack')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Extracting public persistent url channel
    const { data: publicUrlData } = supabase.storage
      .from('hack')
      .getPublicUrl(filePath);
    
    console.log("✅ Payment Screenshot Uploaded to Supabase:", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
    
  } catch (error) {
    console.error("❌ Supabase Payment Proof Upload System Failure:", error.message);
    return null;
  }
};

/**
 * 👑 FEATURE 2: Batch Multiple Panel Image Uploader (For Advanced Admin CRUD)
 * Uploads an array of screenshots sequentially into 'panel_screenshots' folder
 * This acts as the backbone for the Flipkart style image slider component
 * @param {Array<File>} filesList - List of multiple screenshot files from input form
 * @param {string} adminId - Unique UID identifier of the operating Admin
 * @returns {Array<string>} - Array of public links matching uploaded assets
 */
export const uploadPanelImages = async (filesList, adminId) => {
  if (!filesList || filesList.length === 0) {
    console.warn("⚠️ Operation cancelled: No file streams passed to the engine.");
    return [];
  }

  const outputPublicUrls = [];
  console.log(`⏳ Initializing batch deployment process for ${filesList.length} screenshots...`);

  // Sequential Loop keeps process isolated, ensuring failures don't crash the entire chain
  for (let idx = 0; idx < filesList.length; idx++) {
    const activeFile = filesList[idx];
    try {
      // Step A: Client asset parameter confirmation checking
      validateImageFile(activeFile, 5);

      const fileExt = activeFile.name.split('.').pop();
      // Generate highly random suffix tag to safeguard against overriding files
      const entropyToken = Math.floor(1000 + Math.random() * 9000);
      const uniqueFileName = `panel_${adminId}_${Date.now()}_${entropyToken}_${idx + 1}.${fileExt}`;
      const destinationPath = `panel_screenshots/${uniqueFileName}`;

      console.log(`⏳ Deploying media asset pipeline [${idx + 1}/${filesList.length}]: ${activeFile.name}...`);

      // Step B: Direct streaming into the Supabase 'hack' repository
      const { data, error } = await supabase.storage
        .from('hack')
        .upload(destinationPath, activeFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Step C: Compile persistent live address matching the uploaded object
      const { data: fetchUrlResponse } = supabase.storage
        .from('hack')
        .getPublicUrl(destinationPath);

      outputPublicUrls.push(fetchUrlResponse.publicUrl);
      console.log(`✅ Successfully synced asset node [${idx + 1}/${filesList.length}]:`, fetchUrlResponse.publicUrl);

    } catch (individualError) {
      console.error(`❌ Process interrupted on asset index [${idx + 1}/${filesList.length}] (${activeFile.name}):`, individualError.message);
      // Fallback: Continue processing the remaining items in the loop
    }
  }

  console.log(`📊 Processing complete. Successfully deployed ${outputPublicUrls.length}/${filesList.length} media instances.`);
  return outputPublicUrls;
};

/**
 * 🗑️ FEATURE 3: Database Optimization Asset Cleanup Engine (For Admin Maintenance)
 * Automatically scrubs old files from storage buckets when an admin deletes or edits a listing
 * @param {string | Array<string>} targetUrls - Single public URL string or array of links to purge
 * @returns {boolean} - Operational success feedback state
 */
export const cleanUpStorageAssetsByUrls = async (targetUrls) => {
  if (!targetUrls || targetUrls.length === 0) return false;

  // Standardization structure constraint checker
  const normalizedUrlsArray = Array.isArray(targetUrls) ? targetUrls : [targetUrls];
  const extractionPathsQueue = [];

  // Parse and extract the local storage path strings from full raw domain text strings
  normalizedUrlsArray.forEach(rawUrlString => {
    try {
      if (rawUrlString.includes('/storage/v1/object/public/hack/')) {
        const structuralPathSegment = rawUrlString.split('/storage/v1/object/public/hack/')[1];
        if (structuralPathSegment) extractionPathsQueue.push(structuralPathSegment);
      }
    } catch (parseError) {
      console.error("❌ Link parsing error routine executed for target asset:", rawUrlString, parseError.message);
    }
  });

  if (extractionPathsQueue.length === 0) {
    console.warn("⚠️ Purge cancelled: No valid server bucket patterns matched targets.");
    return false;
  }

  try {
    console.log(`⏳ Executing permanent filesystem purge context for ${extractionPathsQueue.length} instances...`);
    
    // Delete files directly via bucket references array path parameters
    const { data, error } = await supabase.storage
      .from('hack')
      .remove(extractionPathsQueue);

    if (error) throw error;

    console.log("🗑️ Storage structural cluster space optimization complete:", data);
    return true;
  } catch (networkDeletionError) {
    console.error("❌ File system object removal request dropped by server node:", networkDeletionError.message);
    return false;
  }
};
