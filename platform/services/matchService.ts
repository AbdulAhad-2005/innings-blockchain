import { connectDB } from "../lib/db";
import Match, { IMatch } from "../models/Match";
import Team from "../models/Team";
import { formatImageUrl } from "../lib/utils";

export interface CreateMatchPayload {
  teamA: string;
  teamB: string;
  startTime: string | Date;
  status?: string;
}

const MATCH_DURATION_HOURS = 4; // Assume a match takes 4 hours for overlap checks

/**
 * Validates if a team is already playing in another match during the given timeframe.
 */
async function checkTeamOverlap(teamId: string, startTime: Date, excludeMatchId?: string) {
  const windowStart = new Date(startTime.getTime() - MATCH_DURATION_HOURS * 60 * 60 * 1000);
  const windowEnd = new Date(startTime.getTime() + MATCH_DURATION_HOURS * 60 * 60 * 1000);

  const query: any = {
    $or: [{ teamA: teamId }, { teamB: teamId }],
    startTime: { $gte: windowStart, $lte: windowEnd },
    status: { $ne: "cancelled" }
  };

  if (excludeMatchId) {
    query._id = { $ne: excludeMatchId };
  }

  const overlappingMatch = await Match.findOne(query);
  return overlappingMatch;
}

export async function createMatch(data: CreateMatchPayload): Promise<IMatch> {
  await connectDB();

  const { teamA, teamB, startTime } = data;
  const start = new Date(startTime);

  if (teamA === teamB) {
    throw new Error("A team cannot play against itself.");
  }

  // Verify teams exist
  const [tA, tB] = await Promise.all([
    Team.findById(teamA),
    Team.findById(teamB)
  ]);

  if (!tA || !tB) {
    throw new Error("One or both teams not found.");
  }

  // Check for overlaps
  const overlapA = await checkTeamOverlap(teamA, start);
  if (overlapA) {
    throw new Error(`Team ${tA.name} is already scheduled for a match at this time (overlapping with match ${overlapA._id}).`);
  }

  const overlapB = await checkTeamOverlap(teamB, start);
  if (overlapB) {
    throw new Error(`Team ${tB.name} is already scheduled for a match at this time (overlapping with match ${overlapB._id}).`);
  }

  return await Match.create({ ...data, startTime: start });
}

export async function getAllMatches(): Promise<IMatch[]> {
  await connectDB();
  const matches = await Match.find()
    .populate("teamA", "name abbreviation logoUrl")
    .populate("teamB", "name abbreviation logoUrl")
    .sort({ startTime: 1 });

  return matches.map(m => {
    const obj = m.toObject();
    if (obj.teamA) obj.teamA.logoUrl = formatImageUrl(obj.teamA.logoUrl);
    if (obj.teamB) obj.teamB.logoUrl = formatImageUrl(obj.teamB.logoUrl);
    return obj;
  });
}

export async function getMatchById(id: string): Promise<IMatch | null> {
  await connectDB();
  const match = await Match.findById(id)
    .populate("teamA", "name abbreviation logoUrl")
    .populate("teamB", "name abbreviation logoUrl");
  
  if (!match) return null;
  const obj = match.toObject();
  if (obj.teamA) obj.teamA.logoUrl = formatImageUrl(obj.teamA.logoUrl);
  if (obj.teamB) obj.teamB.logoUrl = formatImageUrl(obj.teamB.logoUrl);
  return obj;
}

export async function updateMatch(id: string, data: Partial<CreateMatchPayload>): Promise<IMatch | null> {
  await connectDB();
  
  // If updating startTime or teams, we should re-validate overlaps
  // For simplicity in this implementation, we re-run logic if startTime/teams provided
  const existing = await Match.findById(id);
  if (!existing) throw new Error("Match not found");

  const newStartTime = data.startTime ? new Date(data.startTime) : existing.startTime;
  const newTeamA = data.teamA || existing.teamA.toString();
  const newTeamB = data.teamB || existing.teamB.toString();

  if (newTeamA === newTeamB) {
    throw new Error("A team cannot play against itself.");
  }

  if (data.startTime || data.teamA || data.teamB) {
    const overlapA = await checkTeamOverlap(newTeamA, newStartTime, id);
    if (overlapA) throw new Error(`Overlap detected for team A: ${overlapA._id}`);
    
    const overlapB = await checkTeamOverlap(newTeamB, newStartTime, id);
    if (overlapB) throw new Error(`Overlap detected for team B: ${overlapB._id}`);
  }

  return await Match.findByIdAndUpdate(id, { ...data, startTime: newStartTime }, { new: true });
}

export async function deleteMatch(id: string): Promise<IMatch | null> {
  await connectDB();
  return await Match.findByIdAndDelete(id);
}
