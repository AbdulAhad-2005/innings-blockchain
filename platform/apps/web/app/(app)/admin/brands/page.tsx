"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp } from "@/components/animations"
import { apiRequest } from "@/lib/api"
import { Building2, MoreVertical, Plus } from "lucide-react"

interface BrandItem {
  _id: string
  name: string
  email: string
  campaigns?: number
  verificationStatus?: "unverified" | "verified" | "revoked"
  createdAt: string
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<BrandItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadBrands = async () => {
    try {
      setLoading(true)
      const data = await apiRequest<BrandItem[]>("/api/admin/brands")
      setBrands(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load brands.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadBrands()
  }, [])

  const handleAddBrand = async () => {
    const name = window.prompt("Enter brand name")?.trim()
    const email = window.prompt("Enter brand email")?.trim()
    const password = window.prompt("Enter temporary password")?.trim()

    if (!name || !email || !password) {
      return
    }

    try {
      await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          role: "brand",
        }),
      })

      await loadBrands()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create brand.")
    }
  }

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
          <Button variant="outline" onClick={handleAddBrand}>
            <Plus className="mr-2 h-4 w-4" /> Add Brand
          </Button>
        </div>
      </FadeIn>

      {error && (
        <Card className="neo-card border-red-500">
          <CardContent className="pt-6 text-red-600">{error}</CardContent>
        </Card>
      )}

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
                      <td>{brand.campaigns ?? 0}</td>
                      <td>
                        <Badge variant={brand.verificationStatus === "verified" ? "secondary" : "outline"}>
                          {brand.verificationStatus === "verified" ? "Active" : "Pending"}
                        </Badge>
                      </td>
                      <td>{new Date(brand.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {loading && (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500">
                        Loading brands...
                      </td>
                    </tr>
                  )}
                  {!loading && brands.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500">
                        No brands found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}
