import { Box, Button, Chip, Typography } from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { GroupDetailPage } from './GroupDetailPage'
import { useGroupPlans } from '../../plans/hooks/usePlans'
import { PLAN_STATUS_LABELS, PLAN_TYPE_LABELS } from '../../plans/planConstants'

export function GroupWorkspacePage() {
  const { groupId } = useParams()
  const { loading, plans } = useGroupPlans(groupId)
  return <><GroupDetailPage /><Box className="group-plans-surface"><Box><Typography className="dashboard-eyebrow">THE GROUP’S PLANS</Typography><Typography variant="h2">What are you doing together?</Typography></Box>{!loading && !plans.length && <Typography className="group-plans-muted">No plans yet. Start with an idea and bring this group in.</Typography>}{plans.map((plan) => <Button key={plan.id} component={RouterLink} to={`/app/plans/${plan.id}`} className={`group-plan-link plan-${plan.type}`} endIcon={<ArrowForwardRoundedIcon />}><Box><Typography>{PLAN_TYPE_LABELS[plan.type]} · {PLAN_STATUS_LABELS[plan.status]}</Typography><strong>{plan.title}</strong></Box><Chip label={plan.location || 'Location to be decided'} /></Button>)}</Box></>
}