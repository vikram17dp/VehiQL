"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TabsTrigger, Tabs, TabsList, TabsContent } from "@/components/ui/tabs"
import { Calendar, Car, CheckCircle, Clock, DollarSign, Info, TrendingUp } from "lucide-react"
import { useState } from "react"

const Dashboard = ({ initialData }) => {
  const [activeTab, setActiveTab] = useState("overview")

  // Show error if data fetch failed
  if (!initialData || !initialData.success) {
    return (
      <Alert variant="destructive">
        <Info className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{initialData?.error || "Failed to load dashboard data"}</AlertDescription>
      </Alert>
    )
  }

  const { cars, testDrives } = initialData.data

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 rounded-xl">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-xs sm:max-w-md mx-auto grid grid-cols-2 mb-6">
          <TabsTrigger value="overview" className="text-sm font-medium">
            Overview
          </TabsTrigger>
          <TabsTrigger value="test-drives" className="text-sm font-medium">
            Test Drives
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg overflow-hidden shadow-md">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 flex flex-row items-center justify-between">
                <h3 className="text-sm font-medium">Total Cars</h3>
                <Car className="h-5 w-5" />
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-4">
                <div className="text-2xl sm:text-3xl font-bold text-purple-900 dark:text-purple-200">{cars.total}</div>
                <p className="text-xs text-purple-700 dark:text-purple-400">
                  {cars.available} available, {cars.sold} sold
                </p>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-md">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 flex flex-row items-center justify-between">
                <h3 className="text-sm font-medium">Test Drives</h3>
                <Calendar className="h-5 w-5" />
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 p-4">
                <div className="text-2xl sm:text-3xl font-bold text-teal-900 dark:text-teal-200">
                  {testDrives.total}
                </div>
                <p className="text-xs text-teal-700 dark:text-teal-400">
                  {testDrives.pending} pending, {testDrives.confirmed} confirmed
                </p>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-md">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 flex flex-row items-center justify-between">
                <h3 className="text-sm font-medium">Conversion Rate</h3>
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 p-4">
                <div className="text-2xl sm:text-3xl font-bold text-amber-900 dark:text-amber-200">
                  {testDrives.conversionRate}%
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400">From test drives to sales</p>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-md">
              <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white p-4 flex flex-row items-center justify-between">
                <h3 className="text-sm font-medium">Cars Sold</h3>
                <DollarSign className="h-5 w-5" />
              </div>
              <div className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900 p-4">
                <div className="text-2xl sm:text-3xl font-bold text-rose-900 dark:text-rose-200">{cars.sold}</div>
                <p className="text-xs text-rose-700 dark:text-rose-400">
                  {((cars.sold / cars.total) * 100).toFixed(1)}% of inventory
                </p>
              </div>
            </div>
          </div>

          {/* Additional Overview Content */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-pink-500 to-purple-400 text-white p-4">
              <h2 className="text-xl font-medium">Dealership Summary</h2>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-4 rounded-xl shadow-sm">
                    <h3 className="font-medium text-sm mb-3 text-slate-700 dark:text-slate-300">Car Inventory</h3>
                    <div className="flex items-center">
                      <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full"
                          style={{
                            width: `${(cars.available / cars.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {((cars.available / cars.total) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Available inventory capacity</p>
                  </div>

                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-4 rounded-xl shadow-sm">
                    <h3 className="font-medium text-sm mb-3 text-slate-700 dark:text-slate-300">Test Drive Success</h3>
                    <div className="flex items-center">
                      <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-violet-400 to-purple-500 h-3 rounded-full"
                          style={{
                            width: `${(testDrives.completed / (testDrives.total || 1)) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-violet-600 dark:text-violet-400">
                        {((testDrives.completed / (testDrives.total || 1)) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Completed test drives</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 shadow-sm">
                    <span className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {cars.sold}
                    </span>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Cars Sold</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/40 shadow-sm">
                    <span className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
                      {testDrives.pending + testDrives.confirmed}
                    </span>
                    <p className="text-sm text-amber-700 dark:text-amber-300">Upcoming Test Drives</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/40 shadow-sm">
                    <span className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {((cars.available / (cars.total || 1)) * 100).toFixed(0)}%
                    </span>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">Inventory Utilization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Test Drives Tab */}
        <TabsContent value="test-drives" className="space-y-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg overflow-hidden shadow-md">
              <div className="bg-gradient-to-r from-violet-500 to-violet-600 text-white p-4 flex flex-row items-center justify-between">
                <h3 className="text-sm font-medium">Total Bookings</h3>
                <Calendar className="h-5 w-5" />
              </div>
              <div className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900 p-6">
                <div className="text-2xl sm:text-3xl font-bold text-violet-900 dark:text-violet-200">
                  {testDrives.total}
                </div>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-md">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 flex flex-row items-center justify-between">
                <h3 className="text-sm font-medium">Pending</h3>
                <Clock className="h-5 w-5" />
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 p-4">
                <div className="text-2xl sm:text-3xl font-bold text-amber-900 dark:text-amber-200">
                  {testDrives.pending}
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  {((testDrives.pending / testDrives.total) * 100).toFixed(1)}% of bookings
                </p>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-md">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 flex flex-row items-center justify-between">
                <h3 className="text-sm font-medium">Confirmed</h3>
                <CheckCircle className="h-5 w-5" />
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 p-4">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-900 dark:text-emerald-200">
                  {testDrives.confirmed}
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  {((testDrives.confirmed / testDrives.total) * 100).toFixed(1)}% of bookings
                </p>
              </div>
            </div>
          </div>

          {/* Test Drive Status Visualization */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-pink-500 to-purple-400 text-white p-4">
              <h2 className="text-xl font-medium">Test Drive Statistics</h2>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Conversion Rate Card */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-4 rounded-xl shadow-sm">
                    <h3 className="text-lg font-medium mb-2 text-slate-800 dark:text-slate-200">Conversion Rate</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-violet-600 dark:text-violet-400">
                      {testDrives.conversionRate}%
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Test drives resulting in car purchases</p>
                  </div>

                  {/* Test Drive Success Rate */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-4 rounded-xl shadow-sm">
                    <h3 className="text-lg font-medium mb-2 text-slate-800 dark:text-slate-200">Completion Rate</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {testDrives.total ? ((testDrives.completed / testDrives.total) * 100).toFixed(1) : 0}%
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Test drives successfully completed</p>
                  </div>
                </div>

                {/* Status Breakdown */}
                <div className="space-y-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-4 rounded-xl shadow-sm">
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">Booking Status Breakdown</h3>

                  {/* Pending */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-300">Pending</span>
                      <span className="font-medium text-amber-600 dark:text-amber-400">
                        {testDrives.pending} ({((testDrives.pending / testDrives.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-amber-500 h-2.5 rounded-full"
                        style={{
                          width: `${(testDrives.pending / testDrives.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Confirmed */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-300">Confirmed</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {testDrives.confirmed} ({((testDrives.confirmed / testDrives.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2.5 rounded-full"
                        style={{
                          width: `${(testDrives.confirmed / testDrives.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Completed */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-300">Completed</span>
                      <span className="font-medium text-violet-600 dark:text-violet-400">
                        {testDrives.completed} ({((testDrives.completed / testDrives.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-violet-400 to-violet-500 h-2.5 rounded-full"
                        style={{
                          width: `${(testDrives.completed / testDrives.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Cancelled */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-300">Cancelled</span>
                      <span className="font-medium text-rose-600 dark:text-rose-400">
                        {testDrives.cancelled} ({((testDrives.cancelled / testDrives.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-rose-400 to-rose-500 h-2.5 rounded-full"
                        style={{
                          width: `${(testDrives.cancelled / testDrives.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* No Show */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-300">No Show</span>
                      <span className="font-medium text-slate-600 dark:text-slate-400">
                        {testDrives.noShow} ({((testDrives.noShow / testDrives.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-slate-400 to-slate-500 h-2.5 rounded-full"
                        style={{
                          width: `${(testDrives.noShow / testDrives.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Dashboard
