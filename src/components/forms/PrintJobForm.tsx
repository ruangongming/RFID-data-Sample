import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash2, Send } from "lucide-react";
import { JSONPreview } from "@/components/JSONPreview";
import { StatusBadge } from "@/components/StatusBadge";
import type { PrintJobRequest, PrintJobLabel, PrintJobResponse } from "@/types/api";

export function PrintJobForm() {
  const [formData, setFormData] = useState<PrintJobRequest>({
    session_print: "PE00001",
    session_name: "",
    date_created: new Date().toISOString().split("T")[0],
    select_temp: "template01",
    rfid_enable: true,
    labels: [
      { name: "", prod_code: "", serial: "", epc: "" }
    ]
  });

  const [response, setResponse] = useState<PrintJobResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addLabel = () => {
    setFormData({
      ...formData,
      labels: [...formData.labels, { name: "", prod_code: "", serial: "", epc: "" }]
    });
  };

  const removeLabel = (index: number) => {
    if (formData.labels.length > 1) {
      setFormData({
        ...formData,
        labels: formData.labels.filter((_, i) => i !== index)
      });
    }
  };

  const updateLabel = (index: number, field: keyof PrintJobLabel, value: string) => {
    const newLabels = [...formData.labels];
    newLabels[index] = { ...newLabels[index], [field]: value };
    setFormData({ ...formData, labels: newLabels });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (error) {
      setResponse({
        respcode: "-1",
        errmsg: error instanceof Error ? error.message : "Lỗi kết nối",
        print_job_id: ""
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

      {/* Labels List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold">Danh Sách Nhãn</h3>
          <Button type="button" onClick={addLabel} variant="outline" size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Thêm Nhãn
          </Button>
        </div>

        <div className="space-y-3">
          {formData.labels.map((label, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Tên Sản Phẩm</Label>
                    <Input
                      value={label.name}
                      onChange={(e) => updateLabel(index, "name", e.target.value)}
                      placeholder="Elmich Workstation Tower"
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Mã Sản Phẩm</Label>
                    <Input
                      value={label.prod_code}
                      onChange={(e) => updateLabel(index, "prod_code", e.target.value)}
                      placeholder="VN-450558422995"
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Serial</Label>
                    <Input
                      value={label.serial}
                      onChange={(e) => updateLabel(index, "serial", e.target.value)}
                      placeholder="-1"
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">EPC</Label>
                    <Input
                      value={label.epc}
                      onChange={(e) => updateLabel(index, "epc", e.target.value)}
                      placeholder="E1"
                      className="h-9"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={() => removeLabel(index)}
                      variant="ghost"
                      size="sm"
                      className="h-9 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={formData.labels.length === 1}
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
        {isSubmitting ? "Đang gửi..." : "Tạo Phiên In"}
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
              <p className="text-sm text-muted-foreground">
                Print Job ID: <span className="font-mono font-semibold">{response.print_job_id}</span>
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </form>
  );
}