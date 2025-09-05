import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Blog, CreateBlogDTO, UpdateBlogDTO } from '@/types/blog.type'

const blogCollection = collection(db, 'blogs')

export const blogApi = {
  getBlogs: async (): Promise<Blog[]> => {
    const snapshot = await getDocs(query(blogCollection))
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Blog, 'id'>),
    }))
  },

  getBlogById: async (id: string): Promise<Blog | null> => {
    const docRef = doc(db, 'blogs', id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return null
    return { id: docSnap.id, ...(docSnap.data() as Omit<Blog, 'id'>) }
  },

  createBlog: async (data: CreateBlogDTO): Promise<string> => {
    const docRef = await addDoc(blogCollection, {
      ...data,
      comment: 0,
      like: 0,
      share: 0,
      likedBy: [],
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })
    return docRef.id
  },

  updateBlog: async (id: string, data: UpdateBlogDTO): Promise<void> => {
    const docRef = doc(db, 'blogs', id)
    await updateDoc(docRef, {
      ...data,
      updated_at: serverTimestamp(),
    })
  },

  deleteBlog: async (id: string): Promise<void> => {
    const docRef = doc(db, 'blogs', id)
    await deleteDoc(docRef)
  },
}
