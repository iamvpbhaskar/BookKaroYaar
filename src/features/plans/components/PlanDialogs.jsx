import { useEffect, useState } from 'react'
import { Alert, Avatar, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { PLAN_TYPE_OPTIONS } from '../planConstants'
import { useGroupDetail } from '../../groups/hooks/useGroupDetail'
import { useAuth } from '../../auth/context/AuthContext'

const emptyPlan = { title: '', type: 'trip', description: '', startAt: '', endAt: '', location: '', coverImageUrl: '' }
const localInput = (value) => value?.toDate ? new Date(value.toDate().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : value || ''
const devInfo = (...args) => { if (import.meta.env.DEV) console.info(...args) }
const devWarn = (...args) => { if (import.meta.env.DEV) console.warn(...args) }
const devError = (...args) => { if (import.meta.env.DEV) console.error(...args) }
const getItineraryInitialValues = (initialValues, nextOrder) => { const initial = { title: '', type: 'Plan item', startAt: '', endAt: '', location: '', notes: '', order: nextOrder, ...initialValues }; return { ...initial, startAt: localInput(initial.startAt), endAt: localInput(initial.endAt) } }

function PlanFields({ values, saving, groups, groupId, initialValues, roster, selected, setSelected, setGroupId, setValues, change }) {
  const availableMembers = roster.filter((member) => member.uid !== initialValues?.createdBy)
  return <>
    <Box className="intent-grid">{PLAN_TYPE_OPTIONS.map((option) => <Button type="button" key={option.value} className={values.type === option.value ? 'is-selected' : ''} onClick={() => setValues((current) => ({ ...current, type: option.value }))}>{option.label}</Button>)}</Box>
    <FormControl fullWidth sx={{ mt: 2 }}><InputLabel>Which group is this for?</InputLabel><Select value={groupId} label="Which group is this for?" onChange={(event) => setGroupId(event.target.value)} disabled={Boolean(initialValues)}>{groups.map((group) => <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>)}</Select></FormControl>
    <TextField autoFocus label="Plan title" name="title" value={values.title} onChange={change} disabled={saving} fullWidth required sx={{ mt: 2 }} />
    <Box className="plan-form-columns"><TextField label="Starts" name="startAt" type="datetime-local" value={values.startAt} onChange={change} slotProps={{ inputLabel: { shrink: true } }} disabled={saving} /><TextField label="Ends" name="endAt" type="datetime-local" value={values.endAt} onChange={change} slotProps={{ inputLabel: { shrink: true } }} disabled={saving} /></Box>
    <TextField label="Location" name="location" value={values.location} onChange={change} disabled={saving} fullWidth sx={{ mt: 2 }} />
    <TextField label="Description" name="description" value={values.description} onChange={change} disabled={saving} fullWidth multiline minRows={2} sx={{ mt: 2 }} />
    <TextField label="Cover image URL (optional)" name="coverImageUrl" value={values.coverImageUrl} onChange={change} disabled={saving} fullWidth sx={{ mt: 2 }} />
    {!initialValues && <Box className="member-picker"><Typography className="dashboard-eyebrow">BRING PEOPLE</Typography>{availableMembers.map((member) => <Box className="member-picker-row" key={member.uid}><Checkbox checked={selected.includes(member.uid)} onChange={() => setSelected((current) => current.includes(member.uid) ? current.filter((uid) => uid !== member.uid) : [...current, member.uid])} /><Avatar src={member.photoURLSnapshot || undefined}>{member.displayNameSnapshot?.slice(0, 1)}</Avatar><Typography>{member.displayNameSnapshot}</Typography></Box>)}</Box>}
  </>
}

export function PlanFormDialog({ open, groups, initialValues, initialGroupId, currentUserUid, members = [], selectedMembers = [], onClose, onSubmit }) {
  const [values, setValues] = useState({ ...emptyPlan, ...initialValues, startAt: localInput(initialValues?.startAt), endAt: localInput(initialValues?.endAt) })
  const [groupId, setGroupId] = useState(initialGroupId || groups[0]?.id || '')
  const [selected, setSelected] = useState(selectedMembers.map((member) => member.uid))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const { user: authUser } = useAuth()
  const resolvedCurrentUserUid = currentUserUid || authUser?.uid
  const groupDetail = useGroupDetail(groupId)
  const roster = groupDetail.members.length ? groupDetail.members : members
  const change = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = async (event) => {
    devInfo('[Plan Debug] form submit fired')
    event.preventDefault()
    devInfo('[Plan Debug] validation started')
    const startAt = values.startAt ? new Date(values.startAt) : null
    const endAt = values.endAt ? new Date(values.endAt) : null
    if (!values.title.trim() || !values.type || !groupId) { devWarn('[plans] validation failed: missing title, type, or group'); setError('Choose a group and give this plan a title.'); return }
    if (!resolvedCurrentUserUid) { devWarn('[plans] validation failed: current user unavailable'); setError('Your session is unavailable. Please sign in again.'); return }
    if (!roster.some((member) => member.uid === resolvedCurrentUserUid)) { devWarn('[plans] validation failed: current user is not a group member'); setError('This plan must belong to one of your groups. Refresh the group and try again.'); return }
    if ((startAt && Number.isNaN(startAt.getTime())) || (endAt && Number.isNaN(endAt.getTime())) || (startAt && endAt && endAt < startAt)) { devWarn('[plans] validation failed: invalid date range'); setError('Check the plan dates. The end must be after the start.'); return }
    const selectedRosterMembers = roster.filter((member) => selected.includes(member.uid))
    const payload = { ...values, groupId, selectedMembers: selectedRosterMembers, startAt, endAt }
    devInfo('[Plan Debug] validation passed', { groupId, currentUserUid: resolvedCurrentUserUid, selectedParticipantUids: selectedRosterMembers.map((member) => member.uid) })
    setSaving(true); setError('')
    try { devInfo('[Plan Debug] calling createPlan'); await onSubmit(payload); onClose() } catch (submitError) { devError('[plans] edit/create failed', { code: submitError?.code, message: submitError?.message }); setError(submitError?.code ? `We could not save this plan (${submitError.code}). Please try again.` : 'We could not save this plan. Please try again.') } finally { setSaving(false) }
  }
  return <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm" slotProps={{ paper: { className: 'plan-dialog' } }}><DialogTitle>{initialValues ? 'Shape the plan' : 'What are we doing?'}</DialogTitle><Box component="form" id="create-plan-form" onSubmit={submit} noValidate><DialogContent><PlanFields values={values} saving={saving} groups={groups} groupId={groupId} initialValues={initialValues} roster={roster} selected={selected} setSelected={setSelected} setGroupId={setGroupId} setValues={setValues} change={change} />{error && <Alert severity="error" sx={{ mt: 2, borderRadius: 3 }}>{error}</Alert>}</DialogContent><DialogActions sx={{ px: 3, pt: 0, pb: 3 }}><Button type="button" onClick={onClose} disabled={saving} color="inherit">Cancel</Button><Button type="submit" form="create-plan-form" variant="contained" disabled={saving} onClick={() => devInfo('[Plan Debug] Create plan button clicked')}>{saving ? 'Saving…' : initialValues ? 'Save changes' : 'Create plan'}</Button></DialogActions></Box></Dialog>
}

export function ItineraryDialog({ open, initialValues, nextOrder, onClose, onSubmit }) {
  const [values, setValues] = useState(() => getItineraryInitialValues(initialValues, nextOrder))
  const [saving, setSaving] = useState(false)
  // The dialog stays mounted between add/edit openings, so reset its form when the target changes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (open) setValues(getItineraryInitialValues(initialValues, nextOrder)) }, [open, initialValues, nextOrder])
  const [error, setError] = useState('')
  const change = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = async (event) => {
    devInfo('[Itinerary Debug] form submitted')
    event.preventDefault()
    devInfo('[Itinerary Debug] validation started')
    const startAt = values.startAt ? new Date(values.startAt) : null
    const endAt = values.endAt ? new Date(values.endAt) : null
    if (!values.title.trim()) { devWarn('[Itinerary Debug] validation failed: title missing'); setError('Give this itinerary item a title.'); return }
    if ((startAt && Number.isNaN(startAt.getTime())) || (endAt && Number.isNaN(endAt.getTime()))) { devWarn('[Itinerary Debug] validation failed: invalid timestamp'); setError('Check the itinerary dates.'); return }
    if (startAt && endAt && endAt < startAt) { devWarn('[Itinerary Debug] validation failed: end before start'); setError('The end must be after the start.'); return }
    const payload = { ...values, startAt, endAt, order: Number(values.order) }
    devInfo('[Itinerary Debug] validation passed', { title: payload.title, order: payload.order, startAt, endAt })
    setSaving(true)
    setError('')
    try { devInfo('[Itinerary Debug] createItineraryItem called'); await onSubmit(payload); devInfo('[Itinerary Debug] success callback'); onClose() } catch (submitError) { devError('[Itinerary Debug] create failed', { code: submitError?.code, message: submitError?.message }); setError(submitError?.code ? `We could not save this item (${submitError.code}).` : 'We could not save this item. Please try again.') } finally { setSaving(false) }
  }
  return <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="xs" slotProps={{ paper: { className: 'plan-dialog' } }}><DialogTitle>{initialValues ? 'Edit itinerary item' : 'Add to the itinerary'}</DialogTitle><Box component="form" id="itinerary-item-form" onSubmit={submit} noValidate><DialogContent><TextField autoFocus label="Title" name="title" value={values.title} onChange={change} required fullWidth /><TextField label="Type" name="type" value={values.type} onChange={change} fullWidth sx={{ mt: 2 }} /><Box className="plan-form-columns"><TextField label="Starts" name="startAt" type="datetime-local" value={values.startAt} onChange={change} slotProps={{ inputLabel: { shrink: true } }} /><TextField label="Ends" name="endAt" type="datetime-local" value={values.endAt} onChange={change} slotProps={{ inputLabel: { shrink: true } }} /></Box><TextField label="Location" name="location" value={values.location} onChange={change} fullWidth sx={{ mt: 2 }} /><TextField label="Notes" name="notes" value={values.notes} onChange={change} fullWidth multiline minRows={2} sx={{ mt: 2 }} />{error && <Alert severity="error" sx={{ mt: 2, borderRadius: 3 }}>{error}</Alert>}</DialogContent><DialogActions sx={{ px: 3, pt: 0, pb: 3 }}><Button type="button" onClick={onClose} color="inherit">Cancel</Button><Button type="submit" form="itinerary-item-form" variant="contained" disabled={saving} onClick={() => devInfo('[Itinerary Debug] save button clicked')}>{saving ? 'Saving…' : 'Save item'}</Button></DialogActions></Box></Dialog>
}
