// Resources & Bridge Support Routes for HERE Platform
import express from 'express';
import { find } from '../../database/db.js';

const router = express.Router();

// GET /api/resources
router.get('/', (req, res) => {
  const category = req.query.category;
  let all = find('resources');
  if (category) {
    all = all.filter(r => r.category.toLowerCase().includes(category.toLowerCase()));
  }
  res.json(all);
});

// GET /api/resources/recommended
router.get('/recommended', (req, res) => {
  const all = find('resources');
  // Personalized Bridge Support while waiting for appointment
  const bridgeSupport = [
    {
      day: "Today",
      task: "5-minute physiological sigh & grounding exercise",
      resource: all.find(r => r.id === 'RES-2') || all[1]
    },
    {
      day: "Tomorrow",
      task: "Managing study pressure & coursework de-escalation",
      resource: all.find(r => r.id === 'RES-3') || all[2]
    },
    {
      day: "Night before consultation",
      task: "Restorative sleep routine guide",
      resource: all.find(r => r.id === 'RES-1') || all[0]
    }
  ];

  res.json({
    recommendedResources: all.slice(0, 3),
    bridgeSupportTimeline: bridgeSupport
  });
});

export default router;
