// utils/fileUpload.ts
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'

export const uploadFileToStorage = async (
  file: File,
  path: string,
): Promise<string> => {
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading file:', error)
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message: string }).message
        : String(error)
    throw new Error(`Failed to upload file: ${errorMessage}`)
  }
}

// File size validation helper
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

// Supported file types
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const SUPPORTED_PDF_TYPES = ['application/pdf']
export const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/webm']
