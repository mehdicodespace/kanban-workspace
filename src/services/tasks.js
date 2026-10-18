import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore'
import { auth, db, requireFirebase } from './firebase'
import { validateTask } from '@/utils/tasks'

function taskCollection() {
  requireFirebase()
  if (!auth.currentUser) throw new Error('Sign in to manage tasks.')
  return collection(db, 'users', auth.currentUser.uid, 'tasks')
}
async function parentsForValidation(ref, task) {
  if (!task.parent_id) return []
  const snapshot = await getDoc(doc(ref, task.parent_id))
  return snapshot.exists() ? [{ ...snapshot.data(), id: snapshot.id }] : []
}
export const taskService = {
  async list() {
    const snapshot = await getDocs(taskCollection())
    const tasks = snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))
    tasks.sort((a, b) => (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0))
    return tasks.map((task) => ({
      ...task,
      subtasks: tasks.filter((child) => child.parent_id === task.id)
    }))
  },
  async create(task) {
    const ref = taskCollection()
    const data = validateTask(task, await parentsForValidation(ref, task))
    await addDoc(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  },
  async update(task) {
    const ref = taskCollection()
    const snapshot = await getDoc(doc(ref, task.id))
    if (!snapshot.exists()) throw new Error('Task no longer exists. Reload the board.')
    if ((task.parent_id || null) !== snapshot.data().parent_id) {
      throw new Error('The parent of an existing task cannot be changed.')
    }
    const data = validateTask(task, await parentsForValidation(ref, task))
    await updateDoc(doc(ref, task.id), { ...data, updatedAt: serverTimestamp() })
  },
  async remove(id) {
    const ref = taskCollection()
    const children = await getDocs(query(ref, where('parent_id', '==', id)))
    if (children.size >= 500) throw new Error('This task has too many subtasks to delete at once.')
    const batch = writeBatch(db)
    for (const child of children.docs) batch.delete(child.ref)
    batch.delete(doc(ref, id))
    await batch.commit()
  }
}
