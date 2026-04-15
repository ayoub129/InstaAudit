import { ConnectedInstagramAccount } from "@/models/ConnectedInstagramAccount"

export async function getConnectedInstagramAccount(userId: string) {
  return ConnectedInstagramAccount.findOne({ userId }).lean()
}