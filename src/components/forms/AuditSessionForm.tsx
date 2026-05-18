import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, Zap, Package } from "lucide-react";
import { JSONPreview } from "@/components/JSONPreview";
import { StatusBadge } from "@/components/StatusBadge";
import { saveToHistory } from "@/lib/historyStore";
import { getAssets, type Asset } from "@/lib/assetStore";
import type { AuditSessionRequest, AuditSessionResponse } from "@/types/api";

export function AuditSessionForm() {
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState<AuditSessionRequest>({
    session_audit: "KK-00001",
    session_name: "",
    method: "0",
    date_created: "",
    user_request: "",
    department_info: "",
    store_info: "",
    items: []
  });

  const [response, setResponse] = useState<AuditSessionResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load available assets on mount and listen to updates
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      date_created: new Date().toISOString().split("T")[0],
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
      serial: asset.serial,
      epc: asset.epc || null
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

  const handleQuickCreate = () => {
    if (availableAssets.length === 0) {
      alert("Chưa có tài sản nào. Vui lòng tạo phiên in trước.");
      return;
    }
    
    // Select all assets automatically
    selectAll();
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
      const res = await fetch("/api/integration/create_audit_session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setResponse(data);
      
      // Save to history
      saveToHistory({
        sessionType: "audit",
        timestamp: new Date().toISOString(),
        status: data.respcode === "0" ? "success" : "error",
        request: formData,
        response: data
      });
    } catch (error) {
      const errorResponse = {
        respcode: "-1",
        errmsg: error instanceof Error ? error.message : "Lỗi kết nối",
        audit_id: ""
      };
      setResponse(errorResponse);
      
      // Save error to history
      saveToHistory({
        sessionType: "audit",
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

      {/* Session Info */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session_audit">Mã Phiên Kiểm Kê *</Label>
              <Input
                id="session_audit"
                value={formData.session_audit}
                onChange={(e) => setFormData({ ...formData, session_audit: e.target.value })}
                placeholder="KK-00013"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="session_name">Tên Phiên Kiểm Kê *</Label>
              <Input
                id="session_name"
                value={formData.session_name}
                onChange={(e) => setFormData({ ...formData, session_name: e.target.value })}
                placeholder="Tên phiên tại kho kk02"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Phương Pháp</Label>
              <Input
                id="method"
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_created">Ngày Tạo</Label>
              <Input
                id="date_created"
                type="date"
                value={formData.date_created}
                onChange={(e) => setFormData({ ...formData, date_created: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_request">Người Yêu Cầu *</Label>
              <Input
                id="user_request"
                value={formData.user_request}
                onChange={(e) => setFormData({ ...formData, user_request: e.target.value })}
                placeholder="user_id123"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department_info">Phòng Ban *</Label>
              <Input
                id="department_info"
                value={formData.department_info}
                onChange={(e) => setFormData({ ...formData, department_info: e.target.value })}
                placeholder="bp kế toán"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store_info">Cửa Hàng/Kho</Label>
              <Input
                id="store_info"
                value={formData.store_info}
                onChange={(e) => setFormData({ ...formData, store_info: e.target.value })}
                placeholder="store-0001"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Create Button */}
      {availableAssets.length > 0 && (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-semibold text-success">Tạo Nhanh Phiên Kiểm Kê</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Tự động chọn toàn bộ {availableAssets.length} tài sản từ phiên in
                </p>
              </div>
              <Button
                type="button"
                onClick={handleQuickCreate}
                className="bg-success hover:bg-success/90"
              >
                <Zap className="h-4 w-4 mr-2" />
                Tạo Nhanh
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Asset Selection */}
      {availableAssets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-heading font-semibold">
              Chọn Tài Sản Kiểm Kê
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
                    <th className="px-4 py-3 text-left font-semibold">EPC</th>
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
                      <td className="px-4 py-3 text-muted-foreground italic text-xs">
                        {asset.epc || "(rỗng)"}
                      </td>
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
        {isSubmitting ? "Đang gửi..." : `Tạo Phiên Kiểm Kê (${formData.items.length} tài sản)`}
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
            {response.respcode === "0" && response.audit_id && (
              <p className="text-sm text-muted-foreground">
                Audit ID: <span className="font-mono font-semibold">{response.audit_id}</span>
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </form>
  );
}