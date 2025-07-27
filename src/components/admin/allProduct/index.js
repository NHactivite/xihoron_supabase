"use client"
// import Newproduct from '@/app/admin/newProduct/page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import NewProduct from '../newProduct'
import { deleteProduct } from '@/action'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const AllProduct = ({products}) => {
 const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
 const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
const [productToEdit, setProductToEdit] = useState(null);
const router=useRouter()
  const openEditDialog = () => {
    setIsEditDialogOpen(true);
  };
  const openNewDialog = () => {
    setIsNewDialogOpen(true);
  };

 const handleDeleteProduct=async(id)=>{
   const res=await deleteProduct(id)
   res.success?toast.success(res.message):toast.success(res.message)
   router.replace("/admin/allProduct")
 }

    
 return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your flower bouquet inventory</p>
        </div>
        <div>
          <Button onClick={() => {openNewDialog()} }>Add Product </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Occasion</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product,idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12">
                          <Image
                            src={product.photos[0].url || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.details.color} • {product.details.flower} flowers • {product.details.netweight}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 5 ? "default" : "destructive"}>{product.stock} units</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{product.rating}</span>
                        <span className="text-sm text-muted-foreground">({product.numOfReviews})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.occasion}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => {setProductToEdit(product)|| openEditDialog()} }>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
     
     <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {productToEdit && (
            <NewProduct mode="edit" initialProduct={productToEdit} />
          )}
        </DialogContent>
      </Dialog>
     
     <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>
         
            <NewProduct mode="create" initialProduct={""}  />
          
        </DialogContent>
      </Dialog>
    </div>
  )
}


export default AllProduct