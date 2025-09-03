import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  QueryDocumentSnapshot,
  type DocumentData,
  type SnapshotOptions,
  limit,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import type { Content, CreateContentDTO, Review } from '@/types/content.type'

const contentConverter = {
  toFirestore(content: Content): DocumentData {
    return {
      author: content.author,
      collection: content.collection,
      collectionId: content.collectionId,
      collectionNum: content.collectionNum,
      genre: content.genre,
      img: content.img,
      key: content.key,
      num: content.num,
      package: content.package,
      pages: content.pages,
      pdf: content.pdf,
      preview: content.preview,
      rating: content.rating,
      reviews: content.reviews,
      schedule: content.schedule,
      status: content.status,
      tag: content.tag,
      title: content.title,
      totalCompletions: content.totalCompletions,
      totalReads: content.totalReads,
      totalViews: content.totalViews,
      type: content.type,
      uploaded: content.uploaded,
      view: content.view,
      viewIds: content.viewIds,
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): Content {
    const data = snapshot.data(options)
    return {
      id: snapshot.id,
      author: data.author,
      collection: data.collection,
      collectionId: data.collectionId,
      collectionNum: data.collectionNum,
      genre: data.genre,
      img: data.img,
      key: data.key,
      num: data.num,
      package: data.package,
      pages: data.pages,
      pdf: data.pdf,
      preview: data.preview,
      rating: data.rating,
      reviews: data.reviews,
      schedule: data.schedule,
      status: data.status,
      tag: data.tag,
      title: data.title,
      totalCompletions: data.totalCompletions,
      totalReads: data.totalReads,
      totalViews: data.totalViews,
      type: data.type,
      uploaded: data.uploaded,
      view: data.view,
      viewIds: data.viewIds,
    }
  },
}

const tableName = 'comics'

// Content service functions
export const contentApi = {
  // Get all content
  async getContent(): Promise<Content[]> {
    const q = query(
      collection(db, tableName),
      orderBy('uploaded', 'desc'),
    ).withConverter(contentConverter)

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data())
  },

  // Get content by type
  async getContentByType(type: 'comic' | 'video'): Promise<Content[]> {
    const q = query(
      collection(db, tableName),
      where('type', '==', type),
      orderBy('uploaded', 'desc'),
    ).withConverter(contentConverter)

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data())
  },

  // Get content by ID
  async getContentById(id: string): Promise<Content | null> {
    const docRef = doc(db, tableName, id).withConverter(contentConverter)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? docSnap.data() : null
  },

  // Create new content
  async createContent(content: CreateContentDTO): Promise<string> {
    const docRef = await addDoc(
      collection(db, tableName).withConverter(contentConverter),
      content,
    )
    return docRef.id
  },

  // Update content
  async updateContent(id: string, content: Partial<Content>): Promise<void> {
    const docRef = doc(db, tableName, id).withConverter(contentConverter)
    await updateDoc(docRef, content as DocumentData)
  },

  // Delete content
  async deleteContent(id: string): Promise<void> {
    await deleteDoc(doc(db, tableName, id))
  },

  // Upload file to storage
  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    return await getDownloadURL(snapshot.ref)
  },

  async getReviews(
    contentId: string,
    limitCount: number = 3,
  ): Promise<Review[]> {
    const reviewsRef = collection(db, tableName, contentId, 'reviews')
    const q = query(reviewsRef, limit(limitCount))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Review[]
  },
}
