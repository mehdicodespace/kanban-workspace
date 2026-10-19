import {
  collection,
  doc,
  getDoc,
  getDocs,
  getDocsFromServer,
  query,
  where,
  addDoc,
  updateDoc,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore'
import { auth, db, requireFirebase } from './firebase'
import { shouldMoveSubtaskWithParent, validateTask } from '@/utils/tasks'

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
    const snapshot = await getDocsFromServer(taskCollection())
    const tasks = snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))
    tasks.sort((a, b) => (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0))
    const tasksById = new Map(tasks.map((task) => [task.id, task]))
    return tasks.map((task) => ({
      ...task,
      parentTitle: task.parent_id ? tasksById.get(task.parent_id)?.title || 'Parent task' : null,
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
    const taskRef = doc(ref, task.id)
    const previousStatus = snapshot.data().status

    if (!data.parent_id && data.status !== previousStatus) {
      const children = await getDocs(query(ref, where('parent_id', '==', task.id)))
      const childrenToMove = children.docs.filter((child) =>
        shouldMoveSubtaskWithParent(child.data(), previousStatus)
      )
      if (childrenToMove.length + 1 > 500) {
        throw new Error('This task has too many subtasks to move together.')
      }

      const batch = writeBatch(db)
      batch.update(taskRef, { ...data, updatedAt: serverTimestamp() })
      for (const child of childrenToMove) {
        batch.update(child.ref, { status: data.status, updatedAt: serverTimestamp() })
      }
      await batch.commit()
      return
    }

    await updateDoc(taskRef, { ...data, updatedAt: serverTimestamp() })
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
