import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, Package } from "lucide-react";
import { JSONPreview } from "@/components/JSONPreview";
import { StatusBadge } from "@/components/StatusBadge";
import { saveToHistory } from "@/lib/historyStore";
import { getAssets, type Asset } from "@/lib/assetStore";
import type { StockOutRequest, StockOutResponse } from "@/types/api";

export function StockOutForm() {
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState<StockOutRequest>({
    stockout_code: "",
    stockout_name: "",
    created_at: "",
    warehouse_cd: "",
    warehouse_name: "",
    person_cd: "",
    person_name: "",
    department: "",
    items: []
  });

  const [response, setResponse] = useState<StockOutResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load available assets on mount and listen to updates
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      stockout_code: "PXK-" + new Date().toISOString().split("T")[0].replace(/-/g, "") + "-0001",
      created_at: new Date().toISOString(),
    }));

    const loadAssets = () => {
      setAvailableAssets(getAssets());
    };
    
    loadAssets();
    window.addEventListener('assets_updated', loadAssets);
    
    return () => {
      window.removeEventListener('assets_updated', loadAssets);
    };
  }, []);

  // Update items when selection changes
  useEffect(() => {
    const selectedAssets = availableAssets.filter(asset => selectedAssetIds.has(asset.id));
    const items = selectedAssets.map(asset => ({
      asset_id: asset.id,
      epc: asset.epc || ""
    }));
    setFormData(prev => ({ ...prev, items }));
  }, [selectedAssetIds, availableAssets]);

  const toggleAssetSelection = (assetId: string) => {
    const newSelection = new Set(selectedAssetIds);
    if (newSelection.has(assetId)) {
      newSelection.delete(assetId);
    } else {
      newSelection.add(assetId);
    }
    setSelectedAssetIds(newSelection);
  };

  const selectAll = () => {
    setSelectedAssetIds(new Set(availableAssets.map(a => a.id)));
  };

  const clearSelection = () => {
    setSelectedAssetIds(new Set());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.items.length === 0) {
      alert("Vui lòng chọn ít nhất 1 tài sản");
      return;
    }

    setIsSubmitting(true);
    setResponse(null);

    try {
      const res = await fetch("/api/integration/stockout_note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setResponse(data);
      
      // Save to history
      saveToHistory({
        sessionType: "stockout",
        timestamp: new Date().toISOString(),
        status: data.respcode === "0" ? "success" : "error",
        request: formData,
        response: data
      });
    } catch (error) {
      const errorResponse = {
        respcode: "-1",
        errmsg: error instanceof Error ? error.message : "Lỗi kết nối",
        stockout_id: ""
      };
      setResponse(errorResponse);
      
      // Save error to history
      saveToHistory({
        sessionType: "stockout",
        timestamp: new Date().toISOString(),
        status: "error",
        request: formData,
        response: errorResponse
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Asset Count Info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-md">
        <Package className="h-4 w-4" />
        <span>
          Tài sản có sẵn: <span className="font-semibold font-mono">{availableAssets.length}</span> 
          {" | "}Đã chọn: <span className="font-semibold font-mono text-accent">{selectedAssetIds.size}</span>
        </span>
      </div>

      {availableAssets.length === 0 && (
        <Card className="border-amber-500/50 bg-amber-50/50">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-700">
              ⚠️ Chưa có tài sản nào. Vui lòng tạo phiên in trước để có danh sách tài sản.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stock Out Info */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stockout_code">Mã Phiếu Xuất *</Label>
              <Input
                id="stockout_code"
                value={formData.stockout_code}
                onChange={(e) => setFormData({ ...formData, stockout_code: e.target.value })}
                placeholder="PXK-20260515-0001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockout_name">Tên Phiếu Xuất *</Label>
              <Input
                id="stockout_name"
                value={formData.stockout_name}
                onChange={(e) => setFormData({ ...formData, stockout_name: e.target.value })}
                placeholder="Phiếu xuất kho tài sản tháng 05"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="created_at">Thời Gian Tạo</Label>
              <Input
                id="created_at"
                type="datetime-local"
                value={formData.created_at.slice(0, 16)}
                onChange={(e) => setFormData({ ...formData, created_at: new Date(e.target.value).toISOString() })}
              />
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-heading font-semibold mb-3">Thông Tin Kho</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="warehouse_cd">Mã Kho *</Label>
                <Input
                  id="warehouse_cd"
                  value={formData.warehouse_cd}
                  onChange={(e) => setFormData({ ...formData, warehouse_cd: e.target.value })}
                  placeholder="WH-01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouse_name">Tên Kho *</Label>
                <Input
                  id="warehouse_name"
                  value={formData.warehouse_name}
                  onChange={(e) => setFormData({ ...formData, warehouse_name: e.target.value })}
                  placeholder="Kho trung tâm"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-heading font-semibold mb-3">Người Nhận</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="person_cd">Mã Nhân Viên *</Label>
                <Input
                  id="person_cd"
                  value={formData.person_cd}
                  onChange={(e) => setFormData({ ...formData, person_cd: e.target.value })}
                  placeholder="NV-123"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="person_name">Tên Nhân Viên *</Label>
                <Input
                  id="person_name"
                  value={formData.person_name}
                  onChange={(e) => setFormData({ ...formData, person_name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Phòng Ban *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Phòng CNTT"
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Selection */}
      {availableAssets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-heading font-semibold">
              Chọn Tài Sản Xuất Kho
            </h3>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={selectAll}
                variant="outline"
                size="sm"
              >
                Chọn Tất Cả
              </Button>
              <Button
                type="button"
                onClick={clearSelection}
                variant="outline"
                size="sm"
              >
                Bỏ Chọn
              </Button>
            </div>
          </div>

          <div className="border rounded-md overflow-hidden">
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left w-12"></th>
                    <th className="px-4 py-3 text-left font-semibold">ID Tài Sản</th>
                    <th className="px-4 py-3 text-left font-semibold">Tên</th>
                    <th className="px-4 py-3 text-left font-semibold">Mã Tài Sản</th>
                    <th className="px-4 py-3 text-left font-semibold">Serial</th>
                    <th className="px-4 py-3 text-left font-semibold">Phiên In</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {availableAssets.map((asset) => (
                    <tr
                      key={asset.id}
                      className={`hover:bg-muted/20 cursor-pointer ${
                        selectedAssetIds.has(asset.id) ? "bg-accent/10" : ""
                      }`}
                      onClick={() => toggleAssetSelection(asset.id)}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedAssetIds.has(asset.id)}
                          onCheckedChange={() => toggleAssetSelection(asset.id)}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{asset.id}</td>
                      <td className="px-4 py-3">{asset.name}</td>
                      <td className="px-4 py-3 font-mono text-xs">{asset.asset_code}</td>
                      <td className="px-4 py-3 font-mono">{asset.serial}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {asset.print_session}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* JSON Preview */}
      {formData.items.length > 0 && (
        <JSONPreview title="Request JSON" data={formData} />
      )}

      {/* Submit Button */}
      <Button 
        type="submit" 
        size="lg" 
        className="w-full" 
        disabled={isSubmitting || formData.items.length === 0}
      >
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? "Đang gửi..." : `Tạo Phiếu Xuất (${formData.items.length} tài sản)`}
      </Button>

      {/* Response */}
      {response && (
        <Card className={response.respcode === "0" ? "border-success" : "border-destructive"}>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-semibold">Kết Quả API</h4>
              <StatusBadge status={response.respcode === "0" ? "success" : "error"}>
                {response.respcode === "0" ? "Thành công" : "Lỗi"}
              </StatusBadge>
            </div>
            <pre className="font-mono text-xs bg-muted/30 p-4 rounded-md overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
            {response.respcode === "0" && response.stockout_id && (
              <p className="text-sm text-muted-foreground">
                Stock Out ID: <span className="font-mono font-semibold">{response.stockout_id}</span>
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </form>
  );
}