import { useState } from 'react'
import { Alert, Box, Button, Chip, Skeleton, Typography } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'
import { useGroups } from '../../groups/hooks/useGroups'
import { createPlan } from '../../../services/plans/planService'
import { PLAN_STATUS_LABELS, PLAN_TYPE_LABELS } from '../planConstants'
import { usePlans } from '../hooks/usePlans'
import { PlanFormDialog } from '../components/PlanDialogs'
import '../plans.css'

const displayDate = (value) => value?.toDate ? value.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date to be set'
function PlanCard({ plan, onOpen }) { return <Box className={`plan-card plan-${plan.type}`} onClick={onOpen} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && onOpen()}><Box className="plan-card-art" style={plan.coverImageUrl ? { backgroundImage: `url(${plan.coverImageUrl})` } : undefined}><Typography>{PLAN_TYPE_LABELS[plan.type]}</Typography></Box><Box className="plan-card-copy"><Box className="plan-card-topline"><Chip label={PLAN_STATUS_LABELS[plan.status]} className={`status-chip status-${plan.status}`} /><Typography>{displayDate(plan.startAt)}</Typography></Box><Typography variant="h2">{plan.title}</Typography><Typography>{plan.location || 'Location to be decided'}</Typography><ArrowForwardRoundedIcon /></Box></Box> }
function PlansLoading() { return <Box className="plans-grid">{[1, 2, 3].map((item) => <Skeleton key={item} variant="rounded" height={280} />)}</Box> }

export function PlansPage() {
  const { user } = useAuth(); const { loading, error, plans } = usePlans(user?.uid); const { groups } = useGroups(user?.uid); const [open, setOpen] = useState(false); const navigate = useNavigate()
  const selectedGroupId = groups[0]?.id
  const selectedGroup = groups.find((group) => group.id === selectedGroupId)
  const create = async (values) => { const id = await createPlan(values.groupId, values, user, values.selectedMembers); navigate(`/app/plans/${id}`) }
  return <Box className="plans-page"><Box className="plans-header"><Box><Typography className="dashboard-eyebrow">YOUR SHARED THINGS</Typography><Typography variant="h1">My plans.</Typography><Typography>One place for the people, decisions and details behind what you are doing together.</Typography></Box><Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setOpen(true)}>Start a plan</Button></Box>{loading && <PlansLoading />}{error && <Alert severity="error" action={<Button startIcon={<RefreshRoundedIcon />} color="inherit" onClick={() => window.location.reload()}>Retry</Button>}>We couldn’t load your plans.</Alert>}{!loading && !error && !plans.length && <Box className="plans-empty"><Typography className="dashboard-eyebrow">START WITH AN IDEA</Typography><Typography variant="h2">Nothing planned yet.</Typography><Typography>Choose what you are doing, bring your group in, and give the idea somewhere to go.</Typography><Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setOpen(true)}>Start a plan</Button></Box>}{!loading && plans.length > 0 && <Box className="plans-grid">{plans.map((plan) => <PlanCard key={`${plan.groupId}-${plan.id}`} plan={plan} onOpen={() => navigate(`/app/plans/${plan.id}`)} />)}</Box>}{open && <PlanFormDialog open groups={groups} members={[]} initialGroupId={selectedGroup?.id} onClose={() => setOpen(false)} onSubmit={create} />}</Box>
}