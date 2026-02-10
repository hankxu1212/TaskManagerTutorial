import { Router } from "express";
import { getPointsAnalytics } from "../controllers/analyticsController.ts";

const router = Router();

/**
 * @openapi
 * /analytics/points:
 *   get:
 *     tags: [Analytics]
 *     summary: Get points analytics for a user
 *     description: Returns aggregated points data for the specified time period. Points are counted from tasks that were moved to "Done" status where the user is assigned.
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to get analytics for
 *       - in: query
 *         name: period
 *         required: true
 *         schema:
 *           type: string
 *           enum: [weekly, monthly, yearly]
 *         description: Time period for aggregation
 *     responses:
 *       200:
 *         description: Array of points data points
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: ISO date string for the start of the period
 *                   points:
 *                     type: integer
 *                     description: Total points completed in this period
 *                   label:
 *                     type: string
 *                     description: Display label (e.g., "Mon", "Week 1", "Jan")
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
router.get("/points", getPointsAnalytics);

export default router;
