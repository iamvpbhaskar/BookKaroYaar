import { collection, deleteDoc, doc, getDocs, onSnapshot, query, serverTimestamp, where, writeBatch } from 'firebase/firestore'
import { db } from '../firebase/config'
import { BOOKING_SHARE_MODES } from '../../features/bookings/bookingConstants'

const bookingsCollection = (groupId) => collection(db, 'groups', groupId, 'bookings')
const bookingDocument = (groupId, bookingId) => doc(db, 'groups', groupId, 'bookings', bookingId)
const participantsCollection = (groupId, bookingId) => collection(db, 'groups', groupId, 'bookings', bookingId, 'participants')
const snapshotBooking = (snapshot, groupId) => ({ id: snapshot.id, groupId, ...snapshot.data() })

export function subscribeToPlanBookings(groupId, planId, onData, onError) {
  return onSnapshot(query(bookingsCollection(groupId), where('planId', '==', planId)), async (snapshot) => {
    try {
      const bookings = await Promise.all(snapshot.docs.map(async (booking) => {
        const participants = await getDocs(participantsCollection(groupId, booking.id))
        return { ...snapshotBooking(booking, groupId), participants: participants.docs.map((item) => ({ id: item.id, ...item.data() })) }
      }))
      onData(bookings.sort((a, b) => (a.scheduledAt?.toMillis?.() || 0) - (b.scheduledAt?.toMillis?.() || 0)))
    } catch (error) { onError(error) }
  }, onError)
}

export async function saveBooking(groupId, planId, values, user, participants = []) {
  const bookingRef = values.id ? bookingDocument(groupId, values.id) : doc(bookingsCollection(groupId))
  const batch = writeBatch(db)
  const bookingData = { planId, type: values.type, title: values.title.trim(), provider: values.provider.trim(), referenceCode: values.referenceCode.trim(), scheduledAt: values.scheduledAt, location: values.location.trim(), totalAmount: Number(values.totalAmount || 0), currency: values.currency.trim().toUpperCase(), bookedBy: values.bookedBy || user.uid, notes: values.notes.trim(), updatedAt: serverTimestamp() }
  if (!values.id) { bookingData.createdAt = serverTimestamp(); batch.set(bookingRef, bookingData) } else batch.update(bookingRef, bookingData)
  const existing = values.id ? await getDocs(participantsCollection(groupId, values.id)) : null
  existing?.docs.forEach((participant) => batch.delete(participant.ref))
  const uniqueParticipants = [...new Map(participants.map((participant) => [participant.uid, participant])).values()]
  uniqueParticipants.forEach((participant) => batch.set(doc(participantsCollection(groupId, bookingRef.id), participant.uid), { uid: participant.uid, shareMode: participant.shareMode || BOOKING_SHARE_MODES.EQUAL, shareValue: participant.shareValue ?? null }))
  await batch.commit()
  return bookingRef.id
}

export async function deleteBooking(groupId, bookingId) { return deleteDoc(bookingDocument(groupId, bookingId)) }