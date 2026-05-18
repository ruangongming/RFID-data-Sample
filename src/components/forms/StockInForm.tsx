import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash2, Send } from "lucide-react";
import { JSONPreview } from "@/components/JSONPreview";
import { StatusBadge } from "@/components/StatusBadge";
import { saveToHistory } from "@/lib/historyStore";
import type { StockInRequest, StockInItem, StockInResponse } from "@/types/api";

export function StockInForm() {
  const [formData, setFormData] = useState<StockInRequest>({
    stockin_code: "PNK-" + new Date().toISOString().split("T")[0].replace(/-/g, "") + "-0001",
    stockin_name: "",
    created_at: new Date().toISOString(),
    warehouse_cd: "",
    warehouse_name: "",
    sender_person_cd: "",
    sender_person_name: "",
    sender_department: "",
    items: [
      { asset_id: "", epc: "" }
    ]
  });

  const [response, setResponse] = useState<StockInResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { asset_id: "", epc: "" }]
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

  const updateItem = (index: number, field: keyof StockInItem, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponse(null);

    try {
      const res = await fetch("/api/integration/stockin_note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setResponse(data);
      
      // Save to history
      saveToHistory({
        sessionType: "stockin",
        timestamp: new Date().toISOString(),
        status: data.respcode === "0" ? "success" : "error",
        request: formData,
        response: data
      });
    } catch (error) {
      const errorResponse = {
        respcode: "-1",
        errmsg: error instanceof Error ? error.message : "Lỗi kết nối",
        stockin_id: ""
      };
      setResponse(errorResponse);
      
      // Save error to history
      saveToHistory({
        sessionType: "stockin",
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
      {/* Stock In Info */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stockin_code">Mã Phiếu Nhập *</Label>
              <Input
                id="stockin_code"
                value={formData.stockin_code}
                onChange={(e) => setFormData({ ...formData, stockin_code: e.target.value })}
                placeholder="PNK-20260515-0001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockin_name">Tên Phiếu Nhập *</Label>
              <Input
                id="stockin_name"
                value={formData.stockin_name}
                onChange={(e) => setFormData({ ...formData, stockin_name: e.target.value })}
                placeholder="Phiếu nhập kho tài sản tháng 05"
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
            <h4 className="font-heading font-semibold mb-3">Người Gửi</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sender_person_cd">Mã Nhân Viên *</Label>
                <Input
                  id="sender_person_cd"
                  value={formData.sender_person_cd}
                  onChange={(e) => setFormData({ ...formData, sender_person_cd: e.target.value })}
                  placeholder="NV-123"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sender_person_name">Tên Nhân Viên *</Label>
                <Input
                  id="sender_person_name"
                  value={formData.sender_person_name}
                  onChange={(e) => setFormData({ ...formData, sender_person_name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sender_department">Phòng Ban *</Label>
                <Input
                  id="sender_department"
                  value={formData.sender_department}
                  onChange={(e) => setFormData({ ...formData, sender_department: e.target.value })}
                  placeholder="Phòng CNTT"
                  required
                />
              </div>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Mã Tài Sản *</Label>
                    <Input
                      value={item.asset_id}
                      onChange={(e) => updateItem(index, "asset_id", e.target.value)}
                      placeholder="AST-0001"
                      className="h-9"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Mã EPC *</Label>
                    <Input
                      value={item.epc}
                      onChange={(e) => updateItem(index, "epc", e.target.value)}
                      placeholder="EPC..1234567890"
                      className="h-9"
                      required
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
        {isSubmitting ? "Đang gửi..." : "Tạo Phiếu Nhập"}
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
            {response.respcode === "0" && response.stockin_id && (
              <p className="text-sm text-muted-foreground">
                Stock In ID: <span className="font-mono font-semibold">{response.stockin_id}</span>
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </form>
  );
}