import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import {
  createOrGetGroupInvite,
  getActiveGroupInvite,
  revokeGroupInvite
} from '../../../services/invites/inviteService'

export function GroupFormDialog({ open, title, initialValues = {}, onClose, onSubmit }) {
  const [values, setValues] = useState({
    name: initialValues.name || '',
    description: initialValues.description || '',
    coverImageUrl: initialValues.coverImageUrl || ''
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const change = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault()
    if (values.name.trim().length < 2) {
      setError('Give your group a name with at least 2 characters.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSubmit(values)
      onClose()
    } catch {
      setError('We could not save the group. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="xs" PaperProps={{ className: 'group-dialog' }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent component="form" onSubmit={submit}>
        <TextField autoFocus label="Group name" name="name" value={values.name} onChange={change} disabled={saving} fullWidth required />
        <TextField label="A line about your people" name="description" value={values.description} onChange={change} disabled={saving} fullWidth multiline minRows={2} sx={{ mt: 2 }} />
        <TextField label="Cover image URL (optional)" name="coverImageUrl" value={values.coverImageUrl} onChange={change} disabled={saving} fullWidth sx={{ mt: 2 }} />
        {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 3 }}>{error}</Alert>}
        <DialogActions sx={{ px: 0, pt: 3 }}>
          <Button onClick={onClose} disabled={saving} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving} onClick={submit}>{saving ? 'Saving…' : 'Save group'}</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export function ConfirmDialog({ open, title, description, actionLabel, onClose, onConfirm }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const confirm = async () => {
    setSaving(true)
    setError('')
    try {
      await onConfirm()
      onClose()
    } catch {
      setError('That change could not be completed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} PaperProps={{ className: 'group-dialog' }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {description}
        {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 3 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={saving} color="inherit">Cancel</Button>
        <Button onClick={confirm} disabled={saving} color="error" variant="contained">{saving ? 'Working…' : actionLabel}</Button>
      </DialogActions>
    </Dialog>
  )
}

export function InviteDialog({ open, groupId, group, user, onClose }) {
  const [loading, setLoading] = useState(true)
  const [invite, setInvite] = useState(null)
  const [copied, setCopied] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmRevoke, setConfirmRevoke] = useState(false)
  const [daysRemaining, setDaysRemaining] = useState(null)

  useEffect(() => {
    if (!open || !groupId) return
    let isCurrent = true

    getActiveGroupInvite(groupId)
      .then((activeInvite) => {
        if (isCurrent) {
          setInvite(activeInvite)
          if (activeInvite?.expiresAt) {
            const remaining = Math.max(0, Math.ceil((activeInvite.expiresAt.toDate().getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
            setDaysRemaining(remaining)
          } else {
            setDaysRemaining(null)
          }
          setLoading(false)
        }
      })
      .catch(() => {
        if (isCurrent) {
          setError('Could not check current invite links. Please try again.')
          setLoading(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [open, groupId])

  const inviteUrl = invite
    ? `${window.location.origin}/join/${invite.id}`
    : ''

  const handleCreate = async () => {
    if (!groupId || !group || !user) return
    setActionLoading(true)
    setError('')
    try {
      const newInvite = await createOrGetGroupInvite(groupId, group, user)
      setInvite(newInvite)
      if (newInvite?.expiresAt) {
        const remaining = Math.max(0, Math.ceil((newInvite.expiresAt.toDate().getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        setDaysRemaining(remaining)
      }
    } catch {
      setError('Could not generate an invite link. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCopy = () => {
    if (!inviteUrl) return
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }).catch(() => {
      setError('Failed to copy to clipboard.')
    })
  }

  const handleShare = () => {
    if (!inviteUrl || !navigator.share) return
    navigator.share({
      title: `Join ${group?.name || 'our group'} on BookKaroYaar`,
      text: `${user?.displayName || 'I'} invited you to join ${group?.name || 'our group'} on BookKaroYaar!`,
      url: inviteUrl
    }).catch(() => {
      // User dismissed share sheet or unsupported
    })
  }

  const handleRevoke = async () => {
    if (!invite?.id) return
    setActionLoading(true)
    setError('')
    try {
      await revokeGroupInvite(invite.id)
      setInvite(null)
      setDaysRemaining(null)
      setConfirmRevoke(false)
    } catch {
      setError('Could not revoke the invite link. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ className: 'group-dialog' }}>
      <DialogTitle>Invite people</DialogTitle>
      <DialogContent>
        <Typography className="dashboard-eyebrow" sx={{ color: '#fec29f !important', mb: 1, fontSize: 11, fontWeight: 900 }}>
          SHAREABLE INVITES
        </Typography>
        <Typography variant="h3" sx={{ fontSize: 22, fontWeight: 900, mb: 1, color: '#fff', letterSpacing: '-0.02em' }}>
          {group?.name || 'Your group'}
        </Typography>
        <Typography sx={{ color: '#b9c0c7', fontSize: 14, lineHeight: 1.5, mb: 2.5 }}>
          Anyone with this link can preview the group and join as a member.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} sx={{ color: '#fec29f' }} />
          </Box>
        ) : invite ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'rgba(255,255,255,0.04)',
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#fec29f', fontWeight: 800, letterSpacing: '0.08em' }}>
                  ACTIVE INVITE LINK
                </Typography>
                {daysRemaining !== null && (
                  <Typography variant="caption" sx={{ color: '#8e96a0' }}>
                    Expires in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'rgba(0,0,0,0.25)',
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.08)',
                  gap: 1
                }}
              >
                <LinkRoundedIcon sx={{ color: '#fec29f', fontSize: 18 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: 13,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1
                  }}
                >
                  {inviteUrl}
                </Typography>
                <Tooltip title={copied ? 'Copied!' : 'Copy link'}>
                  <IconButton
                    size="small"
                    onClick={handleCopy}
                    aria-label="Copy invite link"
                    sx={{ color: copied ? '#4caf50' : '#fec29f' }}
                  >
                    {copied ? <CheckRoundedIcon fontSize="small" /> : <ContentCopyRoundedIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCopy}
                startIcon={copied ? <CheckRoundedIcon /> : <ContentCopyRoundedIcon />}
                sx={{
                  bgcolor: copied ? '#388e3c' : '#fec29f',
                  color: copied ? '#fff' : '#1d2630',
                  fontWeight: 800,
                  py: 1,
                  '&:hover': {
                    bgcolor: copied ? '#2e7d32' : '#f5b48e'
                  }
                }}
              >
                {copied ? 'Copied to clipboard' : 'Copy link'}
              </Button>

              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <Button
                  variant="outlined"
                  onClick={handleShare}
                  startIcon={<ShareRoundedIcon />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontWeight: 700,
                    px: 2,
                    '&:hover': {
                      borderColor: '#fec29f',
                      bgcolor: 'rgba(254,194,159,0.08)'
                    }
                  }}
                >
                  Share
                </Button>
              )}
            </Box>

            {confirmRevoke ? (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'rgba(244,67,54,0.08)',
                  border: '1px solid rgba(244,67,54,0.2)',
                  borderRadius: 2.5,
                  mt: 1
                }}
              >
                <Typography variant="body2" sx={{ color: '#ffb4ab', fontWeight: 600, mb: 1.5 }}>
                  Revoke this link? Anyone who hasn’t joined yet won’t be able to use it.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    onClick={() => setConfirmRevoke(false)}
                    disabled={actionLoading}
                    sx={{ color: '#c7cdd2' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    disabled={actionLoading}
                    onClick={handleRevoke}
                    sx={{ fontWeight: 800 }}
                  >
                    {actionLoading ? 'Revoking…' : 'Revoke link'}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Button
                size="small"
                startIcon={<BlockRoundedIcon />}
                onClick={() => setConfirmRevoke(true)}
                sx={{
                  color: '#e57373',
                  alignSelf: 'center',
                  textTransform: 'none',
                  fontSize: 13,
                  '&:hover': { bgcolor: 'rgba(244,67,54,0.08)' }
                }}
              >
                Revoke this link
              </Button>
            )}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: 'rgba(255,255,255,0.04)',
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.08)',
                textAlign: 'center'
              }}
            >
              <Typography variant="body1" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                No active invite link
              </Typography>
              <Typography variant="body2" sx={{ color: '#8e96a0', lineHeight: 1.5 }}>
                Generate a unique, secure link you can share in group chats or direct messages.
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              disabled={actionLoading}
              onClick={handleCreate}
              startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <LinkRoundedIcon />}
              sx={{
                bgcolor: '#fec29f',
                color: '#1d2630',
                fontWeight: 800,
                py: 1.2,
                '&:hover': { bgcolor: '#f5b48e' }
              }}
            >
              {actionLoading ? 'Creating link…' : 'Create invite link'}
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2.5, pt: 0 }}>
        <Button onClick={onClose} color="inherit" sx={{ color: '#8e96a0' }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  )
}
