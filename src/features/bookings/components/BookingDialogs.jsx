import { useState } from 'react'
import { Alert, Avatar, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { BOOKING_SHARE_MODES, BOOKING_TYPE_OPTIONS } from '../bookingConstants'

const emptyBooking = { type: 'other', title: '', provider: '', referenceCode: '', scheduledAt: '', location: '', totalAmount: '', currency: 'INR', bookedBy: '', shareMode: BOOKING_SHARE_MODES.EQUAL, notes: '' }
const localInput = (value) => value?.toDate ? new Date(value.toDate().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : value || ''

export function BookingDialog({ open, initialValues, members, currentUserUid, onClose, onSubmit }) {
  const [values, setValues] = useState(() => ({
    ...emptyBooking,
    ...initialValues,
    scheduledAt: localInput(initialValues?.scheduledAt),
    bookedBy: initialValues?.bookedBy || currentUserUid || (members[0]?.uid || ''),
    shareMode: initialValues?.participants?.[0]?.shareMode || BOOKING_SHARE_MODES.EQUAL
  }))
  const [selected, setSelected] = useState(() => initialValues?.participants?.map((participant) => participant.uid) || [currentUserUid || members[0]?.uid].filter(Boolean))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const bookedByOptions = initialValues
    ? members.filter((member) => member.uid === initialValues.bookedBy)
    : members

  const change = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    if (!values.title.trim() || !values.type || !values.scheduledAt || Number(values.totalAmount) < 0 || !selected.length || !values.bookedBy) {
      setError('Add a title, valid date, non-negative amount, booked-by member, and at least one participant.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const amount = Number(values.totalAmount)
      await onSubmit({
        ...values,
        scheduledAt: new Date(values.scheduledAt),
        totalAmount: amount,
        participants: selected.map((uid) => ({
          uid,
          shareMode: values.shareMode,
          shareValue: values.shareMode === BOOKING_SHARE_MODES.FULL ? amount : null
        }))
      })
      onClose()
    } catch (submitError) {
      setError(submitError?.code ? `Could not save this booking (${submitError.code}).` : 'Could not save this booking. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm" slotProps={{ paper: { className: 'plan-dialog' } }}>
      <DialogTitle>{initialValues ? 'Edit booking' : 'Record a booking'}</DialogTitle>
      <Box component="form" id="booking-form" onSubmit={submit} noValidate>
        <DialogContent>
          <Box className="booking-type-grid">
            {BOOKING_TYPE_OPTIONS.map((option) => (
              <Button
                type="button"
                key={option.value}
                className={values.type === option.value ? 'is-selected' : ''}
                onClick={() => setValues((current) => ({ ...current, type: option.value }))}
              >
                {option.label}
              </Button>
            ))}
          </Box>
          <TextField autoFocus label="What was booked?" name="title" value={values.title} onChange={change} fullWidth required sx={{ mt: 2 }} />
          <Box className="plan-form-columns">
            <TextField label="Provider" name="provider" value={values.provider} onChange={change} />
            <TextField label="Reference code" name="referenceCode" value={values.referenceCode} onChange={change} />
          </Box>
          <Box className="plan-form-columns">
            <TextField label="Scheduled for" name="scheduledAt" type="datetime-local" value={values.scheduledAt} onChange={change} slotProps={{ inputLabel: { shrink: true } }} required />
            <TextField label="Amount" name="totalAmount" type="number" slotProps={{ htmlInput: { min: 0, step: '0.01' } }} value={values.totalAmount} onChange={change} required />
          </Box>
          <Box className="plan-form-columns">
            <TextField label="Currency" name="currency" value={values.currency} onChange={change} />
            <TextField label="Location" name="location" value={values.location} onChange={change} />
          </Box>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Booked by</InputLabel>
            <Select name="bookedBy" value={values.bookedBy} label="Booked by" onChange={change} disabled={Boolean(initialValues)}>
              {bookedByOptions.map((member) => (
                <MenuItem key={member.uid} value={member.uid}>
                  {member.displayNameSnapshot}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box className="booking-participant-picker">
            <Box className="participant-header">
              <Typography className="dashboard-eyebrow">FOR WHOM</Typography>
              <Box className="share-mode-toggle">
                <Button
                  size="small"
                  type="button"
                  variant={values.shareMode === BOOKING_SHARE_MODES.EQUAL ? 'contained' : 'outlined'}
                  onClick={() => setValues((c) => ({ ...c, shareMode: BOOKING_SHARE_MODES.EQUAL }))}
                >
                  Equal split
                </Button>
                <Button
                  size="small"
                  type="button"
                  variant={values.shareMode === BOOKING_SHARE_MODES.FULL ? 'contained' : 'outlined'}
                  onClick={() => setValues((c) => ({ ...c, shareMode: BOOKING_SHARE_MODES.FULL }))}
                >
                  Full per person
                </Button>
              </Box>
            </Box>
            {members.map((member) => (
              <Box className="member-picker-row" key={member.uid}>
                <Checkbox
                  checked={selected.includes(member.uid)}
                  onChange={() =>
                    setSelected((current) =>
                      current.includes(member.uid)
                        ? current.filter((uid) => uid !== member.uid)
                        : [...current, member.uid]
                    )
                  }
                />
                <Avatar>{member.displayNameSnapshot?.slice(0, 1)}</Avatar>
                <Typography>{member.displayNameSnapshot}</Typography>
              </Box>
            ))}
          </Box>
          <TextField label="Notes" name="notes" value={values.notes} onChange={change} fullWidth multiline minRows={2} sx={{ mt: 2 }} />
          {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 3 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pt: 0, pb: 3 }}>
          <Button type="button" onClick={onClose} disabled={saving} color="inherit">Cancel</Button>
          <Button type="submit" form="booking-form" variant="contained" disabled={saving}>
            {saving ? 'Saving…' : initialValues ? 'Save changes' : 'Record booking'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}