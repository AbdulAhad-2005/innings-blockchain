import { connectDB } from "../lib/db";
import Team, { ITeam } from "../models/Team";
import { formatImageUrl } from "../lib/utils";

export interface CreateTeamPayload {
  name: string;
  abbreviation: string;
  logoUrl?: string;
  description?: string;
}


export async function createTeam(data: CreateTeamPayload): Promise<ITeam> {
  await connectDB();
  const team = await Team.create(data);
  const obj = team.toObject();
  obj.logoUrl = formatImageUrl(obj.logoUrl);
  return obj;
}

export async function getAllTeams(): Promise<ITeam[]> {
  await connectDB();
  const teams = await Team.find().sort({ name: 1 });
  return teams.map(t => {
    const obj = t.toObject();
    obj.logoUrl = formatImageUrl(obj.logoUrl);
    return obj;
  });
}

export async function getTeamById(id: string): Promise<ITeam | null> {
  await connectDB();
  const team = await Team.findById(id);
  if (!team) return null;
  const obj = team.toObject();
  obj.logoUrl = formatImageUrl(obj.logoUrl);
  return obj;
}

export async function updateTeam(id: string, data: Partial<CreateTeamPayload>): Promise<ITeam | null> {
  await connectDB();
  const team = await Team.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!team) return null;
  const obj = team.toObject();
  obj.logoUrl = formatImageUrl(obj.logoUrl);
  return obj;
}

export async function deleteTeam(id: string): Promise<ITeam | null> {
  await connectDB();
  return await Team.findByIdAndDelete(id);
}
