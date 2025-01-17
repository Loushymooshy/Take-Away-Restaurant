import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import OrderModal from "../components/OrderModal";

type Order = {
  id: number
  customerName: string
  items: string
  status: "pending" | "in-progress" | "completed"
  comment: string
  chefNote: string
  isLocked: boolean
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all") // Update 3
  const [nameFilter, setNameFilter] = useState<string>("")
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)

  useEffect(() => {
    const fetchedOrders: Order[] = [
      { id: 1, customerName: "Alice", items: "Sushi, Soda", status: "pending", comment: "", chefNote: "", isLocked: false },
      { id: 2, customerName: "Bob", items: "Roll, Soda", status: "in-progress", comment: "", chefNote: "", isLocked: true },
      { id: 3, customerName: "Charlie", items: "Soba, Sashimi, Soda", status: "completed", comment: "", chefNote: "", isLocked: true },
    ]
    setOrders(fetchedOrders)
    setFilteredOrders(fetchedOrders)
  }, [])

  useEffect(() => {
    let result = orders
    if (statusFilter && statusFilter !== "all") { // Update 2
      result = result.filter(order => order.status === statusFilter)
    }
    if (nameFilter) {
      result = result.filter(order => 
        order.customerName.toLowerCase().includes(nameFilter.toLowerCase())
      )
    }
    setFilteredOrders(result)
  }, [orders, statusFilter, nameFilter])

  const updateOrder = (id: number, updates: Partial<Order>) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, ...updates } : order
    ))
  }

  const lockOrder = (id: number) => {
    updateOrder(id, { isLocked: true, status: "in-progress" })
  }

  const completeOrder = (id: number) => {
    updateOrder(id, { status: "completed" })
  }

  const handleEditSave = () => {
    if (editingOrder) {
      updateOrder(editingOrder.id, editingOrder)
      setEditingOrder(null)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
      
      <div className="flex gap-4 mb-4">
        <Input 
          placeholder="Filter by customer name" 
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Comment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.items}</TableCell>
              <TableCell>
                <Badge className={order.status === "completed" ? "bg-themeGreen text-white  hover:bg-themeDarkGreen" : "bg-pandaWhite text-black hover:bg-themeCream " }>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Input 
                  value={order.comment} 
                  onChange={(e) => updateOrder(order.id, { comment: e.target.value })}
                  disabled={order.isLocked}
                />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Chef Note</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Chef Note</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="chefNote" className="text-right">
                            Note
                          </Label>
                          <Textarea 
                            id="chefNote" 
                            value={order.chefNote}
                            onChange={(e) => updateOrder(order.id, { chefNote: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {!order.isLocked && (
                    <Button className="w-full bg-themeGreen text-white  hover:bg-themeDarkGreen" onClick={() => lockOrder(order.id)} size="sm">
                      Lock
                    </Button>
                  )}
                  {order.status !== "completed" && (
                    <Button className="w-full bg-themeGreen text-white  hover:bg-themeDarkGreen" onClick={() => completeOrder(order.id)} size="sm">
                      Complete
                    </Button>
                  )}
                  <OrderModal order={editingOrder} onSave={handleEditSave} setEditingOrder={setEditingOrder} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}