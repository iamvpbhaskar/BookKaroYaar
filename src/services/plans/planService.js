import { collection, collectionGroup, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore'
import { db } from '../firebase/config'
import { PLAN_ROLES, PLAN_STATUSES } from '../../features/plans/planConstants'

const plansCollection = (groupId) => collection(db, 'groups', groupId, 'plans')
const planDocument = (groupId, planId) => doc(db, 'groups', groupId, 'plans', planId)
const membersCollection = (groupId, planId) => collection(db, 'groups', groupId, 'plans', planId, 'members')
function snapshotPlan(snapshot, groupId) { return { id: snapshot.id, groupId, ...snapshot.data() } }

export function subscribeToUserPlans(uid, onData, onError) {
  const membershipQuery = query(collectionGroup(db, 'members'), where('uid', '==', uid))
  let stops = []
  const plansByGroup = new Map()
  const emit = () => onData([...plansByGroup.values()].flat().sort((a, b) => (a.startAt?.toMillis?.() || 0) - (b.startAt?.toMillis?.() || 0)))
  return onSnapshot(membershipQuery, (memberships) => {
    stops.forEach((stop) => stop())
    stops = []
    plansByGroup.clear()
    memberships.docs.filter((membership) => membership.ref.path.split('/').length === 4).forEach((membership) => {
      const groupId = membership.ref.parent.parent?.id
      if (!groupId) return
      stops.push(onSnapshot(query(plansCollection(groupId), orderBy('startAt', 'asc')), (snapshot) => {
        plansByGroup.set(groupId, snapshot.docs.map((item) => snapshotPlan(item, groupId)))
        emit()
      }, onError))
    })
    emit()
  }, onError)
}

export function subscribeToGroupPlans(groupId, onData, onError) { return onSnapshot(query(plansCollection(groupId), orderBy('startAt', 'asc')), (snapshot) => onData(snapshot.docs.map((item) => snapshotPlan(item, groupId))), onError) }
export function subscribeToPlan(groupId, planId, onData, onError) { return onSnapshot(planDocument(groupId, planId), (snapshot) => onData(snapshot.exists() ? snapshotPlan(snapshot, groupId) : null), onError) }
export function subscribeToPlanMembers(groupId, planId, onData, onError) { return onSnapshot(membersCollection(groupId, planId), (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))), onError) }
export function subscribeToItinerary(groupId, planId, onData, onError) { return onSnapshot(query(collection(db, 'groups', groupId, 'plans', planId, 'itinerary'), orderBy('order', 'asc')), (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))), onError) }

export async function createPlan(groupId, values, user, selectedMembers = []) {
  const planRef = doc(plansCollection(groupId))
  const batch = writeBatch(db)
  batch.set(planRef, { title: values.title.trim(), type: values.type, description: values.description.trim(), startAt: values.startAt, endAt: values.endAt, location: values.location.trim(), coverImageUrl: values.coverImageUrl.trim(), status: PLAN_STATUSES.DRAFT, createdBy: user.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  batch.set(doc(membersCollection(groupId, planRef.id), user.uid), { uid: user.uid, joinedAt: serverTimestamp(), role: PLAN_ROLES.ORGANIZER, displayNameSnapshot: user.displayName || user.email || 'Organizer' })
  selectedMembers.filter((member) => member.uid !== user.uid).forEach((member) => batch.set(doc(membersCollection(groupId, planRef.id), member.uid), { uid: member.uid, joinedAt: serverTimestamp(), role: PLAN_ROLES.PARTICIPANT, displayNameSnapshot: member.displayNameSnapshot || 'Participant' }))
  await batch.commit()
  return planRef.id
}
export async function updatePlan(groupId, planId, values) { return updateDoc(planDocument(groupId, planId), { title: values.title.trim(), type: values.type, description: values.description.trim(), startAt: values.startAt, endAt: values.endAt, location: values.location.trim(), coverImageUrl: values.coverImageUrl.trim(), updatedAt: serverTimestamp() }) }
export async function updatePlanStatus(groupId, planId, status) { return updateDoc(planDocument(groupId, planId), { status, updatedAt: serverTimestamp() }) }
export async function addPlanMember(groupId, planId, member) { return setDoc(doc(membersCollection(groupId, planId), member.uid), { uid: member.uid, joinedAt: serverTimestamp(), role: PLAN_ROLES.PARTICIPANT, displayNameSnapshot: member.displayNameSnapshot || 'Participant' }) }
export async function removePlanMember(groupId, planId, uid) { return deleteDoc(doc(membersCollection(groupId, planId), uid)) }
export async function saveItineraryItem(groupId, planId, item, user) { const itemRef = item.id ? doc(db, 'groups', groupId, 'plans', planId, 'itinerary', item.id) : doc(collection(db, 'groups', groupId, 'plans', planId, 'itinerary')); const payload = { title: item.title.trim(), type: item.type.trim(), startAt: item.startAt, endAt: item.endAt, location: item.location.trim(), notes: item.notes.trim(), order: Number(item.order), createdBy: item.createdBy || user.uid }; return item.id ? updateDoc(itemRef, payload) : setDoc(itemRef, payload).then(() => itemRef.id) }
export async function deleteItineraryItem(groupId, planId, itemId) { return deleteDoc(doc(db, 'groups', groupId, 'plans', planId, 'itinerary', itemId)) }
export async function reorderItinerary(groupId, planId, items) { const batch = writeBatch(db); items.forEach((item, index) => batch.update(doc(db, 'groups', groupId, 'plans', planId, 'itinerary', item.id), { order: index })); return batch.commit() }
export async function getGroupPlans(groupId) { const snapshot = await getDocs(query(plansCollection(groupId), orderBy('startAt', 'asc'))); return snapshot.docs.map((item) => snapshotPlan(item, groupId)) }