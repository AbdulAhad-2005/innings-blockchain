import { connectDB } from "../lib/db";
import Team, { ITeam } from "../models/Team";

export interface CreateTeamPayload {
  name: string;
  abbreviation: string;
  logoUrl?: string;
  description?: string;
}

export async function createTeam(data: CreateTeamPayload): Promise<ITeam> {
  await connectDB();
  return await Team.create(data);
}

export async function getAllTeams(): Promise<ITeam[]> {
  await connectDB();
  return await Team.find().sort({ name: 1 });
}

export async function getTeamById(id: string): Promise<ITeam | null> {
  await connectDB();
  return await Team.findById(id);
}

export async function updateTeam(id: string, data: Partial<CreateTeamPayload>): Promise<ITeam | null> {
  await connectDB();
  return await Team.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteTeam(id: string): Promise<ITeam | null> {
  await connectDB();
  return await Team.findByIdAndDelete(id);
}
