import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography
} from '@mui/material'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import TimerOffRoundedIcon from '@mui/icons-material/TimerOffRounded'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { useAuth } from '../../auth/context/AuthContext'
import {
  checkGroupMembership,
  getInvitePreview,
  joinGroupWithInvite
} from '../../../services/invites/inviteService'
import '../invite.css'

export function JoinPage() {
  const { inviteCode } = useParams()
  const { user, initializing: authLoading } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [inviteStatus, setInviteStatus] = useState('loading')
  const [invite, setInvite] = useState(null)
  const [alreadyMember, setAlreadyMember] = useState(false)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    async function load() {
      try {
        const result = await getInvitePreview(inviteCode)
        if (!isCurrent) return

        setInviteStatus(result.status)
        setInvite(result.invite)

        if (result.status === 'active' && result.invite && user) {
          const isMember = await checkGroupMembership(result.invite.groupId, user.uid)
          if (isCurrent) {
            setAlreadyMember(isMember)
          }
        }
      } catch (loadError) {
        if (import.meta.env.DEV) {
          console.error('Invite preview or membership check failed:', {
            code: loadError?.code,
            message: loadError?.message
          })
        }
        if (isCurrent) {
          setInviteStatus('invalid')
        }
      } finally {
        if (isCurrent) {
          setLoading(false)
        }
      }
    }

    if (!authLoading) {
      load()
    }

    return () => {
      isCurrent = false
    }
  }, [inviteCode, user, authLoading])

  const handleJoin = async () => {
    if (!user) {
      // Preserve current join link so user is redirected back upon login or signup
      navigate('/login', { state: { from: `/join/${inviteCode}` } })
      return
    }

    if (alreadyMember) {
      navigate(`/app/groups/${invite.groupId}`)
      return
    }

    setJoining(true)
    setError('')

    try {
      const res = await joinGroupWithInvite(invite, user)
      if (res.alreadyMember) {
        setAlreadyMember(true)
      }
      navigate(`/app/groups/${res.groupId}`)
    } catch (err) {
      setError(err.message || 'We could not complete your join request. Please try again.')
      setJoining(false)
    }
  }

  if (loading || authLoading) {
    return (
      <Box className="join-page" sx={{ justifyContent: 'center' }}>
        <CircularProgress size={44} sx={{ color: '#fec29f', mb: 2 }} />
        <Typography sx={{ color: '#b9c0c7', fontWeight: 600 }}>Checking invitation…</Typography>
      </Box>
    )
  }

  return (
    <Box className="join-page">
      <Box className="join-header">
        <RouterLink to="/" className="join-brand-title">
          BookKaro<span>Yaar</span>
        </RouterLink>
        <Typography component="h1" className="join-hero-tagline">
          Good People<em>Great Places</em>
        </Typography>
      </Box>

      <Box className="join-card-container">
        {inviteStatus === 'active' && invite ? (
          <Box className="join-card">
            {invite.groupCoverSnapshot && (
              <Box
                className="join-card-cover"
                style={{ backgroundImage: `url(${invite.groupCoverSnapshot})` }}
              >
                <Box className="join-card-cover-overlay" />
              </Box>
            )}

            <Box className="join-card-body">
              <Typography className="join-eyebrow">YOU’RE INVITED TO</Typography>
              <Typography variant="h2" className="join-group-title">
                {invite.groupNameSnapshot}
              </Typography>
              <Typography className="join-inviter-line">
                by <strong>{invite.inviterNameSnapshot}</strong>
              </Typography>

              <Box className="join-social-proof">
                <GroupRoundedIcon sx={{ fontSize: 16, color: '#fec29f' }} />
                <span>Join your friends in this plan space</span>
              </Box>

              <Typography className="join-group-desc">
                {invite.groupDescriptionSnapshot ||
                  'A shared space for your people, decisions, and the plans you make together.'}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 2.5, borderRadius: 3 }}>
                  {error}
                </Alert>
              )}

              {alreadyMember ? (
                <Box sx={{ width: '100%' }}>
                  <Alert
                    severity="info"
                    className="join-already-member-alert"
                    sx={{ mb: 2, borderRadius: 3 }}
                  >
                    You are already a member of this group.
                  </Alert>
                  <Button
                    variant="contained"
                    className="join-cta-btn"
                    endIcon={<ArrowForwardRoundedIcon />}
                    onClick={() => navigate(`/app/groups/${invite.groupId}`)}
                  >
                    Open group
                  </Button>
                </Box>
              ) : (
                <Box sx={{ width: '100%' }}>
                  <Button
                    variant="contained"
                    className="join-cta-btn"
                    disabled={joining}
                    onClick={handleJoin}
                    endIcon={joining ? undefined : <ArrowForwardRoundedIcon />}
                  >
                    {joining ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : user ? (
                      'Join the crew'
                    ) : (
                      'Join group'
                    )}
                  </Button>

                  {!user && (
                    <Typography className="join-auth-prompt">
                      Already have an account?{' '}
                      <RouterLink to="/login" state={{ from: `/join/${inviteCode}` }}>
                        Log in
                      </RouterLink>{' '}
                      or{' '}
                      <RouterLink to="/signup" state={{ from: `/join/${inviteCode}` }}>
                        Sign up
                      </RouterLink>
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <Box className="join-card">
            <Box className="join-state-card">
              {inviteStatus === 'expired' && (
                <>
                  <TimerOffRoundedIcon className="join-state-icon" />
                  <Typography variant="h3" sx={{ fontSize: 22, fontWeight: 800, mb: 1, color: '#fff' }}>
                    This invite has expired
                  </Typography>
                  <Typography sx={{ color: '#8e96a0', fontSize: 14, lineHeight: 1.5, mb: 3 }}>
                    Invite links are temporary to keep groups secure. Ask the organizer for a fresh link.
                  </Typography>
                </>
              )}

              {inviteStatus === 'revoked' && (
                <>
                  <BlockRoundedIcon className="join-state-icon" sx={{ color: '#e57373' }} />
                  <Typography variant="h3" sx={{ fontSize: 22, fontWeight: 800, mb: 1, color: '#fff' }}>
                    Invite link revoked
                  </Typography>
                  <Typography sx={{ color: '#8e96a0', fontSize: 14, lineHeight: 1.5, mb: 3 }}>
                    This invitation was deactivated by a group admin. Ask for a new invite to join.
                  </Typography>
                </>
              )}

              {inviteStatus === 'invalid' && (
                <>
                  <ErrorOutlineRoundedIcon className="join-state-icon" />
                  <Typography variant="h3" sx={{ fontSize: 22, fontWeight: 800, mb: 1, color: '#fff' }}>
                    Invitation not found
                  </Typography>
                  <Typography sx={{ color: '#8e96a0', fontSize: 14, lineHeight: 1.5, mb: 3 }}>
                    This link appears broken or mistyped. Check the URL or request a new invitation.
                  </Typography>
                </>
              )}

              <Button
                variant="contained"
                className="join-cta-btn"
                onClick={() => navigate(user ? '/app' : '/')}
              >
                {user ? 'Back to command center' : 'Explore BookKaroYaar'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      <Box className="join-footer">
        <Typography className="join-footer-motto">
          People first. Plans second.
        </Typography>
      </Box>
    </Box>
  )
}
