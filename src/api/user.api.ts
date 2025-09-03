import {
  collection,
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
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { User, UpdateUserDTO } from '@/types/user.type'

const userConverter = {
  toFirestore(user: User): DocumentData {
    return {
      auth_url: user.auth_url,
      coin: user.coin,
      coins: user.coins,
      country: user.country,
      customer_code: user.customer_code,
      displayName: user.displayName,
      email: user.email,
      gender: user.gender,
      lastLogin: user.lastLogin,
      lastRewardedDate: user.lastRewardedDate,
      name: user.name,
      packageSub: user.packageSub,
      phone: user.phone,
      photoURL: user.photoURL,
      push_token: user.push_token,
      referral_code: user.referral_code,
      role: user.role,
      streaks: user.streaks,
      subDate: user.subDate,
      subExpiry: user.subExpiry,
      subscription_code: user.subscription_code,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive,
      lastSeen: user.lastSeen,
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): User {
    const data = snapshot.data(options)
    return {
      id: snapshot.id,
      auth_url: data.auth_url,
      coin: data.coin,
      coins: data.coins,
      country: data.country,
      customer_code: data.customer_code,
      displayName: data.displayName,
      email: data.email,
      gender: data.gender,
      lastLogin: data.lastLogin,
      lastRewardedDate: data.lastRewardedDate,
      name: data.name,
      packageSub: data.packageSub,
      phone: data.phone,
      photoURL: data.photoURL,
      push_token: data.push_token,
      referral_code: data.referral_code,
      role: data.role,
      streaks: data.streaks,
      subDate: data.subDate,
      subExpiry: data.subExpiry,
      subscription_code: data.subscription_code,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      isActive: data.isActive,
      lastSeen: data.lastSeen,
    }
  },
}

// User service functions
export const userApi = {
  // Get all users
  async getUsers(): Promise<User[]> {
    const q = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc'),
    ).withConverter(userConverter)

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data())
  },

  // Get users by role
  async getUsersByRole(role: string): Promise<User[]> {
    const q = query(
      collection(db, 'users'),
      where('role', '==', role),
      orderBy('createdAt', 'desc'),
    ).withConverter(userConverter)

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data())
  },

  // Get users by subscription package
  async getUsersByPackage(packageSub: string): Promise<User[]> {
    const q = query(
      collection(db, 'users'),
      where('packageSub', '==', packageSub),
      orderBy('createdAt', 'desc'),
    ).withConverter(userConverter)

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data())
  },

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    const docRef = doc(db, 'users', id).withConverter(userConverter)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? docSnap.data() : null
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    const q = query(
      collection(db, 'users'),
      where('email', '==', email),
    ).withConverter(userConverter)

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs[0]?.data() || null
  },

  // Get user by referral code
  async getUserByReferralCode(referralCode: string): Promise<User | null> {
    const q = query(
      collection(db, 'users'),
      where('referral_code', '==', referralCode),
    ).withConverter(userConverter)

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs[0]?.data() || null
  },

  // Create new user
  //   async createUser(userData: CreateUserDTO): Promise<string> {
  //     const docRef = await addDoc(
  //       collection(db, 'users').withConverter(userConverter),
  //       {
  //         ...userData,
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //         isActive: true,
  //       },
  //     )
  //     return docRef.id
  //   },

  // Update user
  async updateUser(id: string, userData: UpdateUserDTO): Promise<void> {
    const docRef = doc(db, 'users', id).withConverter(userConverter)
    await updateDoc(docRef, {
      ...userData,
      updatedAt: new Date(),
    } as DocumentData)
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    await deleteDoc(doc(db, 'users', id))
  },

  // Update user coins
  async updateUserCoins(id: string, coins: number): Promise<void> {
    const docRef = doc(db, 'users', id)
    await updateDoc(docRef, {
      coins: coins,
      updatedAt: new Date(),
    })
  },

  // Update user coin (single coin)
  async updateUserCoin(id: string, coin: number): Promise<void> {
    const docRef = doc(db, 'users', id)
    await updateDoc(docRef, {
      coin: coin,
      updatedAt: new Date(),
    })
  },

  // Update user subscription
  async updateUserSubscription(
    id: string,
    subscriptionData: {
      packageSub: string
      subDate: string
      subExpiry: string
      subscription_code: string
    },
  ): Promise<void> {
    const docRef = doc(db, 'users', id)
    await updateDoc(docRef, {
      ...subscriptionData,
      updatedAt: new Date(),
    })
  },

  // Update user last login
  async updateUserLastLogin(id: string): Promise<void> {
    const docRef = doc(db, 'users', id)
    await updateDoc(docRef, {
      lastLogin: new Date(),
      updatedAt: new Date(),
    })
  },

  // Update user streaks
  async updateUserStreaks(id: string, streaks: number): Promise<void> {
    const docRef = doc(db, 'users', id)
    await updateDoc(docRef, {
      streaks: streaks,
      lastRewardedDate: new Date(),
      updatedAt: new Date(),
    })
  },

  // Search users
  async searchUsers(queryText: string): Promise<User[]> {
    const users = await this.getUsers()
    return users.filter((user) =>
      Object.values(user).some((value) =>
        value?.toString().toLowerCase().includes(queryText.toLowerCase()),
      ),
    )
  },

  // Get active users (last seen in last 30 days)
  async getActiveUsers(): Promise<User[]> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const q = query(
      collection(db, 'users'),
      where('lastSeen', '>=', thirtyDaysAgo),
      orderBy('lastSeen', 'desc'),
    ).withConverter(userConverter)

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data())
  },

  // Get users with low coins (below threshold)
  async getUsersWithLowCoins(threshold: number = 10): Promise<User[]> {
    const q = query(
      collection(db, 'users'),
      where('coins', '<=', threshold),
      orderBy('coins', 'asc'),
    ).withConverter(userConverter)

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data())
  },

  // Get users by country
  async getUsersByCountry(country: string): Promise<User[]> {
    const q = query(
      collection(db, 'users'),
      where('country', '==', country),
      orderBy('createdAt', 'desc'),
    ).withConverter(userConverter)

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data())
  },
}
