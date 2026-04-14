"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";

interface Brand {
  _id: string;
  name: string;
  email: string;
  verificationStatus?: string;
  createdAt: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchBrands = async () => {
      try {
        const response = await apiRequest<Brand[]>("/api/admin/brands");
        if (mounted) {
          setBrands(response);
        }
      } catch (requestError: unknown) {
        if (mounted) {
          setError(requestError instanceof Error ? requestError.message : "Failed to load brands.");
        }
      }
    };

    fetchBrands();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredBrands = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return brands;
    return brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(normalized) ||
        brand.email.toLowerCase().includes(normalized)
    );
  }, [brands, query]);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Brand Management</h1>
          <p className="text-sm text-slate-500">Manage brand accounts and approvals.</p>
        </div>
        <Button>+ Add Brand</Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search brands..."
          className="max-w-xs"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select className="h-9 px-3 rounded-md border border-slate-200 text-sm">
          <option>All Status</option>
          <option>Verified</option>
          <option>Unverified</option>
          <option>Revoked</option>
        </select>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Brand ID</th>
              <th>Brand Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((brand) => (
              <tr key={brand._id}>
                <td className="font-mono text-xs">{brand._id.slice(-8)}</td>
                <td className="font-medium">{brand.name}</td>
                <td>{brand.email}</td>
                <td>
                  <Badge variant={brand.verificationStatus === 'verified' ? 'success' : brand.verificationStatus === 'revoked' ? 'destructive' : 'warning'}>
                    {brand.verificationStatus || 'unverified'}
                  </Badge>
                </td>
                <td>{new Date(brand.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View</Button>
                    {brand.verificationStatus !== 'verified' && (
                      <Button size="sm">Approve</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredBrands.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-slate-500">No brands found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}