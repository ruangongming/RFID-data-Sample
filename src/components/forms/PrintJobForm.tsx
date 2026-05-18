import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Sparkles, Package } from "lucide-react";
import { JSONPreview } from "@/components/JSONPreview";
import { StatusBadge } from "@/components/StatusBadge";
import { saveToHistory } from "@/lib/historyStore";
import { generateAssets, addAssets, getAssets, type Asset } from "@/lib/assetStore";
import type { PrintJobRequest, PrintJobResponse } from "@/types/api";

export function PrintJobForm() {
  const [quantity, setQuantity] = useState<number>(10);
  const [formData, setFormData] = useState<PrintJobRequest>({
    session_print: "PE00001",
    session_name: "",
    date_created: new Date().toISOString().split("T")[0],
    select_temp: "template01",
    rfid_enable: true,
    labels: []
  });

  const [assets, setAssets] = useState<Asset[]>([]);
  const [totalAssets, setTotalAssets] = useState<number>(0);
  const [response, setResponse] = useState<PrintJobResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load total assets count on mount
  useEffect(() => {
    setTotalAssets(getAssets().length);
  }, []);

  const handleGenerateAssets = () => {
    if (quantity < 1 || !formData.session_print) {
      alert("Vui lòng nhập số lượng hợp lệ và mã phiên in");
      return;
    }

    // Generate assets with empty EPC
    const newAssets = generateAssets(
      quantity,
      formData.session_print,
      formData.session_name || "Tài sản"
    );

    setAssets(newAssets);

    // Convert to labels format for API
    const labels = newAssets.map(asset => ({
      name: asset.name,
      asset_code: asset.asset_code,
      serial: asset.serial,
      epc: "" // Empty - Simple RFID will generate
    }));

    setFormData({ ...formData, labels });
    
    // Save to store IMMEDIATELY (LocalStorage) so other tabs can use them without waiting for API
    addAssets(newAssets);
    setTotalAssets(getAssets().length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.labels.length === 0) {
      alert("Vui lòng tạo phiên in trước khi gửi");
      return;
    }

    setIsSubmitting(true);
    setResponse(null);

    try {
      const res = await fetch("/api/integration/create_print_job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setResponse(data);
      
      // Save to history
      saveToHistory({
        sessionType: "print_job",
        timestamp: new Date().toISOString(),
        status: data.respcode === "0" ? "success" : "error",
        request: formData,
        response: data
      });
    } catch (error) {
      const errorResponse = {
        respcode: "-1",
        errmsg: error instanceof Error ? error.message : "Lỗi kết nối",
        print_job_id: ""
      };
      setResponse(errorResponse);
      
      // Save error to history
      saveToHistory({
        sessionType: "print_job",
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
      {totalAssets > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-md">
          <Package className="h-4 w-4" />
          <span>Tổng số tài sản đã tạo: <span className="font-semibold font-mono">{totalAssets}</span></span>
        </div>
      )}

      {/* Session Info */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session_print">Mã Phiên In *</Label>
              <Input
                id="session_print"
                value={formData.session_print}
                onChange={(e) => setFormData({ ...formData, session_print: e.target.value })}
                placeholder="PE00001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="session_name">Tên Phiên In *</Label>
              <Input
                id="session_name"
                value={formData.session_name}
                onChange={(e) => setFormData({ ...formData, session_name: e.target.value })}
                placeholder="In 17 nhãn rfid metal"
                required
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
              <Label htmlFor="select_temp">Chọn Mẫu Tem</Label>
              <Input
                id="select_temp"
                value={formData.select_temp}
                onChange={(e) => setFormData({ ...formData, select_temp: e.target.value })}
                placeholder="template01"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rfid_enable"
              checked={formData.rfid_enable}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, rfid_enable: checked === true })
              }
            />
            <Label htmlFor="rfid_enable" className="font-normal cursor-pointer">
              Bật mã hóa RFID
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Generate Assets Section */}
      <Card className="border-accent/30">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-heading font-semibold">Tạo Phiên In/Encode</h3>
          
          <div className="flex gap-3 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="quantity">Số Lượng Tài Sản</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                placeholder="Nhập số lượng"
              />
            </div>
            <Button
              type="button"
              onClick={handleGenerateAssets}
              size="lg"
              className="bg-accent hover:bg-accent/90"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Tạo Phiên In
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Nhập số lượng và bấm "Tạo phiên in" để tự động sinh danh sách tài sản với EPC rỗng. 
            Simple RFID sẽ tự động sinh EPC sau khi nhận được phiên in.
          </p>
        </CardContent>
      </Card>

      {/* Generated Labels Display */}
      {formData.labels.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-heading font-semibold">
              Danh Sách Nhãn ({formData.labels.length})
            </h3>
          </div>

          <div className="border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">#</th>
                    <th className="px-4 py-3 text-left font-semibold">Tên Tài Sản</th>
                    <th className="px-4 py-3 text-left font-semibold">Mã Tài Sản</th>
                    <th className="px-4 py-3 text-left font-semibold">Serial</th>
                    <th className="px-4 py-3 text-left font-semibold">EPC</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {formData.labels.map((label, index) => (
                    <tr key={index} className="hover:bg-muted/20">
                      <td className="px-4 py-3 font-mono text-muted-foreground">{index + 1}</td>
                      <td className="px-4 py-3">{label.name}</td>
                      <td className="px-4 py-3 font-mono text-xs">{label.asset_code}</td>
                      <td className="px-4 py-3 font-mono">{label.serial}</td>
                      <td className="px-4 py-3 text-muted-foreground italic">
                        {label.epc || "(rỗng - Simple RFID sẽ sinh)"}
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
      {formData.labels.length > 0 && (
        <JSONPreview title="Request JSON" data={formData} />
      )}

      {/* Submit Button */}
      <Button 
        type="submit" 
        size="lg" 
        className="w-full" 
        disabled={isSubmitting || formData.labels.length === 0}
      >
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? "Đang gửi..." : "Gửi API Tạo Phiên In"}
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
            {response.respcode === "0" && response.print_job_id && (
              <p className="text-sm text-success">
                ✓ Đã lưu {formData.labels.length} tài sản vào kho. Print Job ID: <span className="font-mono font-semibold">{response.print_job_id}</span>
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </form>
  );
}