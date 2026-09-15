import { useState } from 'react'
import { Alert, Avatar, Box, Button, Chip, CircularProgress, IconButton, Typography } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import { useAuth } from '../../auth/context/AuthContext'
import { deleteBooking, saveBooking } from '../../../services/bookings/bookingService'
import { BOOKING_TYPE_LABELS } from '../bookingConstants'
import { usePlanBookings } from '../hooks/usePlanBookings'
import { BookingDialog } from './BookingDialogs'
import '../bookings.css'

const dateText = (value) => value?.toDate ? value.toDate().toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Date to be set'
const amountText = (amount, currency) => `${currency || 'INR'} ${Number(amount || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
export function BookingPanel({ groupId, planId, members, canManage }) {
  const { user } = useAuth(); const { loading, error, bookings } = usePlanBookings(groupId, planId); const [dialogOpen, setDialogOpen] = useState(false); const [editing, setEditing] = useState(null)
  const save = (values) => saveBooking(groupId, planId, values, user, values.participants)
  if (loading) return <Box className="booking-loading"><CircularProgress color="primary" /></Box>
  if (error) return <Alert severity="error" action={<Button startIcon={<RefreshRoundedIcon />} color="inherit" onClick={() => window.location.reload()}>Retry</Button>}>We couldn’t load bookings for this plan.</Alert>
  return <Box className="booking-section"><Box className="section-heading"><Box><Typography className="dashboard-eyebrow">PLAN CONTEXT</Typography><Typography variant="h2">Bookings</Typography><Typography className="booking-intro">The things booked for this plan, kept beside the people and the day.</Typography></Box>{canManage && <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => { setEditing(null); setDialogOpen(true) }}>Record booking</Button>}</Box>{!bookings.length && <Box className="inline-empty"><Typography variant="h3">No bookings yet.</Typography><Typography>Record the flight, hotel, dinner, or other detail that belongs to this plan.</Typography></Box>}<Box className="booking-list">{bookings.map((booking) => <Box className="booking-card" key={booking.id}><Box className="booking-card-top"><Chip label={BOOKING_TYPE_LABELS[booking.type]} /><Typography>{dateText(booking.scheduledAt)}</Typography></Box><Typography variant="h3">{booking.title}</Typography><Typography className="booking-provider">{booking.provider || 'Provider to be added'}{booking.location ? ` · ${booking.location}` : ''}</Typography><Box className="booking-card-meta"><Typography><strong>BOOKED BY</strong>{members.find((member) => member.uid === booking.bookedBy)?.displayNameSnapshot || 'Group member'}</Typography><Typography><strong>COST</strong>{amountText(booking.totalAmount, booking.currency)}</Typography><Box className="booking-avatars">{booking.participants?.map((participant) => <Avatar key={participant.uid}>{members.find((member) => member.uid === participant.uid)?.displayNameSnapshot?.slice(0, 1)}</Avatar>)}</Box></Box>{booking.referenceCode && <Typography className="booking-reference">Ref {booking.referenceCode}</Typography>}{canManage && <Box className="booking-card-actions"><IconButton aria-label={`Edit ${booking.title}`} onClick={() => { setEditing(booking); setDialogOpen(true) }}><EditRoundedIcon /></IconButton><IconButton aria-label={`Delete ${booking.title}`} onClick={() => deleteBooking(groupId, booking.id)}><DeleteOutlineRoundedIcon /></IconButton></Box>}</Box>)}</Box><BookingDialog key={editing?.id || 'new-booking'} open={dialogOpen} initialValues={editing} members={members} currentUserUid={user?.uid} onClose={() => setDialogOpen(false)} onSubmit={save} /></Box>
}