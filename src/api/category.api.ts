import { db } from '@/lib/firebase'
import type {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '@/types/category.type'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
} from 'firebase/firestore'

const tableName = 'categories'

export const categoryApi = {
  async getCategories(): Promise<Category[]> {
    const q = query(collection(db, tableName), orderBy('createdAt', 'desc'))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data() as Category)
  },

  async getCategoriesByMode(mode: string): Promise<Category[]> {
    const q = query(
      collection(db, tableName),
      where('mode', '==', mode),
      orderBy('createdAt', 'desc'),
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data() as Category)
  },

  async getCategoryById(id: string): Promise<Category | null> {
    const docRef = doc(db, tableName, id)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? (docSnap.data() as Category) : null
  },

  async getCategoryByName(name: string): Promise<Category | null> {
    const q = query(collection(db, tableName), where('name', '==', name))

    const querySnapshot = await getDocs(q)
    return (querySnapshot.docs[0]?.data() as Category) || null
  },

  async createCategory(categoryData: CreateCategoryDTO): Promise<void> {
    const docRef = doc(db, tableName, categoryData.id)

    await setDoc(docRef, {
      ...categoryData,
      createdAt: serverTimestamp(),
    })
  },

  async updateCategory(
    id: string,
    categoryData: UpdateCategoryDTO,
  ): Promise<void> {
    const docRef = doc(db, tableName, id)
    await updateDoc(docRef, {
      ...categoryData,
      updatedAt: serverTimestamp(),
    } as DocumentData)
  },

  async deleteCategory(id: string): Promise<void> {
    await deleteDoc(doc(db, tableName, id))
  },
}
