import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, PackageOpen, PackagePlus, ClipboardCheck, History } from "lucide-react";
import { PrintJobForm } from "@/components/forms/PrintJobForm";
import { StockOutForm } from "@/components/forms/StockOutForm";
import { StockInForm } from "@/components/forms/StockInForm";
import { AuditSessionForm } from "@/components/forms/AuditSessionForm";
import { HistoryLog } from "@/components/HistoryLog";

export default function Home() {
  const [activeTab, setActiveTab] = useState("print");

  return (
    <>
      <SEO
        title="Simple RFID Simulator - Công cụ giả lập dữ liệu"
        description="Công cụ nội bộ để giả lập dữ liệu đầu vào cho hệ thống Simple RFID"
      />
      <main className="min-h-screen bg-background">
        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-heading text-primary mb-2">
              Simple RFID Simulator
            </h1>
            <p className="text-muted-foreground text-lg">
              Công cụ giả lập dữ liệu đầu vào cho hệ thống Simple RFID
            </p>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="print" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Phiên In</span>
              </TabsTrigger>
              <TabsTrigger value="stockout" className="flex items-center gap-2">
                <PackageOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Phiên Xuất</span>
              </TabsTrigger>
              <TabsTrigger value="stockin" className="flex items-center gap-2">
                <PackagePlus className="h-4 w-4" />
                <span className="hidden sm:inline">Phiên Nhập</span>
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Kiểm Kê</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Lịch Sử</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="print">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Tạo Phiên In/Encode</CardTitle>
                  <CardDescription>
                    Tạo session in và mã hóa RFID cho danh sách nhãn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PrintJobForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stockout">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Tạo Phiếu Xuất Kho</CardTitle>
                  <CardDescription>
                    Tạo phiếu xuất kho với thông tin tài sản và người nhận
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StockOutForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stockin">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Tạo Phiếu Nhập Kho</CardTitle>
                  <CardDescription>
                    Tạo phiếu nhập kho với thông tin tài sản và người gửi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StockInForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Tạo Phiên Kiểm Kê</CardTitle>
                  <CardDescription>
                    Tạo session kiểm kê tài sản với danh sách tài sản
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AuditSessionForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Lịch Sử Phiên</CardTitle>
                  <CardDescription>
                    Xem lại các phiên đã tạo và kết quả API
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HistoryLog />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}