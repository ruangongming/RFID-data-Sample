import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash2, Send } from "lucide-react";
import { JSONPreview } from "@/components/JSONPreview";
import { StatusBadge } from "@/components/StatusBadge";
import { saveToHistory } from "@/lib/historyStore";
import type { AuditSessionRequest, AuditItem, AuditSessionResponse } from "@/types/api";

export function AuditSessionForm() {
  const [formData, setFormData] = useState<AuditSessionRequest>({
    session_audit: "KK-00001",
    session_name: "",
    method: "0",
    date_created: new Date().toISOString().split("T")[0],
    user_request: "",
    department_info: "",
    store_info: "",
    items: [
      { asset_id: "", serial: "", epc: null }
    ]
  });

  const [response, setResponse] = useState<AuditSessionResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { asset_id: "", serial: "", epc: null }]
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index)
      });
    }
  };

  const updateItem = (index: number, field: keyof AuditItem, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value === "" ? null : value };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      {/* Items List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold">Danh Sách Tài Sản</h3>
          <Button type="button" onClick={addItem} variant="outline" size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Thêm Tài Sản
          </Button>
        </div>

        <div className="space-y-3">
          {formData.items.map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Mã Tài Sản *</Label>
                    <Input
                      value={item.asset_id}
                      onChange={(e) => updateItem(index, "asset_id", e.target.value)}
                      placeholder="THIAVANG-001"
                      className="h-9"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Serial</Label>
                    <Input
                      value={item.serial || ""}
                      onChange={(e) => updateItem(index, "serial", e.target.value)}
                      placeholder="123"
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">EPC</Label>
                    <Input
                      value={item.epc || ""}
                      onChange={(e) => updateItem(index, "epc", e.target.value)}
                      placeholder="(null hoặc để trống)"
                      className="h-9"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={() => removeItem(index)}
                      variant="ghost"
                      size="sm"
                      className="h-9 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={formData.items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* JSON Preview */}
      <JSONPreview title="Request JSON" data={formData} />

      {/* Submit Button */}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? "Đang gửi..." : "Tạo Phiên Kiểm Kê"}
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