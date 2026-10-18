import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth'
import { auth, requireFirebase } from './firebase'

export const authService = {
  async login({ email, password }) {
    requireFirebase()
    return (await signInWithEmailAndPassword(auth, email.trim(), password)).user
  },
  async register({ name, email, password }) {
    requireFirebase()
    const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password)
    await updateProfile(user, { displayName: name.trim() })
    return user
  },
  async logout() {
    requireFirebase()
    await signOut(auth)
  }
}
