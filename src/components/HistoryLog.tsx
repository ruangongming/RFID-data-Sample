import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { getHistory, clearHistory } from "@/lib/historyStore";
import { StatusBadge } from "@/components/StatusBadge";
import type { HistoryEntry } from "@/types/api";

export function HistoryLog() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClearHistory = () => {
    if (confirm("Xóa toàn bộ lịch sử?")) {
      clearHistory();
      setHistory([]);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      print_job: "Phiên In",
      stockout: "Phiếu Xuất",
      stockin: "Phiếu Nhập",
      audit: "Kiểm Kê"
    };
    return labels[type] || type;
  };

  const getTypeVariant = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      print_job: "default",
      stockout: "secondary",
      stockin: "secondary",
      audit: "outline"
    };
    return variants[type] || "default";
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Chưa có phiên nào được tạo. Hãy thử tạo phiên mới từ các tab trên.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Tổng số: <span className="font-semibold">{history.length}</span> phiên
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearHistory}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa Lịch Sử
        </Button>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-3">
          {history.map((entry) => (
            <Card key={entry.timestamp}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={getTypeVariant(entry.sessionType)}>
                        {getTypeLabel(entry.sessionType)}
                      </Badge>
                      <StatusBadge status={entry.status}>
                        {entry.status === "success" ? "Thành công" : "Lỗi"}
                      </StatusBadge>
                    </div>
                    <p className="text-sm font-mono text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedId(expandedId === entry.timestamp ? null : entry.timestamp)}
                  >
                    {expandedId === entry.timestamp ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {expandedId === entry.timestamp && (
                  <div className="space-y-3 pt-3 border-t">
                    <div>
                      <h5 className="text-xs font-semibold mb-2 text-muted-foreground">Request</h5>
                      <pre className="font-mono text-xs bg-muted/30 p-3 rounded-md overflow-auto max-h-[200px]">
                        {JSON.stringify(entry.request, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold mb-2 text-muted-foreground">Response</h5>
                      <pre className="font-mono text-xs bg-muted/30 p-3 rounded-md overflow-auto max-h-[200px]">
                        {JSON.stringify(entry.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}