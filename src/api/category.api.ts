import { db } from '@/lib/firebase'
import type {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '@/types/category.type'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
} from 'firebase/firestore'

export const categoryApi = {
  async getCategories(): Promise<Category[]> {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'desc'))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data() as Category)
  },

  async getCategoriesByMode(mode: string): Promise<Category[]> {
    const q = query(
      collection(db, 'categories'),
      where('mode', '==', mode),
      orderBy('createdAt', 'desc'),
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data() as Category)
  },

  async getCategoryById(id: string): Promise<Category | null> {
    const docRef = doc(db, 'categories', id)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? (docSnap.data() as Category) : null
  },

  async getCategoryByName(name: string): Promise<Category | null> {
    const q = query(collection(db, 'categories'), where('name', '==', name))

    const querySnapshot = await getDocs(q)
    return (querySnapshot.docs[0]?.data() as Category) || null
  },

  async createCategory(categoryData: CreateCategoryDTO): Promise<string> {
    const docRef = await addDoc(collection(db, 'categories'), categoryData)
    return docRef.id
  },

  async updateCategory(
    id: string,
    categoryData: UpdateCategoryDTO,
  ): Promise<void> {
    const docRef = doc(db, 'categories', id)
    await updateDoc(docRef, {
      ...categoryData,
      updatedAt: serverTimestamp(),
    } as DocumentData)
  },

  async deleteCategory(id: string): Promise<void> {
    await deleteDoc(doc(db, 'categories', id))
  },
}
