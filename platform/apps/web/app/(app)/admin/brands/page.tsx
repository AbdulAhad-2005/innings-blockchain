"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp } from "@/components/animations"
import { Building2, MoreVertical, Plus } from "lucide-react"

const brands = [
  { name: "Nike Cricket", email: "contact@nike.com", campaigns: 12, status: "Active", joined: "Nov 1, 2025" },
  { name: "Pepsi", email: "hello@pepsi.com", campaigns: 8, status: "Active", joined: "Dec 15, 2025" },
  { name: "Samsung", email: "sports@samsung.com", campaigns: 5, status: "Active", joined: "Jan 10, 2026" },
  { name: "Expired Brand", email: "old@brand.com", campaigns: 2, status: "Expired", joined: "Oct 5, 2025" },
]

export default function AdminBrandsPage() {
  return (
    <div className="space-y-6">
      <FadeIn direction="up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Badge variant="accent" className="mb-2 text-black">Brands</Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">
              Manage Brands
            </h1>
          </div>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Brand
          </Button>
        </div>
      </FadeIn>

      <SlideUp delay={0.1}>
        <Card className="neo-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" /> All Brands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="neo-table">
                <thead>
                  <tr>
                    <th>Brand</th>
                    <th>Email</th>
                    <th>Campaigns</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand) => (
                    <tr key={brand.email}>
                      <td className="font-display font-bold">{brand.name}</td>
                      <td>{brand.email}</td>
                      <td>{brand.campaigns}</td>
                      <td>
                        <Badge variant={brand.status === "Active" ? "secondary" : "outline"}>
                          {brand.status}
                        </Badge>
                      </td>
                      <td>{brand.joined}</td>
                      <td>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}
